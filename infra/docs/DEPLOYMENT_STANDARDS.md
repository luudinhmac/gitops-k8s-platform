# Deployment & Infrastructure Standards

Tài liệu này quy định các quy chuẩn về đặt tên, cấu trúc và quy trình triển khai để đảm bảo tính nhất quán cho toàn bộ hệ thống.

## 1. Quy chuẩn đặt tên (Naming Convention)
Mọi tài nguyên trong Kubernetes (Deployment, Service, StatefulSet, Secret, ConfigMap) phải tuân theo định dạng:
**Cấu trúc:** `<project>-<service>`
- **Ví dụ:** `portfolio-backend`, `portfolio-frontend`, `portfolio-postgres`.
- **Lưu ý:** Không sử dụng tên chung chung như `api`, `web`, `db` để tránh xung đột khi chạy nhiều dự án trên cùng một Cluster.

## 2. Quy chuẩn Namespace
- **Hạ tầng (`infra`):** Chứa các dịch vụ dùng chung (Traefik, Cert-Manager, Monitoring).
- **Dự án (`<project>`):** Mỗi dự án phải nằm trong một namespace riêng mang tên dự án đó.
    - **Ví dụ:** Namespace `portfolio` chứa toàn bộ backend/frontend của dự án blog.

## 3. Quy chuẩn CI/CD (GitLab)
Mọi file `.gitlab-ci.yml` phải sử dụng biến số (Variables) cho các thành phần tái sử dụng:
- `K8S_NAMESPACE`: Tên namespace dự án.
- `K8S_DEPLOYMENT_NAME`: Tên deployment chuẩn hóa.
- `K8S_CONTAINER_NAME`: Tên container bên trong pod.
**Lệnh deploy mẫu:**
`kubectl set image deployment/$K8S_DEPLOYMENT_NAME $K8S_CONTAINER_NAME=$IMAGE_TAG -n $K8S_NAMESPACE`

## 4. Quy chuẩn Dockerfile
- **Multi-stage build:** Bắt buộc sử dụng để giảm dung lượng image.
- **Security:** Không chạy bằng quyền `root`. Phải tạo user system (ví dụ: `nestjs`, `nextjs`).
- **Base Image:** Sử dụng `node:XX-alpine` để tối ưu kích thước.
- **Next.js:** Phải sử dụng chế độ `standalone` build.
- **Prisma:** Lệnh `npx prisma generate` phải được chạy ở stage cuối (`runner`) để đảm bảo client tồn tại trong production.

## 5. Quy chuẩn Hạ tầng (Ansible & Kustomize)
- **Kiến trúc 3 lớp:** 
    1. **Ansible**: Chỉ dùng để setup cluster và các dịch vụ nền (Node, Docker, K8s, Traefik).
    2. **Kustomize**: Quản lý toàn bộ manifests (Base/Overlays). Tách biệt cấu hình staging/prod.
    3. **CI/CD**: Thực hiện deploy ứng dụng thông qua `kubectl apply -k`.
- **Cấu trúc thư mục:** Ansible roles nằm trong `ansible/`, K8s manifests nằm trong `k8s/`.
- **Dữ liệu:** Toàn bộ dữ liệu bền vững (Persistent Data) được lưu tại `/data/k8s/` trên server.

## 6. Quy chuẩn Networking
- **Ingress:** Sử dụng Traefik Ingress Controller.
- **Routing:** Sử dụng `ExternalName` service tại namespace `infra` để làm cầu nối tới các service bên trong namespace dự án.
- **Domain Local:** Sử dụng đuôi `.local` (ví dụ: `staging.local`) cho các môi trường kiểm thử nội bộ.
