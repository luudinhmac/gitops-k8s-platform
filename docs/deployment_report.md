# Báo Cáo Triển Khai Hệ Thống (Version 2.0 - Production-Grade)

**Ngày thực hiện:** 2026-04-24  
**Trạng thái:** ✅ THÀNH CÔNG (Deployed to Staging)  
**Môi trường:** Staging (VM 192.168.157.109)

---

## 1. Mục Tiêu & Thành Tựu
Hệ thống đã được tái cấu trúc hoàn toàn từ dạng Monolith chưa tối ưu sang kiến trúc **Production-Grade** và **Kubernetes-Ready**.

### Các thành tựu chính:
*   **Unified Request Flow:** Loại bỏ hoàn toàn xung đột đa tầng Proxy (Next.js Rewrites vs Nginx). Hiện tại Nginx là Entry Point duy nhất.
*   **Build Once, Run Anywhere:** Image Frontend đã được tách biệt hoàn toàn khỏi biến môi trường lúc build (`NEXT_PUBLIC_API_URL`). Một Image duy nhất có thể chạy trên Local, Staging và Production.
*   **Network Isolation:** Backend và Database đã được thu hồi cổng (port), không còn expose ra internet. Giao tiếp hoàn toàn nội bộ qua Docker Network.
*   **Resilience & Scalability:** Backend có khả năng tự phục hồi kết nối DB (Retry logic) và hỗ trợ Graceful Shutdown.

---

## 2. Thay Đổi Kiến Trúc

| Thành phần | Trước Refactor (Legacy) | Sau Refactor (Production-Ready) |
| :--- | :--- | :--- |
| **Request Flow** | Client → Next.js Rewrite → Backend | Client → Nginx → [Frontend/Backend] |
| **API Call** | Dùng Absolute URL (Hardcoded) | Dùng Relative Path (`/api`) |
| **Cấu hình** | Baked-in lúc build image | Nạp qua ENV lúc runtime |
| **Bảo mật** | Lộ Password Hash qua F12 | Password Hash đã được lọc bỏ |
| **Độ ổn định** | Crash nếu DB khởi động chậm | Tự động Retry kết nối (5 lần) |

---

## 3. Chi Tiết Triển Khai Staging
Việc triển khai được thực hiện tự động qua **Ansible Playbook** từ Node quản trị (`192.168.157.50`).

### Các bước đã thực hiện:
1.  **Dọn dẹp (Pre-deployment):** 
    *   SSH vào Staging Node, dừng và xóa các container cũ.
    *   Xóa bỏ thư mục dự án cũ (`/opt/portfolio`) để tránh xung đột file cấu hình.
2.  **Cấu hình hạ tầng:**
    *   Tự động sinh cấu hình Nginx chuẩn hóa cho SSL (Self-signed).
    *   Sinh file `docker-compose.yml` với cơ chế cách ly mạng (No public ports for Backend).
3.  **Khởi tạo Dữ liệu:**
    *   Sử dụng `prisma db push` để khởi tạo schema vì project chưa có migrations baseline.
    *   Chạy `prisma db seed` để tạo tài khoản Superadmin (`macld`) và cấu hình hệ thống.

---

## 4. Bảo Mật & Tối Ưu Hóa
*   **F12 Security:** Đã vá lỗ hổng rò rỉ hash mật khẩu tại endpoint `/api/auth/profile`.
*   **Cookie Security:** Token JWT được lưu trữ dưới dạng `HttpOnly`, chống đánh cắp qua Script.
*   **Local Compatibility:** Vẫn giữ khả năng chạy `pnpm dev` mượt mà ở Local Windows nhờ cơ chế Rewrites động trong `next.config.ts`.

---

## 5. Hướng Dẫn Vận Hành
*   **Truy cập Staging:** `https://192.168.157.109`
*   **Tài khoản Admin:** `macld` / `macld@2026`
*   **Quản lý Service:**
    ```bash
    cd /opt/portfolio-staging
    docker compose ps      # Kiểm tra trạng thái
    docker compose logs -f # Xem log thời gian thực
    ```

---

## 6. Kế Hoạch Tiếp Theo (Roadmap)
1.  **Migration Baseline:** Chạy `npx prisma migrate dev` ở Local để tạo thư mục `migrations` chính thức, thay thế hoàn toàn cho `db push`.
2.  **Kubernetes Migration:** Chuyển đổi file `docker-compose.yml` thành K8s Manifests (Deployment, Service, Ingress).
3.  **CI/CD Pipeline:** Tích hợp quy trình build/push image vào GitHub Actions hoặc GitLab CI.

---
*Báo cáo được lập bởi: **Senior DevOps Engineer & Architect Agent***
