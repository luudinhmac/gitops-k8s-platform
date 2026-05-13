# Portfolio Frontend (Professional GitOps Edition)

Ứng dụng Frontend cho Portfolio cá nhân, được xây dựng bằng Next.js (App Router) và triển khai theo mô hình GitOps hiện đại, tách biệt hoàn toàn môi trường (Decoupled Architecture).

## 🚀 Tính năng & Công nghệ
- **Next.js 15 (Standalone Mode):** Tối ưu hóa hiệu năng và dung lượng Image khi chạy trên Docker/Kubernetes.
- **Tailwind CSS:** Giao diện Stealth UI tối giản, hiện đại và phản hồi nhanh.
- **Courses Platform (New):** Hệ thống học tập trực tuyến (LMS) tích hợp, cho phép xem lộ trình khóa học và đăng ký waitlist.
- **Dynamic Resume Timeline:** Trang giới thiệu tích hợp CV/Resume với hiệu ứng Timeline chuyên nghiệp.
- **Contract-First Development:** Tự động đồng bộ hóa TypeScript Types từ Swagger của Backend.
- **Environment-Driven Architecture:** Cấu hình linh hoạt qua biến môi trường, không Hardcode URL.

## 🔄 Quy trình CI/CD & GitOps
Dự án áp dụng mô hình **GitOps chuẩn mực** phối hợp giữa GitLab CI và ArgoCD:

1. **Nhánh `dev` (Staging):**
   - Tự động Build Image với tag `dev-[sha]`.
   - CI tự động `git push` cập nhật tag mới vào repo **Infrastructure**.
   - **ArgoCD** tự động đồng bộ hóa lên môi trường Staging.

2. **Git Tag `v*` (Production):**
   - Tự động Build Image với tag chính danh (ví dụ `v1.0.0`).
   - Nhấn nút **Manual Deploy** trong GitLab CI để cập nhật repo **Infrastructure**.
   - **ArgoCD** thực hiện triển khai lên Production.

## ⚙️ Cấu hình Biến môi trường
Mọi cấu hình được quản lý qua biến môi trường để đảm bảo tính di động của Container:

| Biến | Chức năng | Ví dụ |
| :--- | :--- | :--- |
| `INTERNAL_API_URL` | URL gọi API từ phía Server (SSR) | `http://portfolio-backend:3001/api/v1` |
| `NEXT_PUBLIC_API_URL` | URL gọi API từ phía trình duyệt | `https://api.luumac.io.vn/api/v1` |

## 🛠 Hướng dẫn Lập trình (Local Development)

1. **Cài đặt:**
   ```bash
   pnpm install
   ```

2. **Cấu hình:** Tạo file `.env` từ mẫu `.env.example`.

3. **Đồng bộ API Types:**
   ```bash
   pnpm run api:sync
   ```

4. **Chạy Dev Server:**
   ```bash
   pnpm run dev
   ```

## 📦 Docker & Kubernetes
Dự án được đóng gói bằng Docker multi-stage build. File manifest nằm trong repo Infrastructure để quản lý tập trung.

---
*Cập nhật lần cuối: 09/05/2026 bởi Antigravity Assistant.*
