# Báo cáo Triển khai và Nâng cấp Hệ thống - [21/04/2026]

Báo cáo này tài liệu hóa các thay đổi quan trọng và quá trình triển khai hệ thống lên môi trường Staging, bao gồm cả việc xử lý các sự cố phát sinh.

## 1. Các Nâng cấp Chính (Features & Fixes)

### 🔔 Hệ thống Cảnh báo Quản trị Toàn diện
- **Đa kênh**: Tích hợp đồng thời Telegram, MS Teams và Email.
- **Chuẩn hóa dữ liệu**: Mọi hành động quản trị hiện nay đều được báo cáo với định dạng chuẩn:
    - **Hành động**: [Mô tả chi tiết]
    - **IP**: [Địa chỉ IP người thực hiện]
    - **User**: [Định danh người dùng]
- **Tối ưu hiển thị**: Tự động chuyển đổi định dạng Bold (In đậm) giữa HTML (cho Telegram/Email) và Markdown (cho Teams).

### 📊 Hệ thống Thống kê và Giám sát
- **Thống kê người dùng**: Chuẩn hóa bộ đếm Online và Visitor. Lọc bỏ các yêu cầu API rác và chuẩn hóa địa chỉ IP cục bộ (`::1` và `127.0.0.1`).
- **Giám sát tài nguyên (Windows)**: Triển khai dịch vụ giám sát CPU và dung lượng ổ đĩa tương thích với nền tảng Windows, tự động cảnh báo khi tài nguyên vượt ngưỡng.

### 🛡️ Bảo mật và Ổn định
- **Recursive Decryption**: Sửa lỗi mã hóa chồng dữ liệu (Double Encryption). Hệ thống hiện có khả năng tự động giải mã các giá trị bị mã hóa lỗi từ phiên bản trước.
- **API Stabilization**: Sử dụng cơ chế `Rewrites` của Next.js thay cho proxy trung gian để giải quyết triệt để lỗi mất Cookie và lỗi xác thực 401.

---

## 2. Nhật ký Triển khai Staging

### 🚀 Quy trình thực hiện
- Đóng gói mã nguồn qua `tar`, đồng bộ lên máy chủ `192.168.157.50` qua `scp`.
- Tự động hóa cấu hình bằng **Ansible Playbook** để cập nhật cấu trúc DB, SSL và Docker.

### 🛠️ Xử lý Sự cố (Incident Handling)
**Sự cố: Lỗi Build Next.js (Duplicate Middleware)**
- **Triệu chứng**: Giai đoạn build Docker frontend thất bại do phát hiện tồn tại song song `middleware.ts` và `proxy.ts`.
- **Nguyên nhân**: Tệp `middleware.ts` là tàn dư cũ trên máy chủ Remote, gây xung đột với cơ chế `proxy.ts` mới.
- **Xử lý**: 
    1. SSH truy cập máy chủ để kiểm tra cấu trúc thư mục thực tế.
    2. Xóa tệp tàn dư: `/data/Portfolio/frontend/src/middleware.ts`.
    3. Rerun Ansible hoàn tất quá trình triển khai.

## 3. Kết quả hiện tại
- ✅ **Staging**: Hệ thống đã được cập nhật bản build mới nhất thành công.
- ✅ **Git**: Toàn bộ mã nguồn và báo cáo kỹ thuật đã được đồng bộ hóa lên nhánh `dev`.

---
**Người thực hiện**: Antigravity (AI Assistant)
**Thời gian hoàn tất**: 21:04 21/04/2026
