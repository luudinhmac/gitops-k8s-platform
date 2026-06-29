# Báo Cáo Phân Tích Kiến Trúc & Hạ Tầng Hệ Thống

Tài liệu này cung cấp kết quả phân tích toàn bộ cấu trúc hệ thống, mã nguồn, tệp tin cấu hình, sơ đồ triển khai và quy trình CI/CD nhằm hỗ trợ công việc vận hành, tối ưu hóa và khôi phục hệ thống khi có sự cố.

---

## 1. Công Nghệ Lõi & Môi Trường Runtime

Hệ thống được thiết kế theo mô hình Microservices phân tách độc lập giữa Frontend (Web UI) và Backend (API Services), kết nối với nhau qua giao diện API bảo mật.

*   **Ngôn ngữ lập trình chính:** 
    *   **TypeScript / JavaScript** được áp dụng đồng bộ cho cả hai phân hệ chính.
    *   *Xác minh:* [backend/tsconfig.json](../../backend/tsconfig.json) và [frontend/tsconfig.json](../../frontend/tsconfig.json).
*   **Môi trường Runtime & Quản lý Package:**
    *   **Node.js v22-alpine** được chọn làm môi trường chạy chính thức trong container production nhằm giảm thiểu lỗ hổng bảo mật và dung lượng ảnh.
    *   **pnpm v9.15.4** được sử dụng làm Package Manager giúp tối ưu hóa thời gian cài đặt thư viện và lưu trữ tập trung.
    *   *Yêu cầu phát triển cục bộ (Local Development):* Node.js LTS từ phiên bản `20.x` trở lên.
    *   *Xác minh:* [backend/Dockerfile:4](../../backend/Dockerfile#L4), [frontend/Dockerfile:2](../../frontend/Dockerfile#L2) và [local-development.md:10](../../scratch/infra-repo/docs/local-development.md#L10).
*   **Framework chính:**
    *   **Backend:** **NestJS v11.0.1** (sử dụng nền tảng Express bên dưới).
        *   *Xác minh:* Dependencies `@nestjs/core` và `@nestjs/common` tại [backend/package.json:26-28](../../backend/package.json#L26-L28).
    *   **Frontend:** **Next.js v16.2.6** (sử dụng React v19.2.4). Web UI được biên dịch ở chế độ *Standalone* để chạy độc lập qua Node server mà không cần toàn bộ mã nguồn dev.
        *   *Xác minh:* [frontend/package.json:18-21](../../frontend/package.json#L18-L21) và [frontend/Dockerfile:42](../../frontend/Dockerfile#L42).
*   **Các thư viện và gói phụ thuộc quan trọng nhất:**
    *   **Backend:**
        *   *ORM:* **Prisma Client v6.19.3** kết nối PostgreSQL (xem [backend/package.json:36](../../backend/package.json#L36)).
        *   *Database Driver:* `pg v8.13.1` (xem [backend/package.json:50](../../backend/package.json#L50)).
        *   *Caching:* `@nestjs/cache-manager v3.0.0` phối hợp với `cache-manager-redis-yet v5.0.0` (xem [backend/package.json:25,39](../../backend/package.json#L25) và [backend/package.json#L39](../../backend/package.json#L39)).
        *   *Storage Integration:* `minio v8.0.7` tương tác với các hệ thống S3-compatible (xem [backend/package.json:45](../../backend/package.json#L45)).
        *   *Security & Auth:* `bcryptjs v3.0.3` (băm mật khẩu), `passport-jwt v4.0.1` (xác thực token), `helmet v8.1.0` (bảo mật HTTP headers).
        *   *Media Processing:* `sharp v0.34.5` (tối ưu hóa kích thước và xử lý định dạng hình ảnh).
    *   **Frontend:**
        *   *HTTP Client:* `axios v1.15.2` phục vụ giao tiếp API (xem [frontend/package.json:13](../../frontend/package.json#L13)).
        *   *Styling:* `tailwindcss v4` kết hợp cùng PostCSS (xem [frontend/package.json:15,35](../../frontend/package.json#L15) và [frontend/package.json#L35](../../frontend/package.json#L35)).
        *   *Animation:* `framer-motion v12.38.0` (xem [frontend/package.json:15](../../frontend/package.json#L15)).
        *   *WYSIWYG Editor:* `react-quill-new v3.8.3` hỗ trợ soạn thảo bài viết (xem [frontend/package.json:23](../../frontend/package.json#L23)).

---

## 2. Cơ Sở Dữ Liệu (Databases)

Hệ thống kết hợp cơ sở dữ liệu quan hệ có tính toàn vẹn cao cho dữ liệu nghiệp vụ và cơ sở dữ liệu bộ nhớ đệm hiệu năng cao cho Caching.

*   **Cơ sở dữ liệu chính (PostgreSQL):**
    *   **Loại triển khai:** StatefulSet trong Kubernetes nhằm giữ cố định định danh mạng (DNS) và duy trì ánh xạ vùng lưu trữ ổ đĩa lâu dài.
        *   *Xác minh:* [postgres/templates/statefulset.yaml](../../infra/apps/postgres/templates/statefulset.yaml).
    *   **Phiên bản cụ thể:** **PostgreSQL 16.13-alpine** (chạy trên môi trường container gọn nhẹ).
        *   *Xác minh:* [postgres/values.yaml:9](../../infra/apps/postgres/values.yaml#L9).
*   **Cơ sở dữ liệu bộ nhớ đệm (Redis):**
    *   **Loại triển khai:** Chạy độc lập (Standalone) thông qua Helm Chart Bitnami trong namespace ứng dụng.
    *   **Phiên bản:** Sử dụng chart **Bitnami Redis (targetRevision: 19.1.3)** với image tag `latest`.
        *   *Xác minh:* [redis-prod.yaml:9-17](../../infra/argocd/applications/apps/redis-prod.yaml#L9-L17).
*   **Cơ chế cache:**
    *   Backend NestJS tích hợp bộ cấu hình `CacheModule` kết nối trực tiếp đến Service Redis thông qua DNS nội bộ cụm: `redis-master.<namespace>.svc.cluster.local:6379`.
    *   Cơ chế này được sử dụng để giảm tải các truy vấn đọc nặng từ PostgreSQL (như danh sách bài viết công khai, thông tin cấu hình hệ thống).
    *   *Xác minh:* [deployment.yaml:85-88](../../infra/apps/backend/templates/deployment.yaml#L85-L88) và [minio.storage.ts](../../backend/src/infrastructure/storage/minio.storage.ts).

---

## 3. Lưu Trữ Dữ Liệu (Storage)

Hệ thống lưu trữ được phân lớp rõ ràng từ lưu trữ cục bộ phục vụ Staging, lưu trữ khối phân tán cho Production và Object Storage cho tệp tĩnh.

*   **Local Storage (Lưu trữ cục bộ):**
    *   Có sử dụng. Hệ thống cài đặt công cụ **Rancher Local Path Provisioner (v0.0.26)** làm StorageClass mặc định (`local-path`) trên Kubernetes.
    *   Công cụ này tự động cấp phát không gian lưu trữ hostPath trên Node VPS cho các nhu cầu phi-sản xuất hoặc môi trường Staging.
    *   *Xác minh:* [infra-services/tasks/main.yml:153-158](../../infra/ansible/roles/infra-services/tasks/main.yml#L153-L158) and [postgres/values.yaml:19](../../infra/apps/postgres/values.yaml#L19).
*   **Persistent Volumes (PV) & StorageClass:**
    *   **Network File System / Block Storage:** Sử dụng giải pháp lưu trữ phân tán **Longhorn v1.7.0** làm hạ tầng lưu trữ khối chính cho Production.
        *   *Xác minh:* [longhorn.yaml:11-37](../../infra/argocd/applications/platform/longhorn.yaml#L11-L37).
    *   Trong môi trường Production, StorageClass `longhorn` (cấu hình replica = 1 do giới hạn hạ tầng VPS đơn) được gán cho các PVC cốt lõi:
        *   PostgreSQL Production Database: Kích thước 20Gi (xem [postgres-values.yaml:6-7](../../infra/environments/production/postgres-values.yaml#L6-L7)).
        *   Backend Upload Folder: Kích thước được cấp phát động (xem [backend-values.yaml:37](../../infra/environments/production/backend-values.yaml#L37)).
        *   Redis Master Persistence: Kích thước 2Gi (xem [redis-prod.yaml:30-33](../../infra/argocd/applications/apps/redis-prod.yaml#L30-L33)).
    *   *Cloud PV (AWS EBS, GCP PD, Azure Disk):* **Không tìm thấy trong dự án** (Do hệ thống vận hành trên môi trường VPS vật lý/ảo hóa tự quản lý).
*   **Object Storage (Lưu trữ đối tượng):**
    *   Có sử dụng giải pháp **Cloudflare R2** (giao thức tương thích hoàn toàn S3 API).
    *   *Đường dẫn API (Endpoint):* `https://a8823974263cfbb734616640f1b9dd55.r2.cloudflarestorage.com`.
    *   *Mục đích ứng dụng:*
        1.  **Backend Media Storage:** Quản lý lưu trữ hình ảnh, tài liệu tĩnh của trang blog. Backend kết nối qua thư viện MinIO SDK sử dụng API key của Cloudflare R2 (xem [minio.storage.ts](../../backend/src/infrastructure/storage/minio.storage.ts) và các khoá mã hoá `MINIO_` trong SealedSecret [backend-values.yaml:43-49](../../infra/environments/production/backend-values.yaml#L43-L49)).
        2.  **Velero Backup Repository:** Làm nơi lưu trữ trung tâm của các bản sao lưu cụm K8s (bucket `velero-k8s-prod`, xem [velero.yaml:19-23](../../infra/argocd/applications/platform/velero.yaml#L19-L23)).
        3.  **etcd Snapshot Registry:** Nơi lưu trữ các tệp sao lưu dữ liệu cụm etcd hàng ngày (xem [cronjob.yaml:78](../../infra/platform/etcd-backup/cronjob.yaml#L78)).
*   **Volume Claims (PVC):**
    *   `portfolio-backend-production-pvc`: Liên kết ổ đĩa Longhorn vào đường dẫn `/app/uploads` và `/uploads` trong container backend để lưu tạm dữ liệu trước khi đẩy lên CDN hoặc phục vụ xử lý cục bộ (xem [pvc.yaml](../../infra/apps/backend/templates/pvc.yaml) và [deployment.yaml:108](../../infra/apps/backend/templates/deployment.yaml#L108)).
    *   `postgres-production-pvc`: Cấp phát cho thư mục lưu trữ dữ liệu gốc `/var/lib/postgresql/data` (xem [postgres/templates/pvc.yaml](../../infra/apps/postgres/templates/pvc.yaml)).

---

## 4. Môi Trường Triển Khai & Hạ Tầng (Deployment & Infrastructure)

Hạ tầng được thiết kế theo dạng Single-Node Kubernetes chạy trên các VPS vật lý tự quản lý, tự động hóa cấu hình bằng Ansible.

*   **Nền tảng hạ tầng:**
    *   **VPS thuần (Bare-metal / Virtual Private Servers)**.
    *   *Thông tin máy chủ:* Máy chủ Production có địa chỉ IP `103.6.235.15` (SSH Port 2222) và máy chủ Staging có IP `192.168.157.133` (SSH Port 2222).
    *   *Xác minh:* [prod.ini:6](../../infra/ansible/inventory/prod.ini#L6) và [staging.ini:9](../../infra/ansible/inventory/staging.ini#L9).
*   **Điều phối container (Container Orchestration):**
    *   Cụm **Kubernetes** tự quản lý được cài đặt bằng công cụ kubeadm thông qua Ansible role `k8s-cluster` (xem playbook [k8s_setup.yml](../../infra/ansible/playbooks/k8s_setup.yml) và các task [k8s-cluster/tasks/init.yml](../../infra/roles/k8s-cluster/tasks/init.yml)).
*   **Các dịch vụ Kubernetes then chốt:**
    *   **Ingress Controller (Traefik):**
        *   Được cài đặt bằng Helm chart `traefik/traefik` trong namespace `infra`.
        *   Thiết lập chạy DaemonSet với tùy chọn `hostNetwork=true` nhằm liên kết trực tiếp cổng 80/443 của Ingress về máy chủ vật lý mà không cần thông qua Cloud Load Balancer.
        *   Tích hợp sẵn các middleware định tuyến: `redirect-https` (chuyển hướng vĩnh viễn HTTP -> HTTPS) và `admin-allowlist` (chỉ cho phép truy cập Web UI quản trị từ dải IP local và IP cá nhân cố định của admin).
        *   *Xác minh:* [infra-services/tasks/main.yml:20-91](../../infra/ansible/roles/infra-services/tasks/main.yml#L20-L91).
    *   **Quản lý Bí mật (Bitnami Sealed Secrets):**
        *   Sử dụng giải pháp mã hóa một chiều để lưu trữ an toàn các tệp Secret trực tiếp trên Git GitOps.
        *   Controller chạy trên namespace `kube-system` tự động giải mã các tài nguyên `SealedSecret` sang `Secret` tiêu chuẩn bằng private key trong cụm.
        *   *Xác minh:* [infra-services/tasks/main.yml:127-132](../../infra/ansible/roles/infra-services/tasks/main.yml#L127-L132) và tệp chứng chỉ mã hóa [sealed-cert.pem](../../infra/sealed-cert.pem).
    *   **Giám sát & Cảnh báo (Prometheus & Grafana):**
        *   Triển khai bộ **kube-prometheus-stack v85.1.3** thông qua ArgoCD (bao gồm Prometheus Operator, Grafana để vẽ dashboard, Alertmanager để gửi cảnh báo Telegram/Email).
        *   Tắt tính năng giám sát control plane mặc định (như kube-scheduler, kube-controller-manager) để tiết kiệm tài nguyên trên VPS cấu hình thấp.
        *   Tích hợp thêm `postgres-exporter` để lấy metrics DB và cấu hình `ServiceMonitor` tương ứng.
        *   *Xác minh:* [kube-prometheus-stack.yaml](../../infra/argocd/applications/monitoring/kube-prometheus-stack.yaml), [postgres-exporter.yaml](../../infra/monitoring/exporters/postgres-exporter.yaml) và [postgres.yaml](../../infra/monitoring/servicemonitors/postgres.yaml).
    *   **Giám sát/Logs:**
        *   Hiện tại hệ thống sử dụng ghi log trực tiếp ra tệp tin cục bộ `/app/uploads/backend_log.txt` hoặc xuất log container tiêu chuẩn qua stdout/stderr.
    *   **Tự động mở rộng (Autoscaling - HPA):**
        *   Sử dụng **Metrics Server** của Kubernetes (patched tham số `--kubelet-insecure-tls` để bỏ qua xác thực SSL tự ký của kubelet).
        *   Cấu hình HPA cho cả Backend và Frontend Production để co giãn linh hoạt từ 1 đến 5 Pods dựa trên tải CPU thực tế.
        *   *Xác minh:* [infra-services/tasks/main.yml:94-102](../../infra/ansible/roles/infra-services/tasks/main.yml#L94-L102), [backend-values.yaml:32](../../infra/environments/production/backend-values.yaml#L32) và [frontend-values.yaml:18-22](../../infra/environments/production/frontend-values.yaml#L18-L22).
    *   **Cân bằng tải (Load Balancer):**
        *   *Không tìm thấy trong dự án* (Do chạy VPS đơn nên dùng cơ chế định tuyến trực tiếp của Traefik).
    *   **Service Mesh:**
        *   *Không tìm thấy trong dự án* (Mô hình mạng đơn giản không yêu cầu các giải pháp mTLS phức tạp).
    *   **Backup cụm (Velero):**
        *   Cấu hình backup tự động bằng **Velero (v7.1.3)** đẩy dữ liệu và cấu hình K8s lên Cloudflare R2 hằng ngày vào lúc 2h sáng Việt Nam (`0 19 * * *` UTC). Thời gian lưu trữ bản backup là 7 ngày.
        *   Sử dụng Node Agent (restic/kopia) để tự động sao lưu cấu trúc file trên các Persistent Volume đang chạy.
        *   *Xác minh:* [velero.yaml](../../infra/argocd/applications/platform/velero.yaml) và [schedule.yaml](../../infra/platform/velero/schedule.yaml).
    *   **Sao lưu etcd (etcd-backup):**
        *   Thiết lập một Kubernetes CronJob chạy trên control-plane Node vào lúc 1:00 AM mỗi ngày. CronJob tự động tải và kích hoạt `etcdctl` để chụp lại snapshot của etcd, sau đó sử dụng MinIO client (`mc`) đẩy trực tiếp file snapshot (.db) lên Cloudflare R2 và xóa các bản local cũ quá 7 ngày.
        *   *Xác minh:* [etcd-backup/cronjob.yaml](../../infra/platform/etcd-backup/cronjob.yaml).

---

## 5. Kho Lưu Trữ Mã Nguồn & CI/CD

Quy trình phát triển và triển khai phần mềm (GitOps) được tự động hóa hoàn toàn từ khâu kiểm tra code, quét bảo mật, đóng gói container và tự động đồng bộ.

*   **VCS (Version Control System):**
    *   Sử dụng **Git** được lưu trữ tập trung trên hệ thống **GitLab** (ví dụ: `https://gitlab.com/portfolio-macld/portfolio-infratructure.git`).
*   **CI/CD Pipeline (GitLab CI):**
    *   Hệ thống thiết lập các stage chuẩn doanh nghiệp bao gồm: `validate` -> `test` -> `build` -> `security` -> `publish` -> `deploy` -> `post-deploy` -> `rollback`.
    *   *Xác minh:* [backend/.gitlab-ci.yml](../../backend/.gitlab-ci.yml) and [frontend/.gitlab-ci.yml](../../frontend/.gitlab-ci.yml).
*   **Chiến lược Build & Deploy (GitOps):**
    *   **Đóng gói ảnh (Build Image):** Sử dụng `docker buildx` hỗ trợ BuildKit. Tận dụng Docker Cache Mount để cache các node modules của pnpm và cache build của Next.js `.next/cache` giữa các lần build nhằm tăng tốc tối đa tốc độ đóng gói.
    *   **Quản lý Artifacts:** Ảnh container được đẩy lên registry của **Docker Hub** (`docker.io`) với định danh tài khoản cá nhân.
    *   **Triển khai GitOps (ArgoCD):** 
        *   GitLab CI không deploy trực tiếp vào Kubernetes. Sau khi đóng gói thành công, pipeline dùng công cụ `yq` sửa đổi thẻ tag ảnh mới (`tag: "dev-${SHORT_SHA}"` cho staging hoặc `${TAG}@sha256:${DIGEST}` cho production) trong các tệp Helm values trên repository Git hạ tầng.
        *   ArgoCD (chạy trong namespace `argocd`) theo dõi repository hạ tầng này và tự động thực hiện đồng bộ hóa (Auto Sync) kéo ảnh mới về cụm.
    *   **Nguyên tắc "Build Once, Promote Nhiều":**
        *   Ảnh ứng dụng chỉ được build và chạy thử nghiệm ở nhánh `dev` (cho môi trường Staging). Khi phát hành bản Production, pipeline thực hiện sao chép trực tiếp ảnh đã test từ staging sang production tag bằng công cụ **crane** mà không biên dịch lại source code nhằm tránh phát sinh lỗi sai lệch phiên bản.
    *   *Xác minh:* [backend/.gitlab-ci.yml:258,346,385,424](../../backend/.gitlab-ci.yml#L258) và [infra/.gitlab-ci.yml](../../infra/.gitlab-ci.yml).
*   **Các bước kiểm thử tự động (Automated Testing):**
    *   **Linting:** Chạy `eslint` kiểm tra định dạng và cấu trúc code.
    *   **Typecheck:** Biên dịch kiểm tra kiểu TypeScript với `tsc --noEmit`.
    *   **Database Migration Validation:** Tạo một container PostgreSQL phụ chạy song song (`postgres:16-alpine`), chạy thử bộ migrations hiện có thông qua `prisma migrate deploy` và so sánh cấu trúc thực tế với schema Prisma (`prisma migrate diff`) để phát hiện sớm các lỗi SQL.
    *   **Unit Testing:** Kiểm thử đơn vị sử dụng framework `jest`.
    *   **Smoke Testing:** Sau khi sửa đổi giá trị Helm trên Git, pipeline chờ cụm K8s cập nhật, sau đó chạy kịch bản gửi yêu cầu curl kiểm tra endpoint `/api/v1/health` hoặc root URL tối đa 30 lần (mỗi lần cách nhau 10s) đảm bảo dịch vụ phản hồi mã `200 OK` mới đánh dấu job thành công.
*   **Bảo mật & Ký số hình ảnh:**
    *   **Quét lỗ hổng (Trivy):** Sử dụng Trivy quét mã độc/lỗ hổng thư viện trong image, quét mã nguồn tìm rò rỉ secret/key, và quét cấu hình Kubernetes không an toàn. Nếu phát hiện lỗi mức độ `HIGH` hoặc `CRITICAL`, pipeline sẽ tự động dừng.
    *   **Ký số (Cosign):** Ảnh container đạt chuẩn bảo mật sẽ được ký số bảo mật bằng Cosign thông qua cơ chế Keyless (Sigstore OIDC token) trước khi được sử dụng thực tế.
    *   **Tạo SBOM:** Tự động tạo tệp hóa đơn thành phần phần mềm CycloneDX dạng `sbom.cdx.json` phục vụ kiểm tra bảo mật độc lập.

---

## 6. Mạng, Bảo mật & Chứng chỉ

Kiến trúc mạng được bảo vệ từ mức máy chủ vật lý đến lớp định tuyến trong Kubernetes, đi kèm cấu hình mã hóa giao tiếp tự động.

*   **HTTPS/SSL & Quản lý Chứng chỉ:**
    *   Chứng chỉ SSL/TLS được cấp phát hoàn toàn tự động bởi CA **Let's Encrypt (Production ACME server)** thông qua ứng dụng **Cert-Manager** trong cụm.
    *   *Phương thức xác thực:* ACME HTTP-01 challenge được định tuyến qua Traefik Ingress.
    *   Chứng chỉ sau khi cấp được lưu trữ dưới dạng Kubernetes Secret và tự động gia hạn trước khi hết hạn.
    *   *Xác minh:* [cluster-issuer.yaml](../../infra/platform/cert-manager/cluster-issuers/cluster-issuer.yaml) và cấu hình tls trong [ingress.yaml:12-23](../../infra/apps/frontend/templates/ingress.yaml#L12-L23).
*   **Tường lửa & Chính sách mạng:**
    *   **Host Firewall (UFW):** Cấu hình trực tiếp trên hệ điều hành VPS thông qua Ansible. Thiết lập mặc định chặn toàn bộ kết nối đi vào (Default Deny), chỉ mở các cổng dịch vụ thiết yếu: 80 (HTTP), 443 (HTTPS), 2222 (cổng SSH bảo mật đã đổi từ cổng 22 mặc định), dải IP mạng nội bộ của Kubernetes Pods và Services.
        *   *Xác minh:* [firewall.yml](../../infra/ansible/roles/security/tasks/firewall.yml).
    *   **Hệ thống mạng cụm (CNI):** Sử dụng giải pháp **Cilium v1.16.1** (được cài đặt qua Helm). Cilium thay thế hoàn toàn kube-proxy truyền thống bằng công nghệ eBPF hiệu năng cao, tích hợp sẵn Hubble để giám sát và trực quan hóa luồng dữ liệu mạng.
        *   *Xác minh:* [k8s-cluster/tasks/init.yml:50-57](../../infra/ansible/roles/k8s-cluster/tasks/init.yml#L50-L57).
    *   **Kubernetes Network Policy:** Áp dụng chính sách mặc định `default-deny-ingress` trong namespace `portfolio` để chặn toàn bộ lưu lượng Ingress không mong muốn đi vào các Pod ứng dụng trừ khi có cấu hình cụ thể cho phép.
        *   *Xác minh:* [k8s-cluster/tasks/hardening.yml:10-20](../../infra/ansible/roles/k8s-cluster/tasks/hardening.yml#L10-L20).
*   **Xác thực & Phân quyền (Authentication & Authorization):**
    *   *Key/Token:* Backend NestJS tự triển khai cơ chế cấp phát và xác minh mã Token bảo mật thông qua **JWT (JSON Web Tokens)** sử dụng thư viện `@nestjs/jwt` kết hợp Passport.js. Khoá bí mật dùng để ký token được mã hóa và truyền vào container dưới dạng biến môi trường `JWT_SECRET`.
        *   *Xác minh:* [backend/package.json:29,48-49](../../backend/package.json#L29) và [local-development.md:51](../../scratch/infra-repo/docs/local-development.md#L51).
