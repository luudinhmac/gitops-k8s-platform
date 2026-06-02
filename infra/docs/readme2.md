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
    kubectl patch app portfolio-backend-staging -n argocd --type merge -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "normal"}}}'
    ```

*   **Xem lỗi đồng bộ hoặc log của ArgoCD Server**:
    ```bash
    kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
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
1. **Viết Code**: Developer làm việc trên 2 repo riêng biệt (`portfolio-frontend` và `portfolio-backend`).
2. **Commit & Push**: Lên code ở nhánh `dev` hoặc tag `v*` của từng repo.
3. **CI/CD Tự động**:
   - **GitLab CI** tự động chạy Test, Build Docker Image.
   - CI script tự động thực hiện **Direct Git Push** để cập nhật mã Image Tag vào file `environments/staging/*-values.yaml` trên repo `infra` này.
4. **ArgoCD Tự động Sync**: ArgoCD phát hiện repo `infra` có commit mới, tự động báo K8s tạo Pod mới.

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
URL: [https://k8s.luumac.io.vn](https://k8s.luumac.io.vn)

---

## 5. Xử lý sự cố (Troubleshooting)

### Lỗi ArgoCD Redirect quá nhiều lần (Too many redirects)
```bash
kubectl patch deployment argocd-server -n argocd --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--insecure"}]'
```

### Lỗi SSL "Not Secure" trên trình duyệt
Đảm bảo đã tạo Secret từ chứng chỉ Wildcard trong namespace `argocd`:
```bash
kubectl create secret tls luumac-wildcard-tls --cert=path/to/fullchain.pem --key=path/to/privkey.pem -n argocd
```

### Lỗi `P1001: Can't reach database` (Kết nối DB thất bại)
1.  **Kiểm tra Hostname**: Đảm bảo dùng đúng tên Service (ví dụ: `postgres-staging.database`).
2.  **Ký tự đặc biệt**: Nếu mật khẩu có dấu `@`, phải mã hóa thành `%40` trong chuỗi URL.

---

## 6. Quy trình chuẩn về Database Migration (Prisma)

### Quy trình thay đổi Database an toàn:
1.  **Tại máy Local**: Sau khi thay đổi file `schema.prisma`, chạy lệnh:
    ```bash
    npx prisma migrate dev --name <ten_tinh_nang>
    ```
2.  **Commit lên Git**: Commit thư mục `prisma/migrations` vào Repo App (Backend).
3.  **Tự động Deploy**: Khi Pod khởi chạy trên K8s, Init Container sẽ tự động chạy lệnh `prisma migrate deploy` để cập nhật Database.

---

## 7. Cấu hình GitLab CI/CD Variables

Cấu hình tại Repo Backend & Frontend (Ứng dụng):
*   **`GITLAB_API_TOKEN`**: Personal Access Token của repo **Infra** (quyền `write_repository`).
*   **`CI_REGISTRY_USER`** / **`CI_REGISTRY_PASSWORD`**: Tài khoản Docker Hub.

