# ☸️ Kubernetes Incident Playbook

Tài liệu này ghi lại chi tiết các sự cố hạ tầng phức tạp đã xảy ra trên cụm Kubernetes Production, bao gồm nguyên nhân gốc rễ (Root Cause Analysis - RCA), các bước khắc phục và bài học kinh nghiệm để ngăn chặn tái diễn.

---

## Sự Cố 1: CPU Spike Hệ Thống Định Kỳ Do Velero Kopia Maintenance

### 1. Hiện tượng (Symptom)
* **Thời điểm xảy ra:** Định kỳ mỗi 5 phút một lần, hệ thống cảnh báo tài nguyên liên tục gửi tin nhắn đỏ về kênh Alert của NestJS Backend.
* **Trạng thái hệ thống:** CPU load average tăng vọt vượt ngưỡng (>150% tải thực tế trên cụm single-node 3 cores vật lý), RAM ở trạng thái nghẽn liên tục dẫn đến swap đĩa (`kswapd0` hoạt động mạnh).

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Số lượng Backup Repositories lớn:** Cụm hiện tại đang quản lý **12 Kopia backup repositories** tương ứng với các phân vùng dữ liệu Persistent Volume khác nhau.
2. **Tần suất chạy Maintenance mặc định quá cao:** Mặc định Velero cấu hình tần suất bảo trì (maintenance) cho các repository của Kopia là **1 giờ (`1h`)**.
3. **Hiệu ứng Staggering (Phân phối thời gian):** Velero chia đều thời điểm chạy bảo trì cho 12 repository trong khoảng thời gian 1 giờ. 
   $$\text{Interval} = \frac{60 \text{ phút}}{12 \text{ repositories}} = 5 \text{ phút/lần}$$
   Do đó, **cứ mỗi 5 phút sẽ có một Kopia maintenance job được khởi tạo** (`kopia-maintain-job`).
4. **Không giới hạn tài nguyên:** Các maintenance job chạy mặc định không có CPU/Memory limits, thực hiện các tác vụ mã hóa, hashing và nén dữ liệu liên tục để đồng bộ lên Cloudflare R2, gây vắt kiệt CPU.

### 3. Giải pháp khắc phục (Remediation)
1. **Giảm tần suất bảo trì (`defaultRepoMaintainFrequency`)** của Velero từ `1h` lên **`24h`** thông qua cấu hình Helm Chart tại file `velero.yaml`.
2. **Giới hạn tài nguyên (CPU/RAM Limits) cho các Job bảo trì:**
   * `cpu-limit`: `500m` (Tối đa 0.5 core)
   * `mem-limit`: `512Mi` (Tối đa 512MB RAM)
3. **Cấu hình chi tiết Helm values:**
   ```yaml
   configuration:
     defaultRepoMaintainFrequency: "24h"
     extraArgs:
       - --maintenance-job-cpu-limit=500m
       - --maintenance-job-cpu-request=100m
       - --maintenance-job-mem-limit=512Mi
       - --maintenance-job-mem-request=128Mi
   ```
4. **Cập nhật thủ công các BackupRepository cũ** đang chạy trên cụm về `24h0m0s` để tránh việc cấu hình Helm chỉ áp dụng cho tài nguyên mới tạo:
   ```bash
   for repo in $(kubectl get backuprepositories -n velero -o jsonpath='{.items[*].metadata.name}'); do
     kubectl patch backuprepository "$repo" -n velero --type=merge -p '{"spec":{"maintenanceFrequency":"24h0m0s"}}'
   done
   ```

---

## Sự Cố 2: Next.js Standalone "Đóng Băng" API Proxy Môi Trường Staging

### 1. Hiện tượng (Symptom)
Sau khi deploy phiên bản Production thành công, ArgoCD đã sync hoàn tất và nạp biến môi trường `INTERNAL_API_URL` trỏ tới bản Production. Tuy nhiên, ở phía máy khách, khi gọi API hệ thống liên tục ghi nhận log lỗi:
```log
Failed to proxy http://portfolio-backend-staging:3001/api/v1/setup/status
Error: getaddrinfo ENOTFOUND portfolio-backend-staging
```
Ứng dụng Production liên tục cố gắng kết nối và gửi dữ liệu về môi trường Staging.

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. Trong file `next.config.js`, chúng ta sử dụng cơ chế `rewrites()` để chuyển tiếp các request từ `/api/:path*` về Backend.
2. Tuy nhiên, đối với Next.js ở chế độ **Standalone Mode**, toàn bộ các rewrite và redirect được thực thi **CHỈ 1 LẦN DUY NHẤT LÚC BIÊN DỊCH (BUILD-TIME)** và xuất ra cấu hình tĩnh `.next/routes-manifest.json`.
3. Lúc build Docker Image Production trên GitLab CI, do biến môi trường toàn cục `INTERNAL_API_URL` trong file `.gitlab-ci.yml` đang được khai báo cứng là `http://portfolio-backend-staging:3001` nên giá trị Staging này đã bị **đóng băng cứng** vào bên trong nhân Docker Image.
4. Khi chạy trên K8s, Next.js Standalone Router hoàn toàn bỏ qua các K8s Secret truyền đè lúc runtime và chỉ sử dụng giá trị tĩnh đã bị đóng băng trước đó.

### 3. Giải pháp khắc phục (Remediation)
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
  script:
    - 'export TAG=$CI_COMMIT_TAG'
    - 'docker build --no-cache --pull --build-arg INTERNAL_API_URL=$INTERNAL_API_URL -t $IMAGE_NAME:$TAG -t $IMAGE_LATEST .'
    - 'docker push $IMAGE_NAME:$TAG'
```

---

## Sự Cố 3: Lỗi Ký Tự BOM (\ufeff) Trực Tiếp Trong SQL Migrations

### 1. Hiện tượng (Symptom)
Pod Backend Production khởi chạy lên liên tục bị treo hoặc trả về lỗi 500 khi truy vấn cơ sở dữ liệu:
```log
GET /api/v1/setup/status 500 - Error:
Invalid prisma.user.findFirst() invocation:
The table public.User does not exist in the current database.
```
Kiểm tra log của Init-Container `prisma-migrate` ghi nhận thông tin cực kỳ tréo ngoe:
```log
Applying migration 20260512000000_init
Database error: ERROR: syntax error at or near "﻿" (u{feff})
```

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Lỗi Mã Hóa BOM Windows:** File `migration.sql` được biên tập hoặc tạo trên môi trường Windows chứa ký tự ẩn đánh dấu thứ tự byte **BOM (`\ufeff`)** ở ngay đầu file.
2. **Lỗi Biên Dịch Postgres:** Khi Init-Container thực thi nạp file SQL vào Postgres, Postgres không nhận diện được ký tự u{feff} nên quăng lỗi cú pháp và dừng tiến trình khởi tạo bảng.
3. **Lỗi Sync Ảo:** Kịch bản script tự động phát hiện lỗi chạy migration nên đã chạy lệnh cứu hộ `prisma migrate resolve --applied` để bỏ qua. Lệnh này ghi nhận trạng thái **Đã Áp Dụng (Applied)** vào bảng metadata `_prisma_migrations`, nhưng thực tế **không một bảng dữ liệu nào được khởi tạo**.

### 3. Giải pháp khắc phục (Remediation)
1. **Viết Script dọn sạch ký tự BOM (PowerShell):**
   ```powershell
   $path = 'backend/prisma/migrations/20260512000000_init/migration.sql'
   $content = [System.IO.File]::ReadAllText($path)
   $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
   [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
   ```
2. **Dọn dẹp DB lỗi và đồng bộ lại trên K8s:**
   Hạ Pod về 0 để ngắt kết nối, xóa/tạo lại Database sạch và khôi phục lại:
   ```bash
   kubectl scale deployment portfolio-backend-production -n production --replicas=0
   kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
   kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"
   kubectl scale deployment portfolio-backend-production -n production --replicas=1
   ```

---

## Sự Cố 4: Pod Staging Treo Trạng Thái `CreateContainerConfigError`

### 1. Hiện tượng (Symptom)
Pod Staging Backend (`portfolio-backend-staging`) liên tục hiển thị trạng thái `Init:CreateContainerConfigError` và không thể khởi chạy.

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
Deployment của Backend yêu cầu nạp cấu hình (Database URL, JWT Secret) từ K8s Secret có tên `portfolio-secrets`. Tuy nhiên, secret này mới chỉ được tạo ở namespace `production`, trong khi ở namespace `portfolio` (Staging) hoàn toàn trống trơn khiến K8s không thể nạp cấu hình cho container.

### 3. Giải pháp khắc phục (Remediation)
Khởi tạo Secret tương ứng cho môi trường Staging:
```bash
kubectl create secret generic portfolio-secrets -n portfolio \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres-staging.database:5432/portfolio_staging" \
  --from-literal=JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="
```
