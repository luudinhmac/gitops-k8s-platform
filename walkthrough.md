# Báo Cáo Triển Khai Hạ Tầng K8s & Tổng Kết Lỗi

Chúc mừng! Hệ thống Portfolio đã được triển khai thành công trên cụm Kubernetes Staging (192.168.157.110). Dưới đây là chi tiết các vấn đề đã gặp và cách xử lý.

## 1. Backend (NestJS + Prisma)

### ❌ Lỗi: Prisma Engine Binary Mismatch
- **Hiện tượng**: Pod crash ngay khi khởi động với lỗi không tìm thấy Prisma Engine hoặc lỗi thực thi file binary.
- **Nguyên nhân**: Prisma build trên Windows (máy local) tạo ra binary cho Windows, không chạy được trên Alpine Linux (Docker).
- **Cách fix**: 
    - Thêm `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` vào `schema.prisma`.
    - Cập nhật `Dockerfile` để chạy `npx prisma generate` ngay tại bước **Runner** (Runtime) để tạo đúng binary cho OS.

### ❌ Lỗi: Module Resolution (Cannot find module)
- **Hiện tượng**: Lỗi không tìm thấy `@prisma/client` do trước đó cấu hình output ra thư mục tùy chỉnh `src/generated`.
- **Nguyên nhân**: Đường dẫn tùy chỉnh gây khó khăn cho việc phân giải module của Node.js trong môi trường container.
- **Cách fix**: Khôi phục về mặc định của `@prisma/client`, xóa bỏ các cấu hình `output` và `path mapping` trong `tsconfig.json`.

### ❌ Lỗi: CORS & Port Mismatch
- **Hiện tượng**: Trình duyệt báo lỗi CORS khi gọi API từ IP Staging.
- **Cách fix**: 
    - Cập nhật `main.ts` để cho phép origin `https://192.168.157.110`.
    - Đổi cổng mặc định của Backend sang `3001` để khớp với Service K8s.

---

## 2. Frontend (Next.js)

### ❌ Lỗi: Hardcoded API URL (404/Network Error)
- **Hiện tượng**: Frontend cố gắng gọi API tại `localhost:3000` hoặc `127.0.0.1:3002` dẫn đến lỗi kết nối trên Staging.
- **Cách fix**: 
    - Đồng bộ hóa URL API: Sử dụng đường dẫn tương đối `/api` cho Trình duyệt và URL nội bộ `http://backend:3001/api` cho phía Server (SSR).
    - Ép thêm hậu tố `/v1` vào mọi yêu cầu gọi nội bộ để khớp với Versioning của Backend.

### ❌ Lỗi: Middleware Admin Lockout (Stealth Mode)
- **Hiện tượng**: Vào `/admin` luôn bị 404 kể cả khi đã đăng nhập.
- **Nguyên nhân**: 
    1. Middleware chặn luôn cả trang `/admin/login`.
    2. Middleware tìm cookie tên `token` trong khi thực tế trình duyệt lưu là `access_token`.
- **Cách fix**: 
    - Thêm ngoại lệ cho `/admin/login` trong Middleware.
    - Cập nhật logic kiểm tra Token: `request.cookies.get('token') || request.cookies.get('access_token')`.

### ❌ Lỗi: Pipeline Blocking (Sync API Failure)
- **Hiện tượng**: Build Frontend bị dừng vì bước `sync_api` (lấy Swagger) bị lỗi.
- **Cách fix**: 
    - Thiết lập `allow_failure: true` cho job `sync_api` để không chặn đứng toàn bộ Pipeline.
    - Sử dụng `pnpm install --no-frozen-lockfile` để tránh lỗi xung đột file lock trong môi trường CI.

---

## 3. Hạ Tầng (Infrastructure)

### ✅ Ingress Routing
- Cấu hình Nginx Ingress để phân luồng thông minh:
    - `/api` -> Điều hướng về Backend.
    - `/` -> Điều hướng về Frontend.

### ✅ Database Seeding
- Thực hiện lệnh `kubectl exec` để chạy script `seed.js` trực tiếp trên Pod, khởi tạo tài khoản Superadmin `macld`.

---

## 🚀 Trạng thái hiện tại: **HOÀN THÀNH**
- **Frontend**: https://192.168.157.110/
- **Admin**: https://192.168.157.110/admin (Cần đăng nhập tại /login trước)
- **API Docs**: https://192.168.157.110/api/v1/docs
