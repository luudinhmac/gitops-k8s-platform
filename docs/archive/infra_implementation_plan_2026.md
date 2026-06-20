# Kế Hoạch Triển Khai Theo Từng Giai Đoạn (Stage-by-Stage Implementation Plan)

Tài liệu này chia quy trình tối ưu hóa & ổn định hạ tầng thành 4 Stage độc lập. 

> [!IMPORTANT]
> **Quy trình thực hiện**: Kỹ sư AI sẽ thực hiện tuần tự từng Stage một. Sau khi hoàn thành và xác minh thành công mỗi Stage, hệ thống sẽ tạm dừng và hỏi ý kiến của bạn (`Bạn có muốn tiếp tục sang Stage tiếp theo không?`). Chỉ khi nhận được sự đồng ý, Stage tiếp theo mới được kích hoạt triển khai.

---

## MỤC LỤC
1. [STAGE 1: Triển khai thực tế Redis Caching](#stage-1)
2. [STAGE 2: Chuyển đổi lưu trữ Uploads sang Cloudflare R2 Object Storage](#stage-2)
3. [STAGE 3: Git hóa toàn bộ Secret bằng Sealed Secrets](#stage-3)
4. [STAGE 4: Quy hoạch Namespace theo Stack ứng dụng (blog-staging & blog-prod)](#stage-4)

---

<a name="stage-1"></a>
## STAGE 1: TRIỂN KHAI THỰC TẾ REDIS CACHING

### 1.1. Mục tiêu & Lợi ích
*   **Mục tiêu**: Thay thế bộ nhớ đệm mock (`noop`) hiện tại bằng một cụm Redis Standalone thực tế chạy trong Kubernetes.
*   **Lợi ích**: Giảm tải truy vấn (I/O) lên cơ sở dữ liệu PostgreSQL, cải thiện tốc độ phản hồi (latency) của API lấy danh sách bài viết từ ~150ms xuống <10ms.

### 1.2. Danh sách file thay đổi/tạo mới
*   `[NEW]` `infra/argocd/applications/platform/redis.yaml`
*   `[MODIFY]` `backend/src/infrastructure/config/config.service.ts`
*   `[MODIFY]` `backend/src/infrastructure/cache/cache-config.module.ts`
*   `[MODIFY]` `infra/environments/staging/backend-values.yaml`
*   `[MODIFY]` `infra/environments/production/backend-values.yaml`

### 1.3. Các bước thực hiện chi tiết

#### Bước 1: Deploy Redis lên cụm qua ArgoCD
1. Tạo file manifest ArgoCD Application cho Redis tại `infra/argocd/applications/platform/redis.yaml`:
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: redis
     namespace: argocd
   spec:
     project: platform
     source:
       repoURL: 'https://charts.bitnami.com/bitnami'
       targetRevision: 19.1.3
       chart: redis
       helm:
         values: |
           architecture: standalone
           auth:
             enabled: true
             existingSecret: redis-credentials
             existingSecretPasswordKey: redis-password
           master:
             resources:
               limits:
                 cpu: 100m
                 memory: 256Mi
               requests:
                 cpu: 50m
                 memory: 64Mi
             persistence:
               enabled: true
               storageClass: longhorn
               size: 2Gi
     destination:
       server: 'https://kubernetes.default.svc'
       namespace: blog-prod
     syncPolicy:
       automated:
         prune: true
         selfHeal: true
   ```
2. Commit và push file trên lên Git. ArgoCD sẽ tự động đồng bộ và cài đặt Redis Master Service.

#### Bước 2: Cập nhật cấu hình Backend NestJS
1. Sửa file `backend/src/infrastructure/config/config.service.ts` để đọc các biến môi trường Redis:
   ```typescript
   get redisHost(): string {
     return this.configService.get<string>('REDIS_HOST', 'redis-master.blog-prod.svc.cluster.local');
   }
   get redisPort(): number {
     return this.configService.get<number>('REDIS_PORT', 6379);
   }
   get redisPassword(): string {
     return this.configService.get<string>('REDIS_PASSWORD', '');
   }
   ```
2. Cập nhật `backend/src/infrastructure/cache/cache-config.module.ts` tích hợp `cache-manager-redis-yet`:
   ```typescript
   import { Module } from '@nestjs/common';
   import { CacheModule } from '@nestjs/cache-manager';
   import { redisStore } from 'cache-manager-redis-yet';
   import { ConfigService } from '../config/config.service';

   @Module({
     imports: [
       CacheModule.registerAsync({
         useFactory: async (configService: ConfigService) => ({
           store: await redisStore({
             socket: {
               host: configService.redisHost,
               port: configService.redisPort,
             },
             password: configService.redisPassword,
             ttl: 600, // 10 phút
           }),
         }),
         inject: [ConfigService],
       }),
     ],
   })
   export class CacheConfigModule {}
   ```

#### Bước 3: Cập nhật Helm Values và Secrets
1. Tạo mật khẩu Redis và mã hóa thành SealedSecret (xem Stage 3 về cú pháp không ghi đĩa):
   ```bash
   kubectl create secret generic redis-credentials \
     --namespace blog-prod \
     --from-literal=redis-password="mat-khau-redis-sieu-bao-mat-2026" \
     --dry-run=client -o yaml | \
   kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
     > infra/environments/production/redis-sealed-secret.yaml
   ```
2. Cập nhật file Helm Values của backend (`backend-values.yaml`) để tiêm (inject) các biến môi trường cấu hình Redis:
   ```yaml
   extraEnv:
     - name: REDIS_HOST
       value: "redis-master.blog-prod.svc.cluster.local"
     - name: REDIS_PORT
       value: "6379"
     - name: REDIS_PASSWORD
       valueFrom:
         secretKeyRef:
           name: redis-credentials
           key: redis-password
   ```

### 1.4. Xác minh & Kiểm thử
1. Kiểm tra logs Pod backend sau khi deploy xem có log kết nối thành công:
   ```bash
   kubectl logs -l app.kubernetes.io/name=backend -n blog-prod
   ```
2. Thực hiện SSH vào master node, exec vào Pod Redis Master và chạy lệnh `monitor`:
   ```bash
   kubectl exec -it redis-master-0 -n blog-prod -- redis-cli -a <password>
   # Trong redis-cli chạy:
   MONITOR
   ```
3. F5 trang blog ở frontend và xem cửa sổ terminal `MONITOR` có phát sinh các lệnh `GET` / `SET` hay không.

### 1.5. Kế hoạch Rollback
*   Nếu Redis bị crash hoặc quá tải: Đổi cấu hình values của Backend để tắt sử dụng Redis, quay về mock `noop` hoặc fallback sang memory-cache local bằng cách đặt lại tham số cấu hình module.

---

<a name="stage-2"></a>
## STAGE 2: CHUYỂN ĐỔI LƯU TRỮ UPLOADS SANG CLOUDFLARE R2

### 2.1. Mục tiêu & Lợi ích
*   **Mục tiêu**: Chuyển đổi phương thức lưu trữ tệp tin tải lên (uploads) từ ổ đĩa PVC cục bộ (Longhorn) sang dịch vụ Cloudflare R2 Object Storage tương thích S3 API.
*   **Lợi ích**:
    *   Tách biệt hoàn toàn trạng thái tĩnh (stateless) cho backend, giúp dễ dàng scale ngang backend pod.
    *   Giảm I/O disk trên máy chủ VPS.
    *   Giảm đáng kể kích thước volume snapshot và thời gian backup hàng ngày của Velero.
    *   Phục vụ tệp tĩnh (ảnh, video) trực tiếp qua Cloudflare CDN toàn cầu, tăng tốc độ tải trang frontend.

### 2.2. Danh sách file thay đổi/tạo mới
*   `[MODIFY]` `infra/environments/staging/backend-values.yaml`
*   `[MODIFY]` `infra/environments/production/backend-values.yaml`

### 2.3. Các bước thực hiện chi tiết

#### Bước 1: Tạo tài nguyên Cloudflare R2
1. Đăng nhập vào Cloudflare Dashboard, truy cập **R2** và tạo 2 bucket:
   * `blog-upload-staging` (môi trường staging)
   * `blog-upload-prod` (môi trường production)
2. Cấu hình **CORS Policy** trên R2 bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedOrigins": ["https://*.luumac.io.vn", "http://localhost:3000"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Liên kết subdomain CDN công cộng:
   * Trỏ `media-staging.luumac.io.vn` vào bucket `blog-upload-staging`.
   * Trỏ `media.luumac.io.vn` vào bucket `blog-upload-prod`.
4. Tạo **R2 API Token** với quyền `Object Read & Write` để lấy Access Key ID và Secret Access Key.

#### Bước 2: Di trú dữ liệu hiện tại lên Cloudflare R2
1. Đăng nhập vào VPS host qua SSH.
2. Cấu hình `rclone` kết nối tới Cloudflare R2:
   ```bash
   rclone config
   # Chọn New Remote -> Đặt tên "r2" -> Chọn "s3" -> Chọn Provider "Cloudflare"
   # Nhập Access Key, Secret Key, và endpoint tương ứng
   ```
3. Chạy lệnh đồng bộ dữ liệu từ thư mục volume cũ (Longhorn mount path trên host) lên R2 bucket:
   ```bash
   # Đồng bộ cho Staging
   rclone sync /data/k8s/storage/backend-uploads-stg r2:blog-upload-staging --progress

   # Đồng bộ cho Production
   rclone sync /data/k8s/storage/backend-uploads-prod r2:blog-upload-prod --progress
   ```

#### Bước 3: Cấu hình biến môi trường cho Backend
1. Sử dụng cú pháp pipelined để tạo/mã hóa credentials của R2 vào SealedSecret `portfolio-secrets` mà không ghi plaintext ra đĩa:
   ```bash
   kubectl create secret generic r2-credentials \
     --namespace blog-prod \
     --from-literal=r2-access-key-id="ACCESS_KEY_R2_2026" \
     --from-literal=r2-secret-access-key="SECRET_KEY_R2_2026" \
     --dry-run=client -o yaml | \
   kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
     > infra/environments/production/r2-sealed-secret.yaml
   ```
2. Cập nhật `backend-values.yaml` trỏ cấu hình lưu trữ sang R2:
   ```yaml
   extraEnv:
     - name: STORAGE_TYPE
       value: "minio" # Sử dụng MinioStorageService tích hợp tương thích S3 API
     - name: MINIO_ENDPOINT
       value: "<cloudflare_account_id>.r2.cloudflarestorage.com"
     - name: MINIO_PORT
       value: "443"
     - name: MINIO_USE_SSL
       value: "true"
     - name: MINIO_BUCKET
       value: "blog-upload-prod"
     - name: MINIO_ACCESS_KEY
       valueFrom:
         secretKeyRef:
           name: r2-credentials
           key: r2-access-key-id
     - name: MINIO_SECRET_KEY
       valueFrom:
         secretKeyRef:
           name: r2-credentials
           key: r2-secret-access-key
   ```

### 2.4. Xác minh & Kiểm thử
1. Truy cập vào trang quản trị (Admin Dashboard) của ứng dụng.
2. Thử tải lên (upload) một hình ảnh mới cho bài viết.
3. Kiểm tra xem ảnh hiển thị bình thường và đường dẫn ảnh (URL) đã chuyển sang dạng `https://media.luumac.io.vn/uploads/ten-anh.png` thay vì trỏ về local path.
4. Truy cập Cloudflare R2 bucket kiểm tra xem ảnh mới đã xuất hiện trong bucket chưa.

### 2.5. Kế hoạch Rollback
*   Trong trường hợp R2 gặp sự cố kết nối: Khôi phục cấu hình values cũ, chuyển `STORAGE_TYPE` về `local` và mount lại PVC Longhorn để ứng dụng hoạt động bình thường.

---

<a name="stage-3"></a>
## STAGE 3: GIT HÓA TOÀN BỘ SECRET BẰNG SEALED SECRETS

### 3.1. Mục tiêu & Lợi ích
*   **Mục tiêu**: Chuyển đổi toàn bộ cơ chế tạo secret thủ công hiện tại sang hình thức mã hóa khai báo (Secret-as-Code) thông qua **Bitnami Sealed Secrets**. Đồng thời thực hiện sao lưu khóa giải mã (private keys) để đảm bảo an toàn tuyệt đối cho quy trình Disaster Recovery (DR).
*   **Lợi ích**:
    *   100% tài nguyên hạ tầng được theo dõi và khôi phục tự động qua Git và ArgoCD.
    *   Không còn rủi ro thất lạc, mất thông tin cấu hình cơ sở dữ liệu và API key khi cụm bị hỏng hoàn toàn.
    *   Không tạo file plaintext tạm thời trên thiết bị của kỹ sư, tránh rò rỉ thông tin nhạy cảm.

### 3.2. Danh sách file thay đổi/tạo mới
*   `[NEW]` `infra/certs/sealed-secrets-staging.pem`
*   `[NEW]` `infra/certs/sealed-secrets-prod.pem`
*   `[NEW]` `infra/environments/staging/sealed-secrets.yaml`
*   `[NEW]` `infra/environments/production/sealed-secrets.yaml`

### 3.3. Các bước thực hiện chi tiết

#### Bước 1: Lưu trữ Public Key mã hóa trên Git
1. Trích xuất public certificate từ cụm và lưu trực tiếp vào thư mục mã nguồn Git (để các dev/ops sử dụng mà không cần kết nối trực tiếp vào cụm live):
   ```bash
   kubeseal --controller-name=sealed-secrets --controller-namespace=kube-system --fetch-cert > infra/certs/sealed-secrets-prod.pem
   ```
2. Commit file `sealed-secrets-prod.pem` lên Git.
3. **Giám sát Drift bằng CI Pipeline**: Thêm một bước kiểm tra trong GitLab CI để so sánh mã băm SHA256 của file `.pem` trong Git với cert đang chạy thực tế trên cluster:
   ```bash
   # Code ví dụ trong pipeline script:
   LIVE_HASH=$(kubeseal --controller-name=sealed-secrets --controller-namespace=kube-system --fetch-cert | sha256sum)
   GIT_HASH=$(sha256sum infra/certs/sealed-secrets-prod.pem)
   if [ "$LIVE_HASH" != "$GIT_HASH" ]; then
     echo "[WARNING] Sealed Secrets key has rotated! Please update cert in Git."
     exit 1
   fi
   ```

#### Bước 2: Thiết lập Kịch bản Disaster Recovery (DR) cho Khóa Giải mã
1. **Xuất Private Key**: Chạy lệnh sau để lấy khóa giải mã (private key) của Sealed Secrets controller (chỉ thực hiện bởi DevOps Lead):
   ```bash
   kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > sealed-secrets-private-keys.yaml
   ```
2. **Lưu trữ bảo mật**: Sao lưu tệp `sealed-secrets-private-keys.yaml` vào hệ thống lưu trữ khóa bảo mật của doanh nghiệp (như HashiCorp Vault, 1Password, Bitwarden) hoặc lưu trữ ngoại tuyến đã được mã hóa. **Tuyệt đối không commit file này lên Git**.
3. **Phục hồi khi DR (khi cụm bị sập toàn bộ)**:
   *   Khi khởi tạo cụm Kubernetes mới, trước khi cài đặt ứng dụng hoặc đồng bộ ArgoCD, phải nạp lại khóa giải mã cũ:
       ```bash
       kubectl apply -f sealed-secrets-private-keys.yaml
       ```
   *   Cài đặt Sealed Secrets Helm Chart. Controller sẽ tự động tìm thấy các key này và sử dụng chúng để giải mã toàn bộ các file `SealedSecret` trên Git mà không cần mã hóa lại.

#### Bước 3: Tạo SealedSecret an sau (Không lưu Plaintext trên Disk)
Sử dụng đường ống dẫn (pipe) để mã hóa trực tiếp thông tin cấu hình nhạy cảm mà không ghi ra tệp tạm thời trên ổ đĩa máy tính:
```bash
# Cho Staging:
kubectl create secret generic portfolio-secrets \
  --namespace blog-staging \
  --from-literal=DATABASE_URL="postgresql://portfolio_user:macld%402026@postgres.blog-staging:5432/portfolio_staging?sslmode=disable" \
  --from-literal=JWT_SECRET="jwt-staging-key-2026" \
  --dry-run=client -o yaml | \
kubeseal --cert infra/certs/sealed-secrets-staging.pem --format=yaml \
  > infra/environments/staging/portfolio-sealed-secrets.yaml

# Cho Production:
kubectl create secret generic portfolio-secrets \
  --namespace blog-prod \
  --from-literal=DATABASE_URL="postgresql://portfolio_admin:password-prod@postgres.blog-prod:5432/portfolio_production?sslmode=disable" \
  --from-literal=JWT_SECRET="jwt-prod-secure-key-2026" \
  --dry-run=client -o yaml | \
kubeseal --cert infra/certs/sealed-secrets-prod.pem --format=yaml \
  > infra/environments/production/portfolio-sealed-secrets.yaml
```

#### Bước 4: Di trú Secret không Downtime
Để tránh làm gián đoạn (downtime) các Pod đang chạy trên môi trường Production, thực hiện quy trình sau:
*   **Cách 1 (Adopt existing resource - Khuyên dùng)**:
    1. Annotate secret đang chạy trên cụm để gán quyền quản lý cho controller Sealed Secrets:
       ```bash
       kubectl annotate secret portfolio-secrets -n blog-prod sealedsecrets.bitnami.com/managed="true"
       ```
    2. Commit file `portfolio-sealed-secrets.yaml` lên Git. ArgoCD đồng bộ và controller sẽ tiếp quản secret một cách an sau mà không cần xóa đi tạo lại.
*   **Cách 2 (Rename secret)**:
    1. Đổi tên secret trong file SealedSecret thành `portfolio-secrets-v2`.
    2. Cập nhật config values của backend trỏ sang secret mới `portfolio-secrets-v2`.
    3. Commit lên Git. ArgoCD sẽ tạo Pod mới sử dụng secret mới. Khi hệ thống chạy ổn định, xóa secret `portfolio-secrets` cũ.

### 3.4. Xác minh & Kiểm thử
1. Đợi ArgoCD đồng bộ hoàn tất.
2. Kiểm tra trạng thái của SealedSecret trên cụm:
   ```bash
   kubectl get sealedsecret portfolio-secrets -n blog-prod -o yaml
   ```
3. Đảm bảo thuộc tính `status.conditions` trả về `Synced: "True"`:
   ```yaml
   status:
     conditions:
     - status: "True"
       type: Synced
   ```
4. Kiểm tra xem Secret dạng giải mã thông thường đã được sinh ra chưa:
   ```bash
   kubectl get secret portfolio-secrets -n blog-prod
   ```

---

<a name="stage-4"></a>
## STAGE 4: QUY HOẠCH NAMESPACE THEO STACK ỨNG DỤNG

### 4.1. Mục tiêu & Lợi ích
*   **Mục tiêu**: Tập hợp các tài nguyên bị phân mảnh của Staging (`portfolio`, `database`) và Production (`production`, `database-production`) về đúng 2 namespace duy nhất là `blog-staging` và `blog-prod`.
*   **Lợi ích**:
    *   Tài nguyên gọn gàng, clean và dễ quản lý.
    *   Hỗ trợ cấu hình NetworkPolicy bảo mật chặn chéo giữa các môi trường dễ dàng.
    *   Backup và Restore bằng Velero dễ dàng hơn (chỉ cần backup đúng namespace `blog-prod` hoặc `blog-staging`).

### 4.2. Danh sách file thay đổi/tạo mới
*   `[MODIFY]` `infra/argocd/applications/apps/backend.yaml` (và frontend, postgres, redis)
*   `[MODIFY]` `infra/environments/staging/backend-values.yaml` (và các file values khác)
*   `[MODIFY]` `infra/environments/production/backend-values.yaml` (và các file values khác)

### 4.3. Các bước thực hiện chi tiết

#### Bước 1: Khởi tạo các Namespace mới trên cụm
```bash
kubectl create namespace blog-staging
kubectl create namespace blog-prod
```

#### Bước 2: Cập nhật cấu hình Git & Service Endpoint
1. Sửa tệp cấu hình ArgoCD Application của các service, đổi `spec.destination.namespace` thành `blog-staging` hoặc `blog-prod`.
2. Sửa lại cấu hình chuỗi kết nối (Connection String) trong Helm values do Service của Postgres và Redis đã đổi namespace:
   * **Staging**: `postgres-staging.database` -> `postgres.blog-staging`
   * **Production**: `postgres-production.database-production` -> `postgres.blog-prod`
   * **Production Redis**: `redis.infra` -> `redis.blog-prod`

#### Bước 3: Di trú cơ sở dữ liệu (Database Migration)
Do dữ liệu của Staging và Production đang nằm trên các Persistent Volume (PV) thuộc namespace cũ, ta cần thực hiện di trú dữ liệu an toàn:

##### Phương án A: Backup và Restore dữ liệu (Khuyên dùng cho single-node)
1. Thực hiện dump dữ liệu PostgreSQL hiện tại:
   ```bash
   # Backup staging
   kubectl exec -it postgres-staging-0 -n database -- pg_dump -U portfolio_user portfolio_staging > staging_backup.sql
   # Backup production
   kubectl exec -it postgres-production-0 -n database-production -- pg_dump -U portfolio_admin portfolio_production > prod_backup.sql
   ```
2. Commit và deploy cấu hình namespace mới lên Git. ArgoCD sẽ khởi tạo Postgres và cụm ứng dụng mới tại namespace `blog-staging` / `blog-prod` kèm theo các PVC/PV trắng được cấp phát tự động bởi Longhorn.
3. Import dữ liệu ngược lại vào database mới:
   ```bash
   # Restore staging
   kubectl exec -i postgres-0 -n blog-staging -- psql -U portfolio_user -d portfolio_staging < staging_backup.sql
   # Restore production
   kubectl exec -i postgres-0 -n blog-prod -- psql -U portfolio_admin -d portfolio_production < prod_backup.sql
   ```

##### Phương án B: Giữ nguyên PV vật lý và liên kết lại PVC mới (Zero-data-dump)
1. Scale down các deployment/statefulset sử dụng disk ở namespace cũ về 0:
   ```bash
   kubectl scale statefulset postgres-production -n database-production --replicas=0
   ```
2. Lấy tên PV đang liên kết với PVC cũ:
   ```bash
   kubectl get pvc -n database-production
   # Giả sử PV tên là "pvc-12345678-abcd-efgh"
   ```
3. Đổi chính sách thu hồi (`ReclaimPolicy`) của PV từ `Delete` sang `Retain` để tránh bị xóa file khi xóa PVC:
   ```bash
   kubectl patch pv pvc-12345678-abcd-efgh -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```
4. Xóa PVC ở namespace cũ:
   ```bash
   kubectl delete pvc data-postgres-production-0 -n database-production
   ```
5. Lúc này PV sẽ chuyển sang trạng thái `Released`. Ta cần xóa thuộc tính liên kết `claimRef` cũ của PV để nó trở lại trạng thái `Available`:
   ```bash
   kubectl patch pv pvc-12345678-abcd-efgh --type json -p '[{"op": "remove", "path": "/spec/claimRef"}]'
   ```
6. Tạo PVC mới ở namespace mới (`blog-prod`) và chỉ định rõ `volumeName` trỏ tới PV cũ:
   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: data-postgres-0
     namespace: blog-prod
   spec:
     accessModes:
       - ReadWriteOnce
     resources:
       requests:
         storage: 10Gi # Khớp với PV cũ
     storageClassName: longhorn
     volumeName: pvc-12345678-abcd-efgh
   ```
7. Apply PVC mới này. Trạng thái PVC sẽ chuyển ngay lập tức sang `Bound`. Tiến hành deploy Postgres trên namespace mới.

#### Bước 4: Deploy & Xác minh DNS/SSL
1. Đồng bộ toàn bộ ArgoCD Applications sang namespace mới.
2. Kiểm tra xem các chứng chỉ cert-manager SSL đã READY trên namespace mới chưa.

#### Bước 5: Dọn dẹp tài nguyên cũ
Sau khi kiểm tra ứng dụng chạy hoàn hảo trên tên miền ở namespace mới, tiến hành xóa sạch tài nguyên cũ để giải phóng tài nguyên CPU/RAM cho VPS:
```bash
kubectl delete namespace portfolio
kubectl delete namespace database
kubectl delete namespace production
kubectl delete namespace database-production
```
