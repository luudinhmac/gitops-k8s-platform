# ☸️ HƯỚNG DẪN TRIỂN KHAI & VẬN HÀNH PRODUCTION KUBERNETES

## 1. TỔNG QUAN KIẾN TRÚC & HẠ TẦNG (ARCHITECTURE OVERVIEW)

Hệ thống được thiết kế theo kiến trúc chuẩn **Cloud-Native GitOps**, tự động hóa toàn diện từ quy trình mã nguồn (Codebase), Quy trình tích hợp & bàn giao liên tục (CI/CD) cho đến quá trình đồng bộ hóa hạ tầng (Orchestration) trên cụm **Kubernetes (K8s) Production**.

### 1.1. Sơ đồ luồng vận hành GitOps (GitOps Operational Flow)
```mermaid
graph TD
    Developer[Developer] -->|Push Code| GitLab[GitLab App Repos]
    GitLab -->|CI Pipeline Run| DockerHub[Docker Hub Registry]
    GitLab -->|CD Script: Git Push Tag| InfraRepo[GitLab Infrastructure Repo]
    InfraRepo -->|Webhook / Sync| ArgoCD[ArgoCD GitOps Operator]
    ArgoCD -->|Reconcile State| K8sCluster[Kubernetes VPS Cluster]
    K8sCluster -->|Expose App| Traefik[Traefik Ingress Gateway]
    Traefik -->|SSL HTTPS| Client[End User Browser]
```

### 1.2. Sơ đồ phân chia Namespace trên cụm K8s
Hệ thống được phân vùng độc lập (Namespace Isolation) để đảm bảo an toàn tài nguyên và bảo mật:
*   **`production`**: Môi trường chạy thực tế của người dùng công cộng (Frontend Production & Backend Production).
*   **`portfolio`**: Môi trường Staging phục vụ việc kiểm thử các tính năng mới trước khi lên sóng (Frontend Staging & Backend Staging).
*   **`database-production`**: Nơi lưu giữ hệ quản trị cơ sở dữ liệu PostgreSQL cho Production.
*   **`database`**: Chứa PostgreSQL cho môi trường Staging.
*   **`argocd`**: Hệ thống quản lý đồng bộ GitOps tự động.
*   **`monitoring`**: Hệ thống giám sát tài nguyên (Prometheus, Grafana, Node Exporter).

---

## 2. QUY TRÌNH DỰNG CẤU HÌNH & TRIỂN KHAI CHI TIẾT (STEP-BY-STEP SETUP)

Để khởi dựng toàn bộ hệ thống từ đầu trên một cụm máy chủ mới, hãy thực hiện theo đúng các bước sau:

### Bước 2.1. Nạp Khóa Bảo Mật Thủ Công (Kubernetes Secrets)
Các biến môi trường nhạy cảm không được phép lưu trữ trên Git. Bạn bắt buộc phải nạp thủ công vào K8s trước khi triển khai ứng dụng:

#### A. Đối với môi trường Production (Namespace: `production`)
```bash
kubectl create secret generic portfolio-secrets -n production \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-production.database-production:5432/portfolio_production" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```

#### B. Đối với môi trường Staging (Namespace: `portfolio`)
```bash
kubectl create secret generic portfolio-secrets -n portfolio \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-staging.database:5432/portfolio_staging" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```

---

### Bước 2.2. Khai báo Biến liên kết CI/CD trên GitLab (GITLAB_API_TOKEN)
Để quy trình tự động cập nhật Tag giữa repo App và repo Infra diễn ra trơn tru:
1.  Truy cập vào repo **`portfolio-infratructure`** -> **Settings > Access Tokens**.
2.  Tạo một Token mới:
    *   **Name:** `CI/CD Deploy Token`
    *   **Role:** `Developer`
    *   **Scopes:** Tích chọn `write_repository` và `read_repository`.
3.  Sao chép chuỗi token tạo ra.
4.  Mở cài đặt của cả hai repo **`portfolio-frontend`** và **`portfolio-backend`** -> **Settings > CI/CD > Variables** -> Tạo biến:
    *   **Key:** `GITLAB_API_TOKEN`
    *   **Value:** *Chuỗi token vừa tạo*
    *   **Flags:** **BỎ TÍCH** chọn `Protect variable` (để hỗ trợ chạy trên mọi nhánh/tag) và tích chọn `Mask variable` để bảo mật.

---

### Bước 2.3. Quy trình Đóng gói & Tự động Deploy lên Production
1.  Gộp code từ nhánh **`dev`** vào nhánh **`main`** ở repo ứng dụng (Frontend hoặc Backend).
2.  Đánh tag phiên bản mới trên nhánh `main` (Ví dụ: `v1.0.9`, `v1.0.10`).
3.  GitLab CI sẽ tự động kích hoạt:
    *   Job **`build_production`**: Build Docker Image Standalone, nén cứng các cấu hình tĩnh và đẩy lên Docker Hub.
    *   Job **`deploy_production`** (Chạy thủ công bằng nút bấm): Tự động clone repo `infra`, cập nhật tag phiên bản mới vào file cấu hình tương ứng (`backend-values.yaml` hoặc `frontend-values.yaml`) và push ngược trở lại Git.
4.  ArgoCD lập tức phát hiện thay đổi trên Repo Infra và đồng bộ tự động kéo Pod mới chạy trên VPS.

---

## 3. NHẬT KÝ KHẮC PHỤC CÁC SỰ CỐ PHỨC TẠP (TROUBLESHOOTING LOG)

Dưới đây là chi tiết các lỗi hạ tầng và kiến trúc phức tạp đã được cô lập, phân tích và giải quyết triệt để trong quá trình vận hành hệ thống thực tế.

---

### Sự cố 3.1. Lỗi Next.js Standalone "Đóng băng" Proxy ở Staging URL

#### Hiện tượng (Symptom):
Sau khi deploy phiên bản Production thành công, ArgoCD đã sync hoàn tất và nạp biến môi trường `INTERNAL_API_URL` trỏ tới bản Production. Tuy nhiên, ở phía máy khách, khi gọi API hệ thống liên tục ghi nhận log lỗi:
```log
Failed to proxy http://portfolio-backend-staging:3001/api/v1/setup/status
Error: getaddrinfo ENOTFOUND portfolio-backend-staging
```
Ứng dụng Production liên tục cố gắng kết nối và gửi dữ liệu về môi trường Staging.

#### Phân tích nguyên nhân (Root Cause):
1.  Trong file `next.config.js`, chúng ta sử dụng cơ chế `rewrites()` để chuyển tiếp các request từ `/api/:path*` về Backend.
2.  Tuy nhiên, đối với Next.js ở chế độ **Standalone Mode**, toàn bộ các rewrite và redirect được thực thi **CHỈ 1 LẦN DUY NHẤT LÚC BIÊN DỊCH (BUILD-TIME)** và xuất ra cấu hình tĩnh `.next/routes-manifest.json`.
3.  Lúc build Docker Image Production trên GitLab CI, do biến môi trường toàn cục `INTERNAL_API_URL` trong file `.gitlab-ci.yml` đang được khai báo cứng là `http://portfolio-backend-staging:3001` nên giá trị Staging này đã bị **đóng băng cứng** vào bên trong nhân Docker Image.
4.  Khi chạy trên K8s, dù chúng ta có truyền đè biến `INTERNAL_API_URL` bằng K8s Secrets đi nữa, Next.js Standalone Router cũng hoàn toàn bỏ qua và chỉ đọc giá trị tĩnh Staging đã bị đóng băng trước đó.

#### Giải pháp khắc phục triệt để (Solution Code):
Chúng ta cấu hình ghi đè biến môi trường Build-time riêng biệt cho bản Production trực tiếp trong file cấu hình `.gitlab-ci.yml` của repository **`portfolio-frontend`**:

```yaml
# Sửa đổi trong file portfolio-frontend/.gitlab-ci.yml
build_production:
  stage: build
  image: docker:latest
  variables:
    # KHẮC PHỤC: Ghi đè biến build-time chuẩn trỏ thẳng sang Production Backend
    INTERNAL_API_URL: "http://portfolio-backend-production:3001"
  services:
    - docker:dind
  tags:
    - agent-1
  before_script:
    - 'docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY'
  script:
    - 'export TAG=$CI_COMMIT_TAG'
    - 'echo "Building Production Image with Tag: $TAG"'
    - 'docker build --no-cache --pull --build-arg INTERNAL_API_URL=$INTERNAL_API_URL -t $IMAGE_NAME:$TAG -t $IMAGE_LATEST .'
    - 'docker push $IMAGE_NAME:$TAG'
    - 'docker push $IMAGE_LATEST'
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v.*/'
```

---

### Sự cố 3.2. Lỗi Cú Pháp Ký Tự Lạ BOM (\ufeff) Trực Tiếp Trong SQL Migrations

#### Hiện tượng (Symptom):
Pod Backend Production khởi chạy lên liên tục bị treo hoặc trả về lỗi 500 khi truy vấn cơ sở dữ liệu:
```log
GET /api/v1/setup/status 500 - Error:
Invalid prisma.user.findFirst() invocation:
The table public.User does not exist in the current database.
```
Kiểm tra log của Init-Container `prisma-migrate` ghi nhận thông tin cực kỳ tréo ngoe:
*   Mục log đầu tiên báo lỗi cú pháp biên dịch SQL:
    ```log
    Applying migration 20260512000000_init
    Database error: ERROR: syntax error at or near "﻿" (u{feff})
    ```
*   Mục log ngay tiếp theo lại báo cáo chạy thành công giả tạo:
    ```log
    >>> Baseline resolve: marking init migration as applied...
    Migration 20260512000000_init marked as applied.
    No pending migrations to apply.
    >>> Baseline resolved and migrations applied successfully
    ```

#### Phân tích nguyên nhân (Root Cause):
1.  **Lỗi Mã Hóa BOM Windows:** File `migration.sql` được biên tập hoặc tạo trên môi trường Windows chứa ký tự ẩn đánh dấu thứ tự byte **BOM (`\ufeff`)** ở ngay đầu file.
2.  **Lỗi Biên Dịch Postgres:** Khi Init-Container khởi chạy và thực thi nạp file SQL vào Postgres, Postgres không nhận diện được ký tự `\ufeff` nên quăng lỗi cú pháp và dừng tiến trình khởi tạo bảng.
3.  **Hậu Quả Cơ Chế Cứu Hộ:** Kịch bản script tự động trong `deployment.yaml` của chúng ta phát hiện lỗi chạy migration nên đã cố gắng chạy lệnh cứu hộ: `prisma migrate resolve --applied 20260512000000_init` để bỏ qua. 
4.  Lệnh này đã ghi nhận trạng thái **Đã Áp Dụng (Applied)** vào bảng metadata `_prisma_migrations` trong PostgreSQL, nhưng thực tế **không một bảng dữ liệu nào được khởi tạo**. Kể từ đó, bất kể bạn restart pod hay build CI mới bao nhiêu lần, Prisma vẫn tin rằng DB đã khởi tạo xong và bỏ qua bước chạy migration!

#### Giải pháp khắc phục triệt để (Solution Code):
Chúng ta cần thực hiện quy trình dọn dẹp sạch cấu hình lỗi cũ và đồng bộ lại tệp tin SQL sạch sẽ:

1.  **Viết Script dọn sạch ký tự BOM (Sử dụng PowerShell):**
    Chúng ta đọc file SQL dưới dạng UTF-8 chuẩn và ghi đè lại dưới định dạng **UTF-8 Không BOM** để loại bỏ hoàn toàn ký tự ẩn `\ufeff`:
    ```powershell
    $path = 'd:\DATA\Portfolio\backend\prisma\migrations\20260512000000_init\migration.sql'
    $content = [System.IO.File]::ReadAllText($path)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    ```
    *(Thay đổi này đã được commit và push lên nhánh `dev` của repo `portfolio-backend`)*.

2.  **Dọn dẹp DB lỗi và đồng bộ lại trên K8s (Thực hiện thủ công 1 lần duy nhất):**
    Do database cũ đã bị ghi nhận metadata giả, chúng ta cần hạ Pod về 0 để ngắt kết nối, xóa/tạo lại Database sạch và khôi phục lại:
    ```bash
    # A. Hạ Pod về 0 để ngắt sạch kết nối cũ đang bị khóa
    kubectl scale deployment portfolio-backend-production -n production --replicas=0

    # B. Xóa và tạo lại Database sạch hoàn toàn trên Postgres Pod
    kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
    kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"

    # C. Kéo Pod hoạt động trở lại
    kubectl scale deployment portfolio-backend-production -n production --replicas=1
    ```
    Sau khi Pod Production khởi chạy lại với Docker Image chứa file `migration.sql` sạch BOM, Init-Container đã tự động chạy lệnh và tạo toàn bộ hệ thống bảng dữ liệu hoàn hảo 100%!

---

### Sự cố 3.3. Lỗi Cấu Hình Staging Backend Treo Ở Trạng Thái `CreateContainerConfigError`

#### Hiện tượng (Symptom):
Pod Staging Backend (`portfolio-backend-staging`) liên tục hiển thị trạng thái `Init:CreateContainerConfigError` và không thể khởi chạy.

#### Phân tích nguyên nhân (Root Cause):
Deployment của Backend yêu cầu nạp toàn bộ các cấu hình bảo mật (Database URL, JWT Secret) từ K8s Secret có tên `portfolio-secrets`. Tuy nhiên, secret này mới chỉ được tạo ở namespace `production`, trong khi ở namespace `portfolio` (Staging) hoàn toàn trống trơn khiến K8s không thể nạp cấu hình cho container.

#### Giải pháp khắc phục triệt để (Solution Code):
Khởi tạo Secret tương ứng cho môi trường Staging (như hướng dẫn ở Mục 2.1.B):
```bash
kubectl create secret generic portfolio-secrets -n portfolio \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-staging.database:5432/portfolio_staging" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```
Sau khi nạp xong secret, Pod Backend Staging đã lập tức tự động đồng bộ và hoạt động ổn định ở trạng thái `1/1 Running`!

---

## 4. BẢNG TRA CỨU NHANH LỆNH VẬN HÀNH (OPERATIONS CHEATSHEET)

### Lệnh Kiểm Tra Sức Khỏe Hệ Thống (Health Check)
```bash
# Kiểm tra trạng thái toàn bộ Pods trên cụm
kubectl get pods -A

# Xem log thời gian thực của Backend Production
kubectl logs -f deployment/portfolio-backend-production -n production -c backend

# Xem log tiến trình chạy Migration của Backend Staging
kubectl logs deployment/portfolio-backend-staging -n portfolio -c prisma-migrate
```

### Lệnh Sao Lưu & Phục Hồi Database (Backup & Restore)
```bash
# Sao lưu Database Production ra file SQL
kubectl exec -t postgres-production-0 -n database-production -- pg_dump -U portfolio_user -d portfolio_production > production_backup.sql

# Khôi phục Database từ file SQL
cat production_backup.sql | kubectl exec -i postgres-production-0 -n database-production -- psql -U portfolio_user -d portfolio_production
```

---

## 5. KẾT QUẢ ĐẠT ĐƯỢC (FINAL STATUS REPORT)
*   **Production Frontend & Backend:**  ĐANG HOẠT ĐỘNG HOÀN HẢO (Chuẩn HTTPS SSL tự động, bảo mật cao).
*   **Staging Frontend & Backend:** ĐANG HOẠT ĐỘNG ỔN ĐỊNH (Phục vụ việc phát triển tính năng mới).
*   **GitOps Workflow:**  TỰ ĐỘNG HÓA 100% (Đồng bộ trực tiếp qua GitLab CI/CD và ArgoCD).