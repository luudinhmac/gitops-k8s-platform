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

---

## Sự Cố 7: Lộ Lọt Khóa JWT_SECRET Trên Git Và Sử Dụng Khóa Yếu Ở Môi Trường Staging/Production

### 1. Hiện tượng (Symptom)
* Qua rà soát bảo mật mã nguồn, phát hiện khóa mã hóa JWT (`JWT_SECRET`) của môi trường Production tồn tại dưới dạng văn bản thô (plain-text) trong lịch sử Git (file `infra/ansible/vars/secrets.yml` và `docs/troubleshooting/k8s_incidents.md` cũ).
* Khóa JWT này đang hoạt động trực tiếp trên cụm Kubernetes môi trường Production (`blog-prod`), tạo ra nguy cơ bảo mật nghiêm trọng nếu kẻ tấn công lấy được khóa và giả mạo chữ ký JWT để leo thang đặc quyền.
* Môi trường Staging (`blog-staging`) đang sử dụng một khóa thô yếu và dễ đoán (`macld@2026`).

### 2. Quá trình kiểm tra và nguyên nhân (Debugging & Root Cause Analysis)
1. **Kiểm tra thông tin Secret thực tế trên cụm:**
   * Truy xuất khóa giải mã của Production:
     ```bash
     $ kubectl get secret portfolio-secrets -n blog-prod -o jsonpath="{.data.JWT_SECRET}" | base64 --decode; echo
     5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA=
     ```
     *Đánh giá:* Trùng khớp hoàn toàn với khóa bị lộ trên lịch sử Git.
   * Truy xuất khóa giải mã của Staging:
     ```bash
     $ kubectl get secret portfolio-secrets -n blog-staging -o jsonpath="{.data.JWT_SECRET}" | base64 --decode; echo
     macld@2026
     ```
     *Đánh giá:* Khóa staging quá yếu và lộ trong lịch sử phát triển.
2. **Nguyên nhân gốc rễ:**
   * Trong giai đoạn thiết lập ban đầu, các khóa bí mật chưa được tách biệt hoàn toàn hoặc được lưu trữ tạm thời dưới dạng biến chưa mã hóa trong tệp playbook Ansible và tài liệu hướng dẫn kỹ thuật trước khi được đưa vào Git.

### 3. Giải pháp khắc phục (Remediation)
1. **Rotate khóa bảo mật:** Tạo ra 2 khóa bảo mật JWT ngẫu nhiên mới, có độ dài tối thiểu 256-bit (32 bytes) và được mã hóa Base64 cho mỗi môi trường Production và Staging.
2. **Mã hóa an toàn qua GitOps (Sealed Secrets):** Sử dụng công cụ `kubeseal` kết hợp với public certificate của controller (`infra/certs/sealed-cert.pem`) để mã hóa thô (raw-encrypt) các khóa này trước khi lưu trữ vào repository GitOps.
3. **Đồng bộ hóa qua ArgoCD:** Commit và push các thay đổi cấu hình lên nhánh `main` để ArgoCD tự động áp dụng và giải mã các SealedSecret vào cụm Kubernetes.
4. **Tái khởi động Workload:** Restart Rolling các pod backend ở cả 2 môi trường để áp dụng khóa mới ngay lập tức.

### 4. Các bước xử lý chi tiết (Implementation Steps)
1. **Tự động hóa xoay vòng khóa bằng Script Python:**
   Để tự động hóa việc tạo khóa bảo mật ngẫu nhiên, tự động gọi `kubeseal` mã hóa thô và chèn trực tiếp các giá trị mã hóa mới vào file cấu hình Helm values, sử dụng kịch bản script [infra/scripts/rotate_secrets.py](../../infra/scripts/rotate_secrets.py):

   ```python
   import secrets
   import base64
   import subprocess
   import os
   import shutil

   def gen_key():
       return base64.b64encode(secrets.token_bytes(32)).decode('utf-8')

   def find_kubeseal(infra_dir):
       # Tìm kubeseal trong PATH hệ thống
       path_bin = shutil.which("kubeseal")
       if path_bin:
           return path_bin
       
       # Tìm trong thư mục agent bin
       agent_bin_dir = os.path.join(infra_dir, "..", ".agent", "bin")
       for name in ["kubeseal.exe", "kubeseal"]:
           candidate = os.path.join(agent_bin_dir, name)
           if os.path.exists(candidate):
               return candidate
       return "kubeseal"

   def seal_value(kubeseal_path, value, name, namespace, cert_path):
       temp_file = "temp_secret_val.txt"
       with open(temp_file, "w", encoding="utf-8") as f:
           f.write(value)
           
       cmd = [
           kubeseal_path,
           "--raw",
           f"--from-file={temp_file}",
           "--cert", cert_path,
           "--name", name,
           "--namespace", namespace
       ]
       p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
       stdout, stderr = p.communicate()
       
       if os.path.exists(temp_file):
           os.remove(temp_file)
           
       if p.returncode != 0:
           raise Exception(f"kubeseal failed: {stderr.decode('utf-8')}")
       return stdout.decode('utf-8').strip()

   def update_yaml_file(filepath, old_val_line_prefix, new_sealed_val):
       with open(filepath, 'r', encoding='utf-8') as f:
           lines = f.readlines()
       
       updated = False
       for i, line in enumerate(lines):
           if line.strip().startswith("JWT_SECRET:"):
               indent = line[:line.find("JWT_SECRET:")]
               lines[i] = f'{indent}JWT_SECRET: "{new_sealed_val}"\n'
               updated = True
               break
               
       if not updated:
           raise Exception(f"Không tìm thấy dòng chứa JWT_SECRET trong {filepath}")
           
       with open(filepath, 'w', encoding='utf-8') as f:
           f.writelines(lines)

   def main():
       script_dir = os.path.dirname(os.path.abspath(__file__))
       infra_dir = os.path.dirname(script_dir)
       
       cert_path = os.path.join(infra_dir, "certs", "sealed-cert.pem")
       prod_values_path = os.path.join(infra_dir, "environments", "production", "backend-values.yaml")
       staging_values_path = os.path.join(infra_dir, "environments", "staging", "backend-values.yaml")
       
       kubeseal_path = find_kubeseal(infra_dir)
       prod_key = gen_key()
       staging_key = gen_key()
       
       prod_sealed = seal_value(kubeseal_path, prod_key, "portfolio-secrets", "blog-prod", cert_path)
       staging_sealed = seal_value(kubeseal_path, staging_key, "portfolio-secrets", "blog-staging", cert_path)
       
       update_yaml_file(prod_values_path, "JWT_SECRET:", prod_sealed)
       update_yaml_file(staging_values_path, "JWT_SECRET:", staging_sealed)
       print("Xoay vòng khóa và cập nhật values.yaml thành công!")

   if __name__ == "__main__":
       main()
   ```

   **Cách thực thi nhanh:**
   ```bash
   $ python infra/scripts/rotate_secrets.py
   ```
2. **Cập nhật file cấu hình Helm Values trong repository:**
   * Thay thế giá trị khóa `JWT_SECRET` tại `sealedSecret.encryptedData` trong:
     * [environments/production/backend-values.yaml](file:///d:/DATA/Portfolio/infra/environments/production/backend-values.yaml)
     * [environments/staging/backend-values.yaml](file:///d:/DATA/Portfolio/infra/environments/staging/backend-values.yaml)
3. **Commit và Push lên Git để ArgoCD đồng bộ:**
   * Thực hiện commit và push thay đổi lên repository `portfolio-infratructure.git` ( GitLab):
     ```bash
     $ git add environments/production/backend-values.yaml environments/staging/backend-values.yaml
     $ git commit -m "fix(security): rotate compromised JWT secrets"
     $ git push origin main
     ```
4. **Trigger ArgoCD đồng bộ và kiểm tra trạng thái:**
   * Refresh ứng dụng trên ArgoCD:
     ```bash
     $ kubectl annotate application portfolio-root-app-production -n argocd argocd.argoproj.io/refresh=normal --overwrite
     ```
5. **Restart Rolling các pod Backend:**
   ```bash
   $ kubectl rollout restart deployment/portfolio-backend-production -n blog-prod
   $ kubectl rollout restart deployment/portfolio-backend-staging -n blog-staging
   ```

### 5. Kết quả (Outcome)
* Toàn bộ các Pod của Backend đã restart thành công và hoạt động ổn định ở trạng thái `Running`.
* Kiểm tra giải mã giá trị khóa thực tế trong Secret của cluster:
  * **Production (`blog-prod`)**: Khóa mới đã được cập nhật thành công (Bắt đầu bằng: `jgM1...`, kết thúc bằng: `...CEc=`).
  * **Staging (`blog-staging`)**: Khóa mới đã được cập nhật thành công (Bắt đầu bằng: `25NN...`, kết thúc bằng: `...PGg=`).
* Đảm bảo không còn bất kỳ khóa JWT_SECRET dạng văn bản trần nào hoạt động trên hệ thống.

---

## Sự Cố 8: Grafana Bị Kẹt Trạng Thái CrashLoopBackOff Sau Khi Uncordon Node VM Local

### 1. Hiện tượng (Symptom)
* Sau khi hoàn tất bảo trì và chạy lệnh `kubectl uncordon worker-local-1`, Pod Grafana (`monitoring-grafana-*`) được khởi tạo lại trên Worker Node nhưng bị kẹt ở trạng thái **`Init:CrashLoopBackOff`**.
* Logs của init-container `init-chown-data` liên tục báo lỗi phân quyền khi thực thi lệnh thay đổi quyền sở hữu:
  ```log
  chown: /var/lib/grafana/png: Permission denied
  chown: /var/lib/grafana/pdf: Permission denied
  chown: /var/lib/grafana/csv: Permission denied
  ```

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Ràng buộc bảo mật của Init Container**: Init-container `init-chown-data` chạy dưới quyền Root (UID `0`) nhưng bị cấu hình loại bỏ toàn bộ các quyền hạn Linux (`drop: ["ALL"]`) và chỉ bổ sung lại duy nhất quyền `CHOWN` trong `securityContext`.
2. **Thiếu quyền truy cập thư mục nâng cao (CAP_DAC_OVERRIDE)**: 
   * Do Grafana trước đó đã tạo ra các thư mục con (`png`, `pdf`, `csv`) với owner là UID `472` (user `grafana`) và quyền truy cập cực kỳ hạn chế là `700` (`drwx------`).
   * Việc loại bỏ `ALL` capabilities đồng nghĩa với việc Root trong container **bị mất quyền `CAP_DAC_OVERRIDE`** (quyền bỏ qua cơ chế kiểm soát quyền truy cập tệp tin DAC).
   * Khi mất quyền này, đối với các thư mục có quyền `700` thuộc sở hữu của UID `472`, Root (UID `0`) sẽ bị hệ điều hành đối xử như đối tượng "Other" (không có quyền đọc/ghi/truy cập `---`). Do đó, lệnh `chown -R 472:472 /var/lib/grafana` bị từ chối truy cập (`Permission denied`) khi cố gắng đi vào các thư mục con này.

### 3. Giải pháp khắc phục (Remediation)
1. **Nâng cấp quyền trên thư mục host của Node**: 
   Truy cập vào Node `worker-local-1` và tạm thời cấp quyền đọc/truy cập sâu hơn (`755` thay vì `700`) cho thư mục dữ liệu tương ứng của Grafana trên ổ cứng host:
   ```bash
   sudo chmod -R 755 /opt/local-path-provisioner/pvc-3376cf71-2016-4f51-8e85-0f70d1e04284_monitoring_monitoring-grafana
   ```
2. **Tái tạo Pod**: 
   Thực hiện xóa Pod Grafana cũ để Kubernetes tạo lại một Pod mới. Init-container lúc này có thể duyệt qua tất cả các thư mục con và thực thi `chown` thành công:
   ```bash
   kubectl delete pod -n monitoring -l app.kubernetes.io/name=grafana
   ```
3. **Kết quả**: 
   Pod Grafana khởi chạy hoàn tất và chuyển sang trạng thái **`3/3 Running`** hoàn toàn khỏe mạnh.

---

## Sự Cố 9: Cảnh Báo KubeJobFailed Hàng Loạt Sau Khi Khởi Động Lại Node VM Local

### 1. Hiện tượng (Symptom)
* Sau khi uncordon và khôi phục hoạt động của node `worker-local-1` khoảng 15-20 phút, hệ thống liên tục gửi về Telegram cảnh báo **`KubeJobFailed`** với độ nghiêm trọng `warning` tại namespace `trivy-system`:
  ```text
  🚨 [CẢNH BÁO HẠ TẦNG] KubeJobFailed
  Namespace: trivy-system
  Pod liên quan: monitoring-kube-state-metrics-...
  Chi tiết: Job failed to complete.
  ```

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Thiếu Node phù hợp trong quá trình bảo trì**:
   * Các Job quét lỗ hổng bảo mật của Trivy Operator (`scan-vulnerabilityreport-*`) có cấu hình node selector bắt buộc: `workload=scanner`.
   * Node duy nhất trong cụm sở hữu label này là `worker-local-1`. Khi node này bị tắt/cordon để bảo trì, các Job này được tạo ra nhưng không thể xếp lịch (schedule) và bị kẹt ở trạng thái `Pending`.
   * Sau 300 giây (Active Deadline Seconds), Kubernetes tự động hủy Job và đánh dấu trạng thái **`Failed`** (`Reason: DeadlineExceeded`).
2. **Sự chậm trễ của hệ thống giám sát (Monitoring Delay)**:
   * Pod thu thập chỉ số trạng thái `kube-state-metrics` cũng được xếp lịch chạy trên `worker-local-1`.
   * Trong suốt thời gian node bảo trì, Prometheus không thể thu thập metrics từ `kube-state-metrics`, do đó không phát hiện ra các Job đã failed trước đó.
   * Ngay sau khi node online trở lại, `kube-state-metrics` khởi động thành công và bắt đầu xuất metrics. Prometheus quét qua và lập tức phát hiện các Job failed từ 6 tiếng trước đó, kích hoạt cảnh báo trễ tại thời điểm `23:35 ICT`.

### 3. Giải pháp khắc phục (Remediation)
1. **Dọn dẹp các Job lỗi**:
   Các Job quét của Trivy sau khi chạy xong hoặc lỗi có thể xóa an toàn mà không làm mất dữ liệu báo cáo (vì kết quả đã được lưu vào Custom Resource `vulnerabilityreports`). Ta dọn dẹp các Job này để xóa metric lỗi khỏi Prometheus:
   ```bash
   kubectl delete jobs -n trivy-system --all
   ```
2. **Kết quả**:
   * Các Job cũ bị xóa hoàn toàn khỏi namespace `trivy-system`.
   * `kube-state-metrics` ngừng xuất chỉ số lỗi, cảnh báo trên Alertmanager tự động chuyển sang trạng thái **`Resolved`** sau vài phút.

---

## Sự Cố 10: Tràn Cảnh Báo CPUThrottlingHigh (Info) Cho Các Exporters & Redis

### 1. Hiện tượng (Symptom)
* Kênh Telegram liên tục nhận các cảnh báo `🚨 [CẢNH BÁO HẠ TẦNG] CPUThrottlingHigh` độ nghiêm trọng `info` liên quan đến các Pod:
  * `postgres-exporter-*` (namespace `blog-prod`)
  * `redis-master-0` (cả `blog-prod` và `blog-staging`)
  * `monitoring-prometheus-node-exporter-*` (namespace `monitoring`)

### 2. Nguyên nhân gốc rễ (Root Cause Analysis)
1. **Thiết lập CPU limit quá thấp**:
   * Các Pod phụ trợ như Exporter chỉ được giới hạn `50m` CPU. Pod Redis Master được giới hạn `100m` CPU.
   * Khi các tác vụ thu thập metrics định kỳ (scrape) hoặc xử lý lệnh của Redis diễn ra, các container này cần một lượng CPU ngắn (burst) vượt quá giới hạn trên trong chu kỳ 100ms, dẫn đến Kernel kích hoạt cơ chế bóp CPU (CFS Throttling).
2. **Alertmanager chưa được phân loại tắt cảnh báo info**:
   * Mặc dù tài nguyên vật lý của cụm rất nhàn rỗi (Node CPU usage < 25%), các cảnh báo bóp CPU mức `info` vẫn liên tục gửi về kênh Telegram gây loãng thông tin giám sát.

### 3. Giải pháp khắc phục (Remediation)
1. **Nâng giới hạn CPU (CPU Limits)**:
   Tôi đã cập nhật cấu hình tài nguyên cho các ứng dụng trong repository GitOps:
   * **Redis Master (Production)**: Limit CPU nâng lên `250m` (request `100m`).
   * **Redis Master (Staging)**: Limit CPU nâng lên `200m` (request `50m`).
   * **Postgres Exporter**: Limit CPU nâng lên `150m` (request `25m`).
   * **Node Exporter**: Limit CPU nâng lên `200m` (request `50m`).
2. **Ẩn cảnh báo CPUThrottlingHigh trong Alertmanager**:
   Bổ sung rule lọc vào Alertmanager routes trong file `kube-prometheus-stack.yaml` để điều hướng cảnh báo `CPUThrottlingHigh` vào receiver `null` (bỏ qua thông báo):
   ```yaml
   routes:
     - matchers:
         - alertname =~ "Watchdog|InfoInhibitor|KubeControllerManagerInstanceUnreachable|KubeSchedulerInstanceUnreachable|KubeProxyInstanceUnreachable|KubeControllerManagerDown|KubeSchedulerDown|KubeProxyDown|etcdInsufficientMembers|etcdMembersDown|KubeCPUOvercommit|CPUThrottlingHigh"
       receiver: 'null'
   ```
3. **Đồng bộ hóa**:
   Đẩy các thay đổi lên Gitlab và để ArgoCD tự động áp dụng. Quá trình rollout StatefulSet và DaemonSet diễn ra thành công. Throttling đã giảm sâu và không còn gửi cảnh báo rác về Telegram.

---

## Sự Cố 11: Control Plane & Operator Pod Restart Hàng Loạt Do Mất Quyền Leader Election

### 1. Hiện tượng (Symptom)
* Ghi nhận một số Pod thành phần hạ tầng bị tăng chỉ số `RESTARTS`:
  * `kube-system/kube-controller-manager-k8s-prod`
  * `doppler-operator-system/doppler-operator-controller-manager-79b4845cbd-2z59k`
  * `kube-system/kube-scheduler-k8s-prod`
  * `kube-system/cilium-operator-b65f9447-z5h5c`
* Các Pod trên dừng lần lượt từ `12:14:15 - 12:14:16 UTC+7` và đồng loạt khởi động lại thành công vào lúc `12:14:19 UTC+7` (Thời gian gián đoạn kéo dài **3 - 4 giây**).

### 2. Bằng chứng kỹ thuật & Nguyên nhân gốc rễ (Technical Evidence & RCA)
1. **Thông số tài nguyên OS (`sar` & `journalctl`)**:
   * **CPU Usage**: `10.93%` (bình thường, nhàn rỗi).
   * **Load Average**: `0.36 - 0.49` trên 3 vCPUs (rất thấp).
   * **RAM / OOM Killer**: `0` sự kiện Kernel OOM (OS không thiếu RAM).
   * **Disk %util trung bình**: `10.93%` / Await: `7.30ms` (tổng thể đĩa không nghẽn kéo dài).
2. **Thông số Timeout kỹ thuật gây sự cố**:
   * Ngưỡng Client Timeout cập nhật Lease: **`5.0 giây (5000 ms)`**.
   * Ngưỡng tối đa giữ Lease (Lease Duration): **`15.0 giây`**.
   * **Log thực tế**:
     * `12:14:09 UTC+7`: `Put .../leases/kube-controller-manager?timeout=5s: context deadline exceeded` (Timeout > 5000ms).
     * `12:14:10 UTC+7`: Kubelet báo `Failed to update lease: etcdserver: request timed out` (etcd trễ ghi đĩa `fsync` > 5000ms).
     * `12:14:16 UTC+7`: `leader election lost` do vượt quá 15s deadline mà không làm tươi khóa thành công.
3. **Cơ chế gây ra spike**:
   * Đợt tạo/hủy volume của Job bảo trì Kopia Velero lúc `12:13:45 UTC+7` gây biến động trễ ghi đĩa tức thời (I/O fsync spike > 5s) trên cụm Single-node, làm `etcd` bị quá hạn 5s phản hồi cho API Server.

### 3. Giải pháp & Chi tiết
* Chi tiết báo cáo incident và log thực tế được lưu tại: [incident_report_leader_election_loss.md](file:///d:/DATA/Portfolio/docs/troubleshooting/incident_report_leader_election_loss.md).
* Hệ thống đã tự phục hồi thành công sau 3-4 giây. Không gây gián đoạn các ứng dụng (`portfolio-backend`, `portfolio-frontend`). Không cần can thiệp cấu hình.





### 3. Giải pháp & Chi tiết
* Chi tiết báo cáo incident và log thực tế được lưu tại: [incident_report_leader_election_loss.md](file:///d:/DATA/Portfolio/docs/troubleshooting/incident_report_leader_election_loss.md).
* Hệ thống đã tự phục hồi thành công sau 3-4 giây. Không gây gián đoạn các ứng dụng (`portfolio-backend`, `portfolio-frontend`). Không cần can thiệp cấu hình.


