# 📜 Deployment & Infrastructure Standards

Tài liệu này quy định các quy chuẩn bắt buộc về đặt tên, cấu trúc tệp tin Docker, cấu hình Kubernetes và quy trình triển khai nhằm đảm bảo tính nhất quán, an toàn và dễ vận hành cho toàn bộ hệ thống.

---

## 1. Quy Chuẩn Đặt Tên (Naming Convention)

Mọi tài nguyên trong cụm Kubernetes (Deployment, Service, StatefulSet, Secret, ConfigMap, PVC) phải tuân theo định dạng chuẩn hóa:

* **Công thức:** `<project>-<service>`
* **Ví dụ tốt:** `portfolio-backend`, `portfolio-frontend`, `portfolio-postgres`, `portfolio-secrets`.
* **Lưu ý:** Tuyệt đối không sử dụng các tên chung chung như `api`, `web`, `db`, `app` để tránh xung đột tài nguyên khi chạy nhiều dự án trên cùng một cụm K8s.

---

## 2. Quy Chuẩn Namespace (Phân vùng tài nguyên)

Hệ thống được phân chia thành các vùng độc lập để quản lý quyền truy cập và hạn mức tài nguyên:
* **Hạ tầng chung (`infra`):** Chứa các dịch vụ nền tảng dùng chung cho toàn cụm (Traefik Ingress Controller, Cert-Manager, Ingress Middleware).
* **Môi trường dự án cụ thể:** Mỗi dự án phải nằm trong các namespace chuyên biệt tương ứng với môi trường:
  * Staging: `portfolio` (hoặc `blog-staging`)
  * Production: `production` (hoặc `blog-prod`)
  * Database Staging: `database`
  * Database Production: `database-production`

---

## 3. Quy Chuẩn CI/CD Pipeline (GitLab)

Mọi tệp tin `.gitlab-ci.yml` phải sử dụng biến số (Variables) khai báo ở đầu file thay vì viết cứng giá trị để hỗ trợ tái sử dụng:
* `K8S_NAMESPACE`: Tên namespace mục tiêu.
* `K8S_DEPLOYMENT_NAME`: Tên Deployment cần cập nhật.
* `K8S_CONTAINER_NAME`: Tên container bên trong Pod.

* **Lệnh deploy chuẩn hóa trong CI runner:**
  ```bash
  kubectl set image deployment/$K8S_DEPLOYMENT_NAME $K8S_CONTAINER_NAME=$IMAGE_TAG -n $K8S_NAMESPACE
  ```

---

## 4. Quy Chuẩn Đóng Gói (Dockerfile Standards)

Để tối ưu hóa kích thước ảnh (Image size), tăng tốc độ pull và vá các lỗ hổng bảo mật, Dockerfile của Frontend và Backend phải tuân thủ:

1. **Multi-Stage Builds:** Bắt buộc sử dụng cơ chế build nhiều giai đoạn để loại bỏ toàn bộ mã nguồn nguồn, devDependencies và compiler ra khỏi image chạy thực tế (Production image).
2. **Bảo mật phân quyền (Non-Root User):** Tuyệt đối không chạy container bằng tài khoản `root`. Phải tạo user system riêng biệt và cấp quyền tối thiểu:
   * Backend: Tạo user `nestjs` nhóm `nodejs`.
   * Frontend: Tạo user `nextjs` nhóm `nodejs`.
3. **Base Image:** Sử dụng phiên bản gọn nhẹ Alpine Linux (`node:20-alpine` hoặc `node:22-alpine`) làm base image.
4. **Next.js Standalone Build:** Frontend Next.js phải bật cấu hình `output: 'standalone'` trong `next.config.ts` để Next.js tự động gom các file runtime tối thiểu vào thư mục `.next/standalone`, giúp kích thước image giảm từ ~1.5GB xuống dưới 150MB.
5. **Prisma Client Generation:** Đối với NestJS Backend, lệnh `npx prisma generate` phải được chạy ở stage build và copy kết quả client sang stage run (`runner`) để đảm bảo Prisma Client tương thích chính xác với Database.

---

## 5. Quy Chuẩn Hạ Tầng (Ansible & Kustomize)

Kiến trúc hạ tầng của dự án được phân tách thành 3 lớp rõ rệt:

1. **Lớp 1 - Setup nền tảng (Ansible):** Chỉ dùng để cài đặt hệ điều hành, cấu hình mạng, dựng cluster K8s, cài Docker, containerd và các daemon phụ trợ trên VPS.
2. **Lớp 2 - Định cấu hình (Kustomize):** Quản lý toàn bộ tệp tin manifest Kubernetes khai báo. Chia cấu hình thành thư mục `base/` (cấu hình chung) và `overlays/` (staging/production riêng biệt).
3. **Lớp 3 - Vận hành (CI/CD / GitOps):** ArgoCD tự động quét thư mục overlays trên Git và apply lên cụm K8s.

* **Dữ liệu bền vững (Persistent Data):** Toàn bộ thư mục mount đĩa vật lý của Postgres hoặc Longhorn PV trên máy chủ VPS phải được gom về gốc `/data/k8s/` để phục vụ công tác backup tập trung.

---

## 6. Quy Chuẩn Mạng & Ingress

* **Ingress Entry Point:** Traefik Ingress Controller lắng nghe ở cổng port 80/443 của Ingress Gateway.
* **Middlewares:** Các cấu hình bảo mật nâng cao như giới hạn IP truy cập (`admin-allowlist`), nén dữ liệu (`compress`), hoặc thêm security headers phải được khai báo dạng Middleware Custom Resource của Traefik tại namespace `infra` để dễ dàng áp dụng chéo.
