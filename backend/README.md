# Portfolio Backend (Professional GitOps Edition)

Dịch vụ Backend (API) cho dự án Portfolio, xây dựng bằng NestJS và quản lý theo mô hình GitOps, hỗ trợ kiến trúc hướng môi trường (Environment-Driven).

## 🚀 Tính năng & Công nghệ
- **NestJS:** Framework mạnh mẽ, có tính module cao và dễ mở rộng.
- **PostgreSQL:** Lưu trữ dữ liệu quan hệ ổn định.
- **Swagger/OpenAPI:** Tự động tạo tài liệu API và cung cấp schema cho Frontend đồng bộ Type.
- **GitOps Ready:** Tách biệt cấu hình và mã nguồn, triển khai tự động qua Repo Infrastructure.

## 🔄 Quy trình Release & CI/CD
Hệ thống sử dụng quy trình **Automated Infrastructure Update**:

1. **Staging (Nhánh `dev`):**
   - CI build image và đẩy lên Docker Hub.
   - CI tự động cập nhật file `environments/staging/backend-values.yaml` trong repo Infrastructure.
   - ArgoCD tự động Sync lên Cluster.

2. **Production (Tag `v*`):**
   - Không chạy lại quy trình validate/test/build từ đầu. Job `fetch_image` tự động lấy (promote) Image trực tiếp từ Staging.
   - Yêu cầu kích hoạt thủ công thông qua nút duyệt (`manual_approval`).
   - Cập nhật tag mới vào thư mục `environments/production/` và tự động chạy `smoke_test_production` để kiểm tra độ ổn định của API.

## ⚙️ Cấu hình Biến môi trường
Cần cấu hình các biến sau trong Kubernetes Secrets hoặc `.env` local:

| Biến | Mô tả |
| :--- | :--- |
| `DATABASE_URL` | Chuỗi kết nối Postgres (postgresql://user:pass@host:port/db) |
| `JWT_SECRET` | Mã bí mật dùng để ký Token xác thực |
| `PORT` | Cổng ứng dụng chạy (mặc định 3001) |

## 🛠 Lập trình cục bộ

1. **Cài đặt:** `pnpm install`
2. **Chạy ứng dụng:** `pnpm run start:dev`
3. **Xem tài liệu API:** Truy cập `http://localhost:3001/api/docs` (sau khi chạy).

## 🐳 Docker
File `Dockerfile` được tối ưu hóa để chạy trong môi trường Kubernetes, hỗ trợ health-check và graceful shutdown.

---
*Cập nhật lần cuối: 09/05/2026
