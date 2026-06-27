# 🚨 Common Issues & Operations Runbook

Tài liệu này ghi lại các lỗi vận hành thường gặp trên cụm Kubernetes, cơ sở dữ liệu và hạ tầng mạng, kèm theo hướng dẫn khắc phục chi tiết từng bước.

---

## 1. Lỗi kẹt Database Migrations (Prisma Migration Lock)

### Triệu chứng:
Khi deploy phiên bản mới, Pod Backend liên tục báo lỗi crash/restart ở container khởi tạo `prisma-migrate`. Log báo lỗi:
`Database migration is locked` hoặc `Database is already up to date but local schemas differ`.

### Cách khắc phục:
1.  **Hạ số lượng Pod Backend về 0** để giải phóng tất cả connection đang lock DB:
    ```bash
    kubectl scale deployment/portfolio-backend-production -n production --replicas=0
    ```
2.  **Đăng nhập trực tiếp vào Pod Database PostgreSQL** và thực hiện xóa bản ghi lock trong bảng prisma migrations (hoặc drop/recreate DB nếu ở Staging):
    ```bash
    kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d portfolio_production
    ```
    *Trong psql CLI, thực thi lệnh:*
    ```sql
    DELETE FROM _prisma_migrations WHERE logs LIKE '%lock%';
    ```
3.  **Tăng số lượng Pod Backend trở lại**:
    ```bash
    kubectl scale deployment/portfolio-backend-production -n production --replicas=2
    ```
4.  Theo dõi logs để xác nhận migration đã chạy thành công:
    ```bash
    kubectl logs deployment/portfolio-backend-production -n production -c prisma-migrate
    ```

---

## 2. Bị chặn truy cập trang Quản trị (403 Forbidden / IP Lockout)

### Triệu chứng:
Khi truy cập các trang quản trị như ArgoCD, Grafana hay Kubernetes Dashboard, trình duyệt hiển thị lỗi **403 Forbidden**. Lỗi xảy ra do IP Public của Quản trị viên thay đổi, khiến Ingress Controller (Traefik) chặn truy cập theo quy định của Middleware `admin-allowlist`.

### Cách khắc phục:
1.  **Lấy IP Public hiện tại** của bạn:
    *   Trình duyệt: Truy cập trang [ifconfig.me](https://ifconfig.me) hoặc run lệnh PowerShell:
        ```powershell
        (Invoke-WebRequest ifconfig.me).Content.Trim()
        ```
2.  **Mở SSH Tunnel vượt rào bảo mật**:
    ```powershell
    Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
    ```
3.  **Sửa cấu hình Middleware trực tiếp trên cụm K8s**:
    ```bash
    kubectl edit middleware admin-allowlist -n infra
    ```
    *Tìm đến phần `sourceRange` và cập nhật địa chỉ IP mới:*
    ```yaml
    spec:
      ipWhiteList:
        sourceRange:
          - <NEW_IP_PUBLIC>/32
    ```
4.  Cập nhật file cấu hình Ansible tại `infra/ansible/roles/infra-services/tasks/main.yml` để lưu lại IP mới này, tránh bị hoàn tác ở lần chạy tiếp theo.

---

## 3. Lỗi kết nối Cloudflare Tunnel (Tunnel Offline)

### Triệu chứng:
Toàn bộ hệ thống tên miền (blog.luumac.io.vn, api.luumac.io.vn) báo lỗi **502 Bad Gateway** hoặc **1033 Tunnel Connection Error** trên màn hình Cloudflare.

### Cách khắc phục:
1.  Kiểm tra trạng thái hoạt động của Pod đại diện tunnel:
    ```bash
    kubectl get pods -n infra | grep cloudflared
    ```
2.  Nếu Pod đang ở trạng thái `CrashLoopBackOff`, kiểm tra log:
    ```bash
    kubectl logs deployment/cloudflared -n infra
    ```
3.  **Lỗi thường gặp**: Token xác thực của Cloudflare Tunnel hết hạn hoặc bị thu hồi.
    *   Truy cập Cloudflare Zero Trust Dashboard > Networks > Tunnels.
    *   Lấy token mới của Tunnel.
    *   Cập nhật Secret của `cloudflared` trong K8s:
        ```bash
        kubectl create secret generic tunnel-credentials --from-literal=credentials.json=<NEW_TOKEN> -n infra --dry-run=client -o yaml | kubectl apply -f -
        ```
    *   Khởi động lại Deployment:
        ```bash
        kubectl rollout restart deployment/cloudflared -n infra
        ```

---

## 4. Các lỗi hạ tầng Kubernetes và định tuyến Ingress (Traefik/PVC)

### 4.1. Lỗi PVC không Bind được PV (Persistent Volume Pending)
*   **Nguyên nhân**: Các PV thiếu `storageClassName` cụ thể dẫn đến xung đột với trình provisioner mặc định hoặc không tự động ghép cặp (bound).
*   **Cách khắc phục**: Ép cứng `storageClassName` (ví dụ: `manual` hoặc `longhorn`) và chỉ định rõ thuộc tính `volumeName` trong khai báo của từng PVC.

### 4.2. Lỗi thứ tự Deploy khiến Pod treo trạng thái `Pending`
*   **Nguyên nhân**: Service/App được triển khai trước khi Persistent Volume (PV) hoặc lưu trữ vật lý sẵn sàng, khiến Pod không thể mount ổ đĩa.
*   **Cách khắc phục**: Điều chỉnh quy trình triển khai (Ansible / GitOps) để nạp các tài nguyên lưu trữ (Storage/PV/PVC) trước, đồng thời bổ sung task/job chờ đợi (`Wait for PV`) trước khi deploy ứng dụng.

### 4.3. Ingress Traefik không mở cổng hoặc bị chặn 80/443
*   **Nguyên nhân**: Sử dụng `NodePort` mặc định của Helm chart hoặc `hostPort` bị xung đột/chặn bởi CNI (như Cilium).
*   **Cách khắc phục**: Chuyển cấu hình DaemonSet của Traefik sang chế độ mạng máy chủ (`hostNetwork: true`).

### 4.4. Traefik bị lỗi Permission Denied khi Bind cổng mạng
*   **Nguyên nhân**: Các cổng dưới 1024 (bao gồm 80/443) là cổng đặc quyền trên Linux, trong khi container Traefik mặc định chạy với user thường không thể tự bind.
*   **Cách khắc phục**: Cấu hình `securityContext` trong Helm values của Traefik để chạy dưới quyền `root` (UID 0) hoặc cấp thêm quyền `NET_BIND_SERVICE` trong Linux capabilities.

### 4.5. Lỗi định tuyến Ingress trả về 404 Not Found
*   **Nguyên nhân**: Ingress nằm khác namespace với Service cần trỏ tới, hoặc Traefik chặn chuyển tiếp `ExternalName` theo mặc định.
*   **Cách khắc phục**: Đảm bảo Ingress được đặt cùng namespace với Pod/Service ứng dụng (`blog-prod` hoặc `blog-staging`), đồng thời kích hoạt thuộc tính cấu hình `allowExternalNameServices` trong Traefik nếu cần chuyển tiếp liên namespace.

---

## 5. Lỗi Next.js Standalone "Đóng băng" Proxy ở Staging URL (Build-time configuration drift)

### Triệu chứng:
Sau khi deploy phiên bản Production thành công, ArgoCD đã sync hoàn tất và nạp biến môi trường `INTERNAL_API_URL` trỏ tới bản Production. Tuy nhiên, ở phía máy khách, khi gọi API hệ thống liên tục ghi nhận log lỗi:
```log
Failed to proxy http://<backend_staging_service>:<port>/api/v1/setup/status
Error: getaddrinfo ENOTFOUND <backend_staging_service>
```
Ứng dụng Production liên tục cố gắng kết nối và gửi dữ liệu về môi trường Staging.

### Phân tích nguyên nhân:
1.  Trong file `next.config.js`, chúng ta sử dụng cơ chế `rewrites()` để chuyển tiếp các request từ `/api/:path*` về Backend.
2.  Tuy nhiên, đối với Next.js ở chế độ **Standalone Mode**, toàn bộ các rewrite và redirect được thực thi **CHỈ 1 LẦN DUY NHẤT LÚC BIÊN DỊCH (BUILD-TIME)** và xuất ra cấu hình tĩnh `.next/routes-manifest.json`.
3.  Lúc build Docker Image Production trên GitLab CI, do biến môi trường toàn cục `INTERNAL_API_URL` trong file `.gitlab-ci.yml` đang được khai báo cứng là trỏ tới môi trường staging nên giá trị này đã bị **đóng băng cứng** vào bên trong nhân Docker Image.
4.  Khi chạy trên K8s, dù chúng ta có truyền đè biến `INTERNAL_API_URL` bằng K8s Secrets đi nữa, Next.js Standalone Router cũng hoàn toàn bỏ qua và chỉ đọc giá trị tĩnh đã bị đóng băng trước đó.

### Cách khắc phục:
Cấu hình ghi đè biến môi trường Build-time riêng biệt cho bản Production trực tiếp trong file cấu hình `.gitlab-ci.yml` của repository frontend:
```yaml
build_production:
  stage: build
  image: docker:latest
  variables:
    # KHẮC PHỤC: Ghi đè biến build-time chuẩn trỏ thẳng sang Production Backend
    INTERNAL_API_URL: "http://<backend_production_service>:<port>"
```

---

## 6. Lỗi Cú Pháp Ký Tự Lạ BOM (\ufeff) Trực Tiếp Trong SQL Migrations

### Triệu chứng:
Pod Backend Production khởi chạy lên liên tục bị treo hoặc trả về lỗi 500 khi truy vấn cơ sở dữ liệu:
```log
GET /api/v1/setup/status 500 - Error:
Invalid prisma.user.findFirst() invocation:
The table public.User does not exist in the current database.
```
Kiểm tra log của Init-Container `prisma-migrate` ghi nhận thông tin:
```log
Applying migration 20260512000000_init
Database error: ERROR: syntax error at or near "﻿" (u{feff})
```

### Phân tích nguyên nhân:
1.  **Lỗi Mã Hóa BOM Windows:** File `migration.sql` được tạo/chỉnh sửa trên môi trường Windows chứa ký tự ẩn đánh dấu thứ tự byte **BOM (`\ufeff`)** ở đầu file.
2.  **Lỗi Biên Dịch Postgres:** Khi Init-Container chạy và nạp file SQL vào Postgres, Postgres không nhận diện được ký tự `\ufeff` nên báo lỗi cú pháp và dừng tiến trình khởi tạo bảng.
3.  **Hậu Quả Cơ Chế Cứu Hộ:** Kịch bản script tự động trong `deployment.yaml` của chúng ta phát hiện lỗi chạy migration nên đã chạy lệnh cứu hộ `prisma migrate resolve --applied <migration_name>` để bỏ qua. 
4.  Lệnh này ghi nhận trạng thái đã áp dụng (Applied) vào bảng metadata `_prisma_migrations` trong PostgreSQL, nhưng thực tế **không một bảng dữ liệu nào được khởi tạo**.

### Cách khắc phục:
1.  **Viết Script dọn sạch ký tự BOM (Sử dụng PowerShell):**
    Đọc file SQL dưới dạng UTF-8 chuẩn và ghi đè lại dưới định dạng **UTF-8 Không BOM** để loại bỏ hoàn toàn ký tự ẩn `\ufeff`:
    ```powershell
    $path = '<path_to_migration_sql>'
    $content = [System.IO.File]::ReadAllText($path)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    ```
2.  **Dọn dẹp DB lỗi và đồng bộ lại trên K8s (Thực hiện thủ công 1 lần duy nhất):**
    Hạ Pod về 0 để ngắt kết nối, xóa/tạo lại Database sạch và khôi phục lại:
    ```bash
    # Hạ Pod về 0 để ngắt kết nối
    kubectl scale deployment/<backend_deployment> -n <namespace> --replicas=0
    # Xóa và tạo lại Database sạch hoàn toàn trên Postgres Pod
    kubectl exec -it <postgres_pod> -n <namespace> -- psql -U <db_user> -d postgres -c "DROP DATABASE <db_name>;"
    kubectl exec -it <postgres_pod> -n <namespace> -- psql -U <db_user> -d postgres -c "CREATE DATABASE <db_name>;"
    # Kéo Pod hoạt động trở lại
    kubectl scale deployment/<backend_deployment> -n <namespace> --replicas=1
    ```

---

## 7. Lỗi Cấu HÌnh Backend Treo Ở Trạng Thái `CreateContainerConfigError`

### Triệu chứng:
Pod Backend liên tục hiển thị trạng thái `Init:CreateContainerConfigError` và không thể khởi chạy.

### Phân tích nguyên nhân:
Deployment của Backend yêu cầu nạp toàn bộ các cấu hình bảo mật (Database URL, JWT Secret) từ K8s Secret. Tuy nhiên, secret này chưa được tạo ở namespace tương ứng khiến K8s không thể nạp cấu hình cho container.

### Cách khắc phục:
Khởi tạo Secret tương ứng cho môi trường (sử dụng placeholder cho các biến nhạy cảm):
```bash
kubectl create secret generic <secret_name> -n <namespace> \
  --from-literal=DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>" \
  --from-literal=JWT_SECRET="<jwt_secret_key>"
```
