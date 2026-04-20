# 📝 Báo cáo Kỹ thuật: Triển khai Hệ thống Staging Fullstack

Báo cáo này tổng hợp các sự cố phát sinh và phương án xử lý chi tiết trong quá trình đóng gói và triển khai ứng dụng Portfolio từ môi trường Local sang Staging VM (IP: `192.168.157.109`).

---

## 1. Sự cố về Build & TypeScript (Backend)

### ❌ Sự cố: ESM & CommonJS Conflict
- **Hiện tượng**: `pnpm run build` thất bại với hàng loạt lỗi `TS2307` (Cannot find module) và lỗi cấu hình `resolvePackageJsonExports`.
- **Nguyên nhân**: Sự không tương thích giữa cấu hình ESM (ECMAScript Modules) và các thư viện hỗ trợ CommonJS trong NestJS khi đóng gói production.
- **Giải pháp**:
    - Chuyển đổi Backend về chế độ **CommonJS** đồng bộ.
    - Cập nhật `tsconfig.json`, loại bỏ các flag không tương thích như `resolvePackageJsonExports`.

---

## 2. Sự cố về Quyền hạn & Lưu trữ (Docker)

### ❌ Sự cố: EACCES Permission Denied
- **Hiện tượng**: Backend crash khi khởi động vì không có quyền tạo thư mục `/app/uploads`.
- **Nguyên nhân**: Docker chạy dưới quyền user `nestjs` nhưng thư mục được tạo bởi `root` từ các lệnh trước đó trong Dockerfile.
- **Giải pháp**:
    - Sử dụng lệnh `mkdir -p` và `chown -R nestjs:nodejs` ngay trong Dockerfile để phân quyền sớm.
    - Cấu hình **Docker Volume** (`uploads_data`) để dữ liệu ảnh không bị mất khi container khởi động lại.

---

## 3. Sự cố về Kết nối API (Networking)

### ❌ Sự cố: Frontend gọi API về Localhost
- **Hiện tượng**: Trang web load được nhưng Đăng nhập báo lỗi Network Error hoặc gọi về `localhost:3001`.
- **Nguyên nhân**: Biến môi trường `NEXT_PUBLIC_API_URL` của Next.js bị "nuốt" mất hoặc mặc định là localhost do cơ chế Build-time của Next.js.
- **Giải pháp**:
    - Sử dụng **Docker Build Arguments** (`ARG`) để truyền URL Staging vào lúc đóng gói Image.
    - Cấu hình lại `axios.ts` và `middleware.ts` để tự động nhận biết: gọi nội bộ (Docker network) dùng `portfolio-backend` và gọi từ trình duyệt dùng `staging.local`.

---

## 4. Sự cố về Định tuyến (Nginx Reverse Proxy)

### ❌ Sự cố: API & Images trả về 404 Not Found
- **Hiện tượng**: Trình duyệt gọi đúng URL nhưng Server báo 404.
- **Nguyên nhân**: 
    - Nginx cấu hình `rewrite` làm mất tiền tố `/api` trước khi gửi vào Backend.
    - Nginx không có quy tắc chuyển tiếp cho thư mục `/uploads/`.
- **Giải pháp**:
    - Loại bỏ lệnh `rewrite` trong Nginx để giữ nguyên tiền tố `/api`.
    - Thêm một `location /uploads/` riêng biệt để phục vụ file tĩnh trực tiếp từ Backend.
    - Chuẩn hóa các dấu gạch chéo (`/`) cuối đường dẫn để Nginx định tuyến chính xác.

---

## 5. Sự cố về Dữ liệu (Database & CORS)

### ❌ Sự cố: Không thể đăng nhập dù đúng mật khẩu
- **Hiện tượng**: Backend trả về 403 Forbidden hoặc lỗi mật khẩu không đúng.
- **Nguyên nhân**: 
    - CORS chặn domain `staging.local`.
    - Mật khẩu tạo trong script `seed_admin.ts` không khớp với mật khẩu trong file `.env`.
- **Giải pháp**:
    - Mở rộng `ALLOWED_ORIGINS` bao gồm cả IP và tên miền staging.
    - Đồng bộ hóa script Seed để lấy mật khẩu trực tiếp từ biến môi trường của hệ thống.

---

## 💡 Bài học kinh nghiệm cho Production
1. **Bất biến Image**: Môi trường production nên dùng Image đã được build sẵn, tránh build lại trên server để đảm bảo tính nhất quán.
2. **SSL thật**: Hiện tại Staging dùng SSL tự cấp (Self-signed), khi lên Production cần dùng Let's Encrypt (Certbot) để trình duyệt không cảnh báo bảo mật.
3. **Health Checks**: Cần thêm các câu lệnh kiểm tra sức khỏe (health checks) của container để tự động phục hồi khi có lỗi.

