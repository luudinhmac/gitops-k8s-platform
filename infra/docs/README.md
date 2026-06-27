# Portfolio Infrastructure (GitOps Mode)

Dự án quản lý hạ tầng Kubernetes cho hệ thống Portfolio sử dụng mô hình **GitOps** với **ArgoCD**.

## 1. Khởi tạo Cluster (Ansible)
Sử dụng Ansible node (`192.168.157.50`) để cài đặt K8s, Cilium, Traefik, Cert-Manager và ArgoCD.

```powershell
# Chạy playbook từ Ansible node
ssh macld@192.168.157.50 "cd /home/macld/portfolio-infratructure/ansible && ansible-playbook -i inventory.ini playbooks/setup_cluster.yml --extra-vars 'ansible_become_pass=admin'"
```

## 2. Quản lý Hạ tầng với ArgoCD

### Truy cập Dashboard
*   **URL**: [https://argocd.luumac.io.vn](https://argocd.luumac.io.vn)
*   **Username**: `admin`
*   **Lấy mật khẩu**:
    ```bash
    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
    ```

### Kích hoạt GitOps (Bootstrap)
Nếu chưa thấy các ứng dụng hiện trên Dashboard, chạy lệnh sau:
```bash
kubectl apply -f argocd/applications/
```

### Các lệnh kiểm tra & Quản lý
*   **Kiểm tra thời gian quét định kỳ (Reconciliation Timeout)**:
    ```bash
    kubectl -n argocd get cm argocd-cm -o jsonpath='{.data.timeout\.reconciliation}'
    ```
    *(Nếu trống, giá trị mặc định là 180s - 3 phút)*

*   **Ép ArgoCD quét Git ngay lập tức (Refresh)**:
    ```bash
    # Yêu cầu cài đặt ArgoCD CLI hoặc dùng kubectl patch (cho nâng cao)
    kubectl patch app portfolio-backend-staging -n argocd --type merge -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "normal"}}}'
    ```

*   **Xem lỗi đồng bộ hoặc log của ArgoCD Server**:
    ```bash
    kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
    ```

*   **Liệt kê trạng thái các ứng dụng**:
    ```bash
    kubectl get applications -n argocd
    ```

### Cấu hình xác thực Git (Credentials)
Nếu ArgoCD báo lỗi `Access Denied` hoặc `Authentication required` khi kéo code từ GitLab, bạn cần cập nhật Token:

1.  **Lấy Token mới trên GitLab**: Preference > Access Tokens > Tạo token với quyền `read_repository`.
2.  **Cập nhật vào Cluster**:
    ```bash
    # Xóa secret cũ (nếu có)
    kubectl delete secret -n argocd -l argocd.argoproj.io/secret-type=repository

    # Tạo secret mới chứa Token
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Secret
    metadata:
      name: portfolio-infra-repo-creds
      namespace: argocd
      labels:
        argocd.argoproj.io/secret-type: repository
    stringData:
      type: git
      url: https://gitlab.com/portfolio-macld/portfolio-infratructure.git
      username: portfolio-macld
      password: <MÃ_TOKEN_CỦA_BẠN>
    EOF
    ```

## 3. Quy trình Triển khai (Workflow)

Hệ thống sử dụng kiến trúc **Microservices (Frontend / Backend tách biệt)** và **GitOps**.

### Workflow Hàng Ngày (Phát triển tính năng):
1. **Viết Code**: Developer làm việc trên 2 repo riêng biệt (Frontend: [../../frontend](../../frontend) và Backend: [../../backend](../../backend)).
2. **Commit & Push**: Lên code ở nhánh `dev` hoặc tag `v*` của từng repo.
3. **CI/CD Tự động**:
   - **GitLab CI** tự động chạy Test, Build Docker Image.
   - CI script tự động thực hiện **Direct Git Push** để cập nhật mã Image Tag vào file `environments/staging/*-values.yaml` trên repo [infra](../../infra) này.
4. **ArgoCD Tự động Sync**: ArgoCD phát hiện repo [infra](../../infra) có commit mới, tự động báo K8s tạo Pod mới. Riêng Backend sẽ chạy Init Container để migrate DB trước khi khởi động.

## 4. Các lệnh hữu ích

### Kiểm tra Pods
```bash
kubectl get pods -n portfolio      # App Staging
kubectl get pods -n database       # DB Staging
kubectl get pods -n argocd         # ArgoCD System
```

### Truy cập Database (psql)
```bash
kubectl exec -it postgres-0 -n database -- psql -U portfolio_user -d portfolio_staging
```

### Truy cập Kubernetes Dashboard
Dashboard được quản lý trong namespace `kubernetes-dashboard`.

![Kubernetes Dashboard](../../images/k8s-dashboard-pod.png)

#### 1. Lấy Token đăng nhập
*   **Token tạm thời (24h)**:
    ```bash
    kubectl create token admin-user -n kubernetes-dashboard --duration=24h
    ```
*   **Token vĩnh viễn**: Tạo Secret tĩnh (chỉ làm 1 lần) và lấy token:
    ```bash
    # Tạo Secret
    kubectl apply -f https://gitlab.com/portfolio-macld/portfolio-infratructure/-/raw/main/manifests/dashboard-ingress.yaml # (Nếu chưa áp dụng ingress)
    # Lấy mã token
    kubectl get secret admin-user-token-permanent -n kubernetes-dashboard -o jsonpath="{.data.token}" | base64 -d
    ```

#### 2. Các phương thức truy cập
*   **Cách A: Truy cập qua tên miền (Cố định)**:
    *   URL: [https://k8s.luumac.io.vn](https://k8s.luumac.io.vn)
    *   Yêu cầu: Đã áp dụng file `manifests/dashboard-ingress.yaml`.

*   **Cách B: Port-Forward (Tạm thời - An toàn)**:
    ```bash
    kubectl port-forward -n kubernetes-dashboard --address 0.0.0.0 service/kubernetes-dashboard 8443:443
    ```
    *   URL: `https://<IP-SERVER>:8443`

*   **Cách C: Kubectl Proxy (Tạm thời)**:
    ```bash
    kubectl proxy --address='0.0.0.0' --accept-hosts='^*$'
    ```
    *   URL: `http://<IP-SERVER>:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/`

## 5. Xử lý sự cố (Troubleshooting)

### Lỗi ArgoCD Redirect quá nhiều lần (Too many redirects)
Nếu gặp lỗi này khi vào Dashboard, chạy lệnh sau để chạy ArgoCD ở chế độ insecure (do Traefik đã lo phần TLS):
```bash
kubectl patch deployment argocd-server -n argocd --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--insecure"}]'
```

### Lỗi SSL "Not Secure" trên trình duyệt
Đảm bảo đã tạo Secret từ chứng chỉ Wildcard của bạn trong namespace `argocd`:
```bash
kubectl create secret tls luumac-wildcard-tls --cert=path/to/fullchain.pem --key=path/to/privkey.pem -n argocd
```

### Lỗi Divergent Branches khi Git Pull trên Ansible Node
Nếu máy Ansible bị lệch code và không thể pull, dùng lệnh reset:
```bash
git fetch origin && git reset --hard origin/feature/k8s-staging-setup
```

### Lỗi `Init:CreateContainerConfigError` (Thiếu Secret)
Thường do chưa tạo Secret `portfolio-secrets`. Cần tạo thủ công:
```bash
kubectl create secret generic portfolio-secrets -n portfolio \
  --from-literal=DATABASE_URL="postgresql://user:pass@host:5432/db" \
  --from-literal=JWT_SECRET="your_secret"
```

### Lỗi `P1001: Can't reach database` (Kết nối DB thất bại)
1.  **Kiểm tra Hostname**: Đảm bảo dùng đúng tên Service (ví dụ: `postgres-staging.database`).
2.  **Ký tự đặc biệt**: Nếu mật khẩu có dấu `@`, phải mã hóa thành `%40` trong chuỗi URL.

### Lỗi `The table public.User does not exist` (Chưa chạy Migration)
Nếu Docker Image không chứa thư mục `migrations`, lệnh `migrate deploy` sẽ không làm gì.
**Cách fix nhanh cho Staging**: Chạy lệnh `db push` thủ công:
```bash
kubectl exec -it <pod-backend> -n portfolio -- npx prisma db push
```

---

## 6. Quy trình chuẩn về Database Migration (Prisma)

Hệ thống đã được cấu hình Baseline chuẩn cho Production. **Tuyệt đối không sử dụng `db push` để tránh mất dữ liệu**.

### Quy trình thay đổi Database an toàn:
1.  **Tại máy Local**: Sau khi thay đổi file `schema.prisma`, bạn bắt buộc tạo file migration bằng lệnh:
    ```bash
    npx prisma migrate dev --name <ten_tinh_nang>
    ```
2.  **Commit lên Git**: Bạn **PHẢI** commit thư mục `prisma/migrations` vừa sinh ra vào Repo App (Backend).
3.  **Tự động Deploy**: Khi Docker Image được build, nó sẽ mang theo các file SQL này. Khi Pod khởi chạy trên K8s, Init Container sẽ tự động chạy lệnh `prisma migrate deploy` để cập nhật Database bằng file SQL một cách an toàn tuyệt đối.

---

## 7. Cấu hình GitLab CI/CD Variables

Để các pipeline chạy thông suốt, bạn cần cấu hình các biến sau trên GitLab (**Settings > CI/CD > Variables**):

### Tại Repo Infrastructure ([../../infra](../../infra) - Quản lý chung)
*   **`KUBECONFIG`** (Type: File): Chứa nội dung file cấu hình truy cập Cluster.
*   **`STAGING_DATABASE_URL`**: URL kết nối Postgres Staging.
*   **`STAGING_JWT_SECRET`**: Khóa bí mật dùng cho Staging.
*   **`PROD_DATABASE_URL`**: URL kết nối Postgres Production.
*   **`PROD_JWT_SECRET`**: Khóa bí mật dùng cho Production.
 
### Tại Repo Backend & Frontend (Ứng dụng: [../../backend](../../backend) & [../../frontend](../../frontend))
*   **`GITLAB_API_TOKEN`**: Personal Access Token hoặc Project Access Token của repo **Infra** (cần quyền `write_repository`) để CI của App có thể tự động `clone`, `commit` và `push` cập nhật Tag vào Infra.
*   **`CI_REGISTRY_USER`** / **`CI_REGISTRY_PASSWORD`**: Tài khoản Docker Hub để push/pull image.

---
*Lưu ý: Luôn đảm bảo repo Infra trên máy Ansible node được cập nhật mới nhất bằng lệnh `git pull` trước khi chạy Ansible.*

---

## 8. Quy trình thiết lập Server Mới (Disaster Recovery / Mở rộng)

Nhờ mô hình GitOps, việc dời nhà sang server mới chỉ mất 15 phút:
1. Cài đặt Kubernetes (K3s/MicroK8s), Traefik, Cert-manager và ArgoCD trên server mới.
2. Tạo Secret thủ công (chứa các thông tin không được phép đẩy lên Git):
    ```bash
    kubectl create namespace portfolio
    kubectl create secret generic portfolio-secrets -n portfolio \
      --from-literal=DATABASE_URL="postgresql://portfolio_user:macld@2026@postgres-staging.database:5432/portfolio_staging" \
      --from-literal=JWT_SECRET="chuoi-bi-mat"
    ```
3. Khai báo 1 Application duy nhất trên ArgoCD trỏ về repo `portfolio-infratructure` nhánh `main`. ArgoCD sẽ tự động: dựng DB, tạo bảng (qua `migrate deploy`), xin SSL và chạy App.
4. Chạy script `seed_db.sh` từ nhánh code backend để khởi tạo dữ liệu Admin đầu tiên.
