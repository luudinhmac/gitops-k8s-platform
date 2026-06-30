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
  --from-literal=DATABASE_URL="postgresql://<db-user>:<db-password>@<db-host>:<db-port>/<db-name>" \
  --from-literal=JWT_SECRET="<jwt-secret-key>"
```

---

## Sự Cố 5: Tài Nguyên Longhorn Platform OutOfSync Trên ArgoCD Do Kích Thước CRD

### 1. Hiện tượng (Symptom)
* Ứng dụng `platform-longhorn` trên ArgoCD hiển thị trạng thái đồng bộ là `OutOfSync` cho toàn bộ các CustomResourceDefinition (CRD) của Longhorn (như `volumes.longhorn.io`, `nodes.longhorn.io`, `engines.longhorn.io`...) mặc dù trạng thái sức khỏe (Health Status) vẫn là `Healthy`.
* Quá trình Auto-Sync liên tục chạy nhưng không thể chuyển trạng thái ứng dụng sang `Synced`.

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Giới hạn kích thước annotation metadata**: Khi đồng bộ tài nguyên qua ArgoCD bằng phương thức mặc định (Client-Side Apply), Kubernetes ghi đè cấu hình cũ vào annotation `kubectl.kubernetes.io/last-applied-configuration`. Do các file CRD của Longhorn quá lớn và chứa nhiều phiên bản API (`v1beta1`, `v1beta2`), kích thước của annotation này đã vượt quá giới hạn tối đa cho phép là **262KB**.
2. **Sự tự động chuẩn hóa của API Server**: Kubernetes API Server và Longhorn Controller tự động sinh/bổ sung một số trường mặc định (chẳng hạn như `preserveUnknownFields` hoặc cấu hình `status` subresource) trực tiếp trên cụm, dẫn đến sự khác biệt (drift) nhỏ so với manifest tĩnh Helm sinh ra từ Git, gây kích hoạt trạng thái `OutOfSync` trên ArgoCD.

### 3. Giải pháp khắc phục (Remediation)
Kích hoạt cơ chế **Server-Side Apply** cho ứng dụng `platform-longhorn` trên ArgoCD. Cơ chế này không ghi đè vào annotation `last-applied-configuration` trên metadata của đối tượng mà sử dụng cơ chế so khớp schema trực tiếp từ API Server, giúp giải quyết các CRD có kích thước cực lớn.

Cấu hình được thêm trực tiếp vào file `argocd/applications/platform/longhorn.yaml`:
```yaml
spec:
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true # Giải pháp xử lý lỗi CRD OutOfSync
```

---

## Sự Cố 6: Velero BackupStorageLocation Bị 'Unavailable' Do Xung Đột Thư Mục etcd-backups

### 1. Hiện tượng (Symptom)
* Một số pod trong namespace `velero` chuyển sang trạng thái `Error` (Failed) khi thực hiện tác vụ bảo trì repository Kopia (`maintain-job`).
* Trạng thái tổng quan của `BackupStorageLocation` tên `default` bị chuyển thành `Unavailable`:
  ```bash
  $ kubectl get backupstoragelocations -n velero
  NAME      PHASE         LAST VALIDATED   AGE   DEFAULT
  default   Unavailable   41s              23d   true
  ```
* Logs của pod điều khiển Velero (`velero-57f7fd5b5c-wj8cg`) báo lỗi xác thực bucket liên tục:
  ```log
  time="2026-06-30T16:33:02Z" level=error msg="fail to validate backup store" backup-storage-location=velero/default controller=backup-storage-location error="Backup store contains invalid top-level directories: [etcd-backups]" error.file="/go/src/github.com/vmware-tanzu/velero/pkg/persistence/object_store.go:222" error.function="github.com/vmware-tanzu/velero/pkg/persistence.(*objectBackupStore).IsValid" logSource="pkg/controller/backup_storage_location_controller.go:144"
  ```

### 2. Quá trình kiểm tra và nguyên nhân gốc rễ (Debugging & Root Cause Analysis)
1. **Kiểm tra logs các pod bảo trì Kopia bị lỗi:**
   Truy xuất log từ một pod bị lỗi (ví dụ: `infra-default-kopia-cd24c-maintain-job-1782823328816-kkhl8`):
   ```bash
   $ kubectl logs infra-default-kopia-cd24c-maintain-job-1782823328816-kkhl8 -n velero
   ```
   Kết quả nhận được:
   ```log
   time="2026-06-30T12:42:51Z" level=error msg="An error occurred when running repo prune" error="failed to boost repo connect: error to connect backup repo: error to connect to storage: error retrieving storage config from bucket \"velero-k8s-prod\": Get \"https://<r2-account-id>.r2.cloudflarestorage.com/velero-k8s-prod/kopia/infra/.storageconfig\": dial tcp: lookup <r2-account-id>.r2.cloudflarestorage.com on 10.96.0.10:53: server misbehaving"
   ```
   Đồng thời logs của CoreDNS trong namespace `kube-system` ghi nhận lỗi timeout kết nối DNS bên ngoài tại thời điểm đó:
   ```log
   [ERROR] plugin/errors: 2 <r2-account-id>.r2.cloudflarestorage.com. AAAA: read udp 10.0.0.196:60312->8.8.8.8:53: i/o timeout
   ```
   **Kết luận lỗi Kopia:** Lỗi của pod bảo trì Kopia hoàn toàn do sự cố mạng tạm thời (transient network DNS timeout) trên cluster và đã tự phục hồi ở các lượt chạy kế tiếp.

2. **Kiểm tra trạng thái xác thực Bucket của Velero:**
   Mặc dù mạng đã ổn định, lệnh `kubectl get backupstoragelocations -n velero` vẫn hiển thị `Unavailable`. Lỗi chi tiết:
   ```text
   Backupstore contains invalid top-level directories: [etcd-backups]
   ```
   * **Nguyên nhân gốc rễ:** CronJob sao lưu etcd (`etcd-backup` tại `infra/platform/etcd-backup/cronjob.yaml`) được thiết lập để đẩy các file snapshot etcd trực tiếp lên cùng một bucket với Velero (`velero-k8s-prod`) dưới thư mục `/etcd-backups`:
     ```bash
     mc cp "$BACKUP_FILE" r2/velero-k8s-prod/etcd-backups/
     ```
     Velero có cơ chế xác thực rất nghiêm ngặt đối với bucket lưu trữ của mình. Nó quét thư mục gốc (root) của bucket và mong đợi chỉ chứa các thư mục do chính Velero quản lý (như `backups/`, `restores/`, `kopia/`, `metadata/`). Sự hiện diện của thư mục ngoài `etcd-backups` ở cấp root khiến Velero đánh dấu BSL là không khả dụng (`Unavailable`).

### 3. Giải pháp khắc phục (Remediation)
1. **Chuẩn hóa kiến trúc lưu trữ:** Tạo một bucket R2 riêng biệt có tên `cluster-etcd-backup-prod` để lưu trữ riêng các bản sao lưu etcd control plane, tách biệt hoàn toàn khỏi bucket `velero-k8s-prod` của Velero.
2. **Cấu hình phân quyền:** Cấu hình lại API Token hiện tại trên Cloudflare R2 (Access Key `<r2-access-key-id>`) để có toàn quyền đọc/ghi trên cả 2 bucket (`velero-k8s-prod` và `cluster-etcd-backup-prod`).
3. **Di chuyển dữ liệu cũ:** Di chuyển toàn bộ các snapshot etcd cũ đang tồn tại trong `velero-k8s-prod/etcd-backups/` sang bucket mới `cluster-etcd-backup-prod/etcd-backups/`.
4. **Dọn dẹp và sửa đổi cấu hình CronJob:** Xóa bỏ thư mục `etcd-backups` khỏi bucket gốc của Velero để Velero tự động khôi phục trạng thái hoạt động bình thường, và cập nhật điểm đích lưu trữ trong file manifest `cronjob.yaml`.

### 4. Các bước xử lý chi tiết (Implementation Steps)
1. **Khởi tạo và Phân quyền:**
   * Tạo bucket `cluster-etcd-backup-prod` trên Cloudflare Dashboard.
   * Gán bucket mới vào phạm vi hoạt động (scoping) của R2 API Token hiện tại.
2. **Chạy Script di chuyển và dọn dẹp dữ liệu (Python/boto3):**
   Thực hiện liệt kê, sao chép và xóa sạch dữ liệu cũ tại root của bucket Velero:
   ```python
   # Script di chuyển dữ liệu
   import boto3
   s3 = boto3.client('s3', endpoint_url='https://<r2-account-id>.r2.cloudflarestorage.com', ...)
   
   # Sao chép từ velero-k8s-prod/etcd-backups/ sang cluster-etcd-backup-prod/etcd-backups/
   # Sau đó xóa tại velero-k8s-prod/etcd-backups/
   ```
   *Kết quả thực thi:* Đã sao chép và dọn dẹp sạch 15 file snapshots cũ dạng `etcd-snapshot-*.db`.
3. **Cập nhật và áp dụng cấu hình CronJob mới:**
   Thay đổi điểm đích upload file backup trong `infra/platform/etcd-backup/cronjob.yaml`:
   ```yaml
   # Sửa đổi từ:
   mc cp "$BACKUP_FILE" r2/velero-k8s-prod/etcd-backups/
   # Thành:
   mc cp "$BACKUP_FILE" r2/cluster-etcd-backup-prod/etcd-backups/
   ```
   Áp dụng cấu hình lên cluster:
   ```bash
   $ kubectl apply -f infra/platform/etcd-backup/cronjob.yaml
   cronjob.batch/etcd-backup configured
   ```
4. **Kích hoạt kiểm tra lại Velero:**
   Thực hiện restart deployment Velero để buộc trigger quá trình validation ngay lập tức:
   ```bash
   $ kubectl rollout restart deployment/velero -n velero
   ```

### 5. Kết quả (Outcome)
* Trạng thái của **BackupStorageLocation** chuyển về **`Available`** thành công:
  ```bash
  $ kubectl get backupstoragelocations -n velero
  NAME      PHASE       LAST VALIDATED   AGE   DEFAULT
  default   Available   19s              23d   true
  ```
* Toàn bộ dữ liệu etcd cũ đã được bảo toàn nguyên vẹn trên bucket mới `cluster-etcd-backup-prod`.
* CronJob `etcd-backup` trên Kubernetes được cập nhật và sẵn sàng chạy cho các chu kỳ sao lưu tiếp theo mà không gây lỗi cho hệ thống Velero.

