# HƯỚNG DẪN VẬN HÀNH TIÊU CHUẨN (STANDARD DEPLOYMENT PLAYBOOK)
*Tài liệu hướng dẫn triển khai từ đầu (From Scratch) cho cụm Kubernetes Staging & Production*

---

## MỤC TIÊU (OBJECTIVE)
Cung cấp một **quy trình chuẩn hóa, khép kín từ A-Z** giúp bạn dễ dàng dựng mới, cấu hình và vận hành hệ thống Portfolio & Blog trên bất kỳ cụm máy chủ VPS mới nào mà không gặp phải bất kỳ lỗi liên kết, phân quyền hay cơ sở dữ liệu nào.

---

## BẢN ĐỒ TIẾN TRÌNH TRIỂN KHAI (DEPLOYMENT WORKFLOW)

```mermaid
graph TD
    Phase1[BƯỚC 1: KIỂM TRA HẠ TẦNG] --> Phase2[BƯỚC 2: CẤU HÌNH GITLAB CI/CD]
    Phase2 --> Phase3[BƯỚC 3: NẠP K8S SECRETS]
    Phase3 --> Phase4[BƯỚC 4: TRIỂN KHAI ỨNG DỤNG GITOPS]
    Phase4 --> Phase5[BƯỚC 5: HẬU KIỂM VÀ HEALTH CHECK]
```

---

## 🔌 GIAI ĐOẠN 1: KIỂM TRA KẾT NỐI HẠ TẦNG (PRE-CHECKS & CONNECTIVITY)

Trước khi thực hiện bất kỳ lệnh deploy nào, hãy đảm bảo máy tính cá nhân của bạn kết nối được tới VPS và cụm Kubernetes đang hoạt động khỏe mạnh.

### Bước 1.0: Kết nối từ xa qua SSH Tunnel (Bắt buộc)
Do K8s API Server chỉ lắng nghe ở địa chỉ nội bộ để bảo mật, bạn cần thiết lập một SSH Tunnel ngầm từ máy cá nhân trước khi sử dụng `kubectl`:

1. **Khởi chạy tiến trình SSH Tunnel ngầm (chạy trên PowerShell local):**
   ```powershell
   # Mở tunnel ngầm chuyển tiếp cổng 6443 về máy chủ
   Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
   ```

2. **Cập nhật file cấu hình Kubeconfig (`C:\Users\Mac\.kube\config`):**
   Đảm bảo cấu hình cụm trỏ về localhost và sử dụng `tls-server-name` để khớp với SANs trong chứng chỉ của máy chủ:
   ```yaml
   clusters:
   - cluster:
       server: https://127.0.0.1:6443
       tls-server-name: 10.200.0.1
   ```

### Lệnh 1.1: Kiểm tra kết nối tới cụm Kubernetes (K8s API)
```bash
# Xem thông tin cụm máy chủ K8s
kubectl cluster-info

# Đảm bảo các Node trong cụm đều ở trạng thái Ready
kubectl get nodes -o wide
```

### Lệnh 1.2: Kiểm tra trạng thái Ingress Gateway (Traefik / Nginx)
```bash
# Kiểm tra Ingress Controller có đang chạy không
kubectl get pods -n infra -l app.kubernetes.io/name=traefik
```

### Lệnh 1.3: Kiểm tra các Volume lưu trữ (PVC) để tránh mất mát dữ liệu
```bash
# Kiểm tra các PVC trên Staging (portfolio) và Production (production)
kubectl get pvc -n portfolio
kubectl get pvc -n production
```

---

## GIAI ĐOẠN 2: THIẾT LẬP BIẾN MÔI TRƯỜNG & CREDENTIALS TRÊN GITLAB (GITLAB CI/CD SETUP)

Tất cả các Pipeline build và deploy của cả **Frontend** và **Backend** đều cần các biến môi trường để xác thực. Bạn cần truy cập vào giao diện web GitLab của từng dự án: **Settings > CI/CD > Variables** để nạp cấu hình:

### 2.1. Danh sách các biến CI/CD bắt buộc

| Tên biến (Key) | Mô tả (Description) | Giá trị mẫu (Value) | Lưu ý Bảo mật (Flags) |
| :--- | :--- | :--- | :--- |
| **`CI_REGISTRY_USER`** | Username tài khoản Docker Hub của bạn | `luudinhmac` | `Protect: OFF`, `Mask: OFF` |
| **`CI_REGISTRY_PASSWORD`**| Token hoặc Mật khẩu đăng nhập Docker Hub | `dckr_pat_xxxx...` | `Protect: OFF`, **`Mask: ON`** |
| **`GITLAB_API_TOKEN`** | Token có quyền ghi vào Repo `portfolio-infratructure` | `glpat-xxxx...` | `Protect: OFF`, **`Mask: ON`** |

### Quy tắc Vàng khi cài đặt Biến trên GitLab (CRITICAL):
1.  **`Protect Variable` = OFF**: Bạn **bắt buộc phải bỏ tích** chọn mục này. Nếu tích chọn `Protect Variable`, biến đó sẽ CHỈ được truyền vào các pipeline chạy trên nhánh được bảo vệ (`main`). Khi bạn chạy thử trên nhánh phát triển (`dev`), biến này sẽ bị rỗng -> Gây ra lỗi `Access denied` hoặc không thể Login Docker Registry.
2.  **`Mask Variable` = ON**: Tích chọn mục này để tự động ẩn các chuỗi bảo mật (Token, Password) trong log của GitLab Runner, tránh lộ thông tin.

---

## GIAI ĐOẠN 3: NẠP KHÓA BẢO MẬT TRỰC TIẾP TRÊN KUBERNETES (K8S SECRETS)

Các khóa bảo mật của ứng dụng không được phép đưa lên Git dưới bất kỳ hình thức nào. Chúng ta sẽ nạp trực tiếp vào cụm K8s.

### Lệnh 3.1: Nạp Secret cho môi trường Production (Namespace: `production`)
```bash
kubectl create secret generic portfolio-secrets -n production \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-production.database-production:5432/portfolio_production" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```

### Lệnh 3.2: Nạp Secret cho môi trường Staging (Namespace: `portfolio`)
```bash
kubectl create secret generic portfolio-secrets -n portfolio \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-staging.database:5432/portfolio_staging" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```

### Lưu ý đặc biệt về cấu hình Database URL:
*   **Mã hóa ký tự đặc biệt:** Nếu mật khẩu database của bạn chứa ký tự `@` (ví dụ: `macld@2026`), bạn **bắt buộc phải mã hóa URL (URL Encoding)** ký tự `@` thành **`%40`** (ví dụ: `macld%402026`). Nếu không, Prisma sẽ phân tích cú pháp sai và báo lỗi không thể kết nối Database!
*   **JWT_SECRET:** Hãy sinh chuỗi Base64 mạnh mẽ 32 ký tự bằng lệnh:
    ```bash
    openssl rand -base64 32
    ```

---

## 💻 GIAI ĐOẠN 4: THIẾT LẬP FILE `.env` CHO DEVELOPER (LOCAL ENV FILES)

Khi làm việc hoặc debug trực tiếp từ máy tính cá nhân trỏ về cụm K8s, hãy sử dụng các cấu hình file `.env` chuẩn sau:

### 4.1. File `.env` cho dự án Backend (`/backend/.env`)
```env
# Chuỗi kết nối Database trỏ về Cổng Port-Forward (localhost:5432) khi debug
DATABASE_URL="postgresql://portfolio_user:macld%402026@localhost:5432/portfolio_production"

# Khóa JWT dùng để mã hóa token
JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="

# Múi giờ chuẩn hệ thống
TZ="Asia/Ho_Chi_Minh"
PORT=3001
```

### 4.2. File `.env` cho dự án Frontend (`/frontend/.env`)
```env
# Môi trường chạy
NODE_ENV="production"

# API Endpoint trỏ về Reverse Proxy của Next.js
INTERNAL_API_URL="http://localhost:3001/api/v1"
```

---

## GIAI ĐOẠN 5: QUY TRÌNH DEPLOY CHUẨN (DEPLOY PROCESS)

Quy trình deploy được chia thành hai nhánh tự động hóa hoàn toàn bằng GitOps qua GitLab và ArgoCD:

### 5.1. Quy trình Deploy lên STAGING (Tự động 100%)
1.  Developer thực hiện thay đổi code trên máy cá nhân.
2.  Commit và push code lên nhánh **`dev`** của các repo ứng dụng (`portfolio-frontend` hoặc `portfolio-backend`).
3.  **GitLab CI tự động:**
    *   Tự động chạy bộ kiểm tra lỗi cú pháp (Lint).
    *   Tự động đóng gói Docker Image với tag `dev-<Short-SHA>`.
    *   Tập lệnh CI tự động kết nối bằng SSH/Git và đẩy tag mới này vào file cấu hình `staging/backend-values.yaml` (hoặc `frontend-values.yaml`) trong kho lưu trữ `infra-repo`.
4.  **ArgoCD tự động:** Phát hiện sự thay đổi trên Git và tự cập nhật ứng dụng chạy trên cụm K8s Staging.

### 5.2. Quy trình Deploy lên PRODUCTION (An toàn - Manual Trigger)
1.  Tạo một **Merge Request** từ nhánh **`dev`** vào nhánh **`main`** trên GitLab.
2.  Sau khi MR được duyệt và gộp vào `main`, hãy vào mục **Repository > Tags** trên GitLab.
3.  Tạo một Tag mới bắt đầu bằng ký tự **`v`** (Ví dụ: **`v1.0.10`**) từ nhánh `main`.
4.  **GitLab CI tự động:**
    *   Kích hoạt job `build_production` để đóng gói Docker Image với mã tag chính xác `v1.0.10`.
5.  **Kích hoạt thủ công (Manual Action):**
    *   Vào giao diện Pipeline của GitLab, tìm Job **`deploy_production`**.
    *   Click vào nút **Play/Run** để kích hoạt bằng tay. Job này sẽ tự động thay đổi tag phiên bản thành `v1.0.10` trong file cấu hình `production/backend-values.yaml` trên repo Infra.
6.  **ArgoCD** sẽ tự động đồng bộ và cập nhật phiên bản mới nhất cho toàn bộ người dùng mà không gây gián đoạn hệ thống (Zero-Downtime Rolling Update).

---

## GIAI ĐOẠN 6: KIỂM TRA SỨC KHỎE HỆ THỐNG & DIAGNOSTICS (POST-DEPLOY & HEALTH CHECKS)

Sau khi deploy hoàn tất, hãy chạy các lệnh kiểm tra sau để đảm bảo hệ thống vận hành hoàn hảo không lỗi:

### Lệnh 6.1: Đảm bảo toàn bộ Pods đều ở trạng thái `1/1 Running`
```bash
# Kiểm tra môi trường Staging
kubectl get pods -n portfolio

# Kiểm tra môi trường Production
kubectl get pods -n production
```

### Lệnh 6.2: Kiểm tra Tiến trình khởi chạy cơ sở dữ liệu (Migrations Check)
Nếu Pod Backend bị lỗi khởi động, hãy kiểm tra ngay nhật ký của container Migration xem database đã được khởi tạo bảng thành công chưa:
```bash
# Kiểm tra log migration môi trường Production
kubectl logs deployment/portfolio-backend-production -n production -c prisma-migrate

# Kiểm tra log migration môi trường Staging
kubectl logs deployment/portfolio-backend-staging -n portfolio -c prisma-migrate
```
*Yêu cầu dòng cuối cùng xuất hiện:* `Migrations applied successfully` hoặc `No pending migrations to apply`.

### Lệnh 6.3: Kiểm tra log của tiến trình chính Backend
```bash
# Xem log Backend Production để kiểm tra kết nối Database thực tế
kubectl logs deployment/portfolio-backend-production -n production -c backend --tail=100
```
*Yêu cầu xuất hiện dòng:* `[Database] Successfully connected to: portfolio_production`.

---

## GIAI ĐOẠN 7: BẢN VÁ KHI DATABASE BỊ KẸT MIGRATIONS GIẢ (FALSE-POSITIVE MIGRATIONS FIX)

Nếu vô tình chạy Migration bị lỗi (như lỗi ký tự BOM `\ufeff` trước đây) khiến Prisma bị "kẹt" metadata giả và không chịu tạo bảng ở các lần deploy tiếp theo, hãy chạy đúng chuỗi lệnh cứu hộ sau:

```bash
# 1. Tạm thời hạ Pod Backend về 0 để ngắt sạch kết nối cũ đang bị khóa
kubectl scale deployment/portfolio-backend-production -n production --replicas=0

# 2. Thực hiện xóa hẳn database lỗi cũ đi và tạo mới database sạch
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"

# 3. Kéo Pod hoạt động trở lại lên 1
kubectl scale deployment/portfolio-backend-production -n production --replicas=1

# 4. Kiểm tra log của Pod mới chạy lên, K8s sẽ tự động chạy lại bộ migration sạch sẽ 100%!
kubectl logs deployment/portfolio-backend-production -n production -c prisma-migrate
```
*(Bạn làm tương tự cho namespace `portfolio` nếu Staging bị kẹt).*

---

## GIAI ĐOẠN 8: TỰ ĐỘNG MỞ RỘNG QUY MÔ POD (HORIZONTAL POD AUTOSCALER - HPA)

Để tự động điều chỉnh số lượng Pod dựa trên lưu lượng truy cập thực tế (CPU utilization), hệ thống đã tích hợp sẵn Kubernetes HPA:

### 8.1. Cấu hình mặc định trong Helm Chart
*   **Staging:** Tắt mặc định (để tiết kiệm tài nguyên trên cụm đơn node).
*   **Production:** Bật mặc định với các thông số:
    *   `minReplicas`: 2 (Đảm bảo tính sẵn sàng cao)
    *   `maxReplicas`: 5
    *   `targetCPUUtilizationPercentage`: 80% (Tự động scale up khi CPU trung bình vượt quá 80%)

### 8.2. Lệnh kiểm tra trạng thái HPA trên Production
```bash
# Kiểm tra HPA của Frontend và Backend trong namespace production
kubectl get hpa -n production
```
*Kết quả mong đợi:*
```text
NAME                           REFERENCE                                 TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
portfolio-backend-production   Deployment/portfolio-backend-production   0%/80%          2         5         2          1d
portfolio-frontend-production  Deployment/portfolio-frontend-production  0%/80%          2         5         2          1d
```
