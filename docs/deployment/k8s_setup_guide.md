# ☸️ Kubernetes Cluster Setup & Sealed Secrets Guide

Tài liệu này cung cấp hướng dẫn từng bước (From Scratch) để khởi dựng cấu hình trên cụm Kubernetes mới, thiết lập biến CI/CD trên GitLab và bảo mật toàn bộ thông tin nhạy cảm dưới dạng mã hóa khai báo (Secrets-as-Code) bằng **Bitnami Sealed Secrets**.

---

## 1. Bản Đồ Quy Trình Khởi Dựng (Bootstrap Flow)

Khi triển khai trên một máy chủ VPS sạch hoàn toàn:

```mermaid
graph TD
    A[Dựng OS & Cluster K8s qua Ansible] --> B[Cài đặt Traefik & Sealed Secrets Helm Chart]
    B --> C[Thiết lập Access Token & Variables trên GitLab]
    C --> D[Nạp Khóa Giải Mã Private Key của Sealed Secrets nếu DR]
    D --> E[Trích xuất Public Key để mã hóa các cấu hình Secret]
    E --> F[Commit SealedSecrets YAML lên Git và sync bằng ArgoCD]
```

---

## 2. Thiết Lập Biến Liên Kết CI/CD Trên GitLab

Để quy trình tự động cập nhật tag phiên bản mới diễn ra trơn tru giữa ứng dụng (FE/BE) và hạ tầng:

1. **Tạo Access Token trên GitLab:**
   * Truy cập repository **`portfolio-infrastructure`** > **Settings** > **Access Tokens**.
   * Tạo một token mới:
     * **Name:** `GitLab CI Deploy Token`
     * **Role:** `Developer`
     * **Scopes:** Tích chọn `write_repository` và `read_repository`.
   * Sao chép chuỗi mã Token vừa được sinh ra.

2. **Nạp biến trên các App Repositories:**
   * Mở phần cài đặt của cả hai repo **`portfolio-frontend`** và **`portfolio-backend`** > **Settings** > **CI/CD** > **Variables**.
   * Khởi tạo biến môi trường:
     * **Key:** `GITLAB_API_TOKEN`
     * **Value:** *Mã Token đã sao chép ở trên*
     * **Flags (Cực kỳ quan trọng):**
       * **BỎ TÍCH** mục `Protect variable` (Để pipeline có thể chạy được trên mọi nhánh phát triển bao gồm cả `dev`).
       * **TÍCH CHỌN** mục `Mask variable` (Để tự động ẩn chuỗi token trong logs của runner).

---

## 3. Bitnami Sealed Secrets Workflow (Secrets-as-Code)

Hệ thống sử dụng Bitnami Sealed Secrets để mã hóa cấu hình nhạy cảm. Nhà phát triển có thể commit các tệp tin cấu hình đã mã hóa này lên Git một cách an toàn.

### 3.1. Cài đặt công cụ CLI `kubeseal`
* **Windows (qua Chocolatey/Scoop):**
  ```powershell
  scoop install kubeseal
  ```
* **macOS (qua Homebrew):**
  ```bash
  brew install kubeseal
  ```

### 3.2. Trích xuất Public Certificate (Public Key)
Để mã hóa các Secret mà không cần quyền kết nối trực tiếp đến cụm Kubernetes của môi trường Production, ta cần lưu giữ chứng chỉ Public Key trên Git:
```bash
# Lấy chứng chỉ từ cluster (yêu cầu SSH Tunnel 6443 đang mở)
kubeseal --controller-name=sealed-secrets --controller-namespace=kube-system --fetch-cert > infra/certs/sealed-secrets-prod.pem
```
*Lưu ý:* File public key `.pem` này hoàn toàn an toàn để commit và đẩy công khai lên Git.

### 3.3. Tạo SealedSecret An Toàn (Pipelined Dry-Run)
Để đảm bảo không bao giờ sinh ra file plaintext (chứa mật khẩu thật) tạm thời trên ổ cứng máy tính cá nhân, hãy áp dụng kỹ thuật **Pipelined Piping** (chuyển tiếp trực tiếp qua RAM):

#### A. Mã hóa chuỗi Bí mật Ứng dụng (Database URL & JWT Secret)
```bash
# Mã hóa cho môi trường Production (Lưu vào file production/portfolio-sealed-secrets.yaml)
kubectl create secret generic portfolio-secrets \
  --namespace blog-prod \
  --from-literal=DATABASE_URL="postgresql://portfolio_admin:password-prod@postgres.blog-prod:5432/portfolio_production?sslmode=disable" \
  --from-literal=JWT_SECRET="jwt-prod-secure-key-2026" \
  --dry-run=client -o yaml | \
kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
  > infra/environments/production/portfolio-sealed-secrets.yaml
```

#### B. Mã hóa thông tin đăng nhập Cloudflare R2 (S3 API Storage Credentials)
```bash
kubectl create secret generic r2-credentials \
  --namespace blog-prod \
  --from-literal=r2-access-key-id="R2_ACCESS_KEY_XXXX" \
  --from-literal=r2-secret-access-key="R2_SECRET_KEY_YYYY" \
  --dry-run=client -o yaml | \
kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
  > infra/environments/production/r2-sealed-secret.yaml
```

#### C. Mã hóa thông tin xác thực bộ nhớ đệm Redis
```bash
kubectl create secret generic redis-credentials \
  --namespace blog-prod \
  --from-literal=redis-password="redis-secure-password-2026" \
  --dry-run=client -o yaml | \
kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
  > infra/environments/production/redis-sealed-secret.yaml
```

---

## 4. Kịch Bản Disaster Recovery (DR) Cho Khóa Giải Mã

Nếu cụm máy chủ VPS bị sập hoàn toàn và bạn phải cài đặt lại cluster mới, các file `SealedSecret` trên Git sẽ **không thể giải mã** nếu cụm mới sinh ra cặp khóa keypair ngẫu nhiên khác. Bạn bắt buộc phải sao lưu và khôi phục lại khóa Private Key.

### 4.1. Backup Khóa Private Key (Chỉ thực hiện bởi DevOps Lead)
Chạy lệnh sau để lấy khóa giải mã của hệ thống và lưu trữ vào trình quản lý mật khẩu doanh nghiệp (như Vault, Bitwarden hoặc 1Password):
```bash
# Xuất toàn bộ key giải mã của Sealed Secrets Controller
kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > sealed-secrets-private-keys.yaml
```
> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG** commit file `sealed-secrets-private-keys.yaml` này lên Git. Nếu lộ file này, mọi dữ liệu bí mật đã mã hóa trên Git của bạn sẽ bị giải mã hoàn toàn.

### 4.2. Khôi phục Khóa Private Key khi dựng mới Cluster
Khi dựng lại hệ thống K8s mới từ đầu, **trước khi triển khai ứng dụng hoặc cài đặt Sealed Secrets Helm Chart**, hãy nạp lại khóa cũ:
```bash
# Nạp lại khóa giải mã cũ vào cluster mới
kubectl apply -f sealed-secrets-private-keys.yaml
```
Sau đó tiến hành cài đặt Sealed Secrets Helm Chart. Controller khởi chạy lên sẽ tự động tìm thấy các Private key cũ và tiến hành giải mã toàn bộ các file `SealedSecret` trên Git một cách trơn tru.
