# Thiết kế chức năng Quản lý Cài Đặt (Settings Module)

Dựa trên yêu cầu của bạn về 4 nhóm cấu hình, dưới đây là thiết kế chi tiết về mặt kiến trúc, cơ sở dữ liệu và giao diện cho chức năng Cài đặt.

## 1. Phương pháp lưu trữ (Storage Strategy)

Để đảm bảo an toàn, tối ưu hiệu năng và đúng chuẩn thực tế, các cài đặt sẽ được phân tách thành 2 nơi lưu trữ:

- **Database (`Setting` table)**: Dùng cho các cấu hình thay đổi thường xuyên, phi kỹ thuật (Nhóm I, Nhóm III - Quản lý quyền, Nhóm IV). Bất kỳ quản trị viên nào cũng có thể thay đổi trực tiếp ngay trên Dashboard.
- **Environment Variables (`.env`) / Config file**: Dùng cho cấu hình hệ thống, DevOps, bảo mật sâu (Nhóm II, Nhóm III - Session/Rate limit). 

## User Review Required
> [!IMPORTANT]
> - Chúng ta sẽ hiển thị các cấu hình từ Nhóm II (Environment) lên trang Admin nhưng ở dạng **Chỉ đọc (Read-only)** để tránh việc admin vô tình sửa làm sập server. Chỉ người có quyền truy cập vào Server/VM mới được quyền sửa file `.env`. Bạn có đồng ý với phương pháp này không?
> - Các giá trị nhạy cảm (như Password SMTP, API Keys) sẽ được ẩn/che mờ trên giao diện.

---

## 2. Thiết kế Database (Nhóm I & IV)

Tạo một bảng `Setting` dạng Key-Value để dễ dàng mở rộng sau này mà không cần thay đổi Schema liên tục.

### [NEW] `backend/prisma/schema.prisma`
```prisma
model Setting {
  key         String   @id        // VD: "site_title", "google_analytics_id"
  value       String?  @db.Text   // Lưu giá trị (Có thể là JSON string nếu cần)
  group       String   @default("general") // "general", "marketing", "legal"
  is_public   Boolean  @default(true)      // Cho phép frontend fetch (dành cho API không cần auth)
  updated_at  DateTime @default(now()) @updatedAt
}
```

Các keys dự kiến:
- **Nhóm I**: `site_title`, `site_tagline`, `logo_url`, `favicon_url`, `default_lang`, `timezone`, `cookie_consent_enabled`, `footer_copyright`, `comments_enabled`, `comments_moderation`.
- **Nhóm IV**: `ga_id`, `fb_pixel_id`, `header_scripts`, `footer_scripts`, `ads_enabled`, `adsense_snippet`.
*(Nội dung Quyền riêng tư & Điều khoản hiện đã được tạo thành file trong mã nguồn, có thể giữ nguyên hoặc chuyển vào DB tuỳ ý, tuy nhiên giữ dạng file tĩnh tĩnh hiện tại sẽ có lợi cho SEO và tốc độ hơn).*

---

## 3. Kiến trúc Backend (NestJS)

### [NEW] `backend/src/settings/*`
Tạo một module mới quản lý cấu hình:
- `SettingsController`: Cung cấp API `GET /settings/public` (cho frontend SSR/SSG), và `GET /settings/admin`, `PUT /settings/admin` (cho Dashboard).
- `SettingsService`: Logic cập nhật/tạo mới cài đặt, lấy cấu hình Môi trường (Environment Variables) đưa vào một endpoint an toàn.
*(Lưu ý: Settings lấy từ DB sẽ được **cache** bằng Redis để giảm tải cho database từ các requests của người dùng truy cập trang chủ).*

---

## 4. Giao diện Frontend (Next.js)

### [NEW] `frontend/src/app/admin/settings/page.tsx`
Tạo trang quản lý cấu hình với giao diện hiện đại (Blue theme), chia làm 4 Tabs (Vertical hoặc Horizontal):

1. **Giao diện & Nội dung (General)**:
   - Các field: Tên Website, Mô tả, Logo/Favicon (tích hợp Upload), Ngôn ngữ, Múi giờ, Bật/Tắt bình luận.
   - Text editor (hoặc textarea) cho Footer Copyright.

2. **Hệ thống & DevOps (System)**: *(Read-only UI hiển thị trạng thái server)*
   - Status: Môi trường (Dev/Prod), Phiên bản Node, Phiên bản DB.
   - Các thẻ (badge) hiển thị đã set hay chưa với các biến: `DATABASE_URL`, `REDIS_URL`, `SMTP_HOST`.
   - **Nút Action**: Xóa Cache (Flush Redis).

3. **Người dùng & Bảo mật (Security)**:
   - Hiển thị danh sách quyền hạn (RBAC), điều hướng tới trang `Quản lý người dùng` hiện tại.
   - Trạng thái cấu hình (chỉ đọc): Rate Limit, Session Timeout (được lấy từ cấu hình hệ thống).

4. **Tiếp thị & Đo lường (SEO & Marketing)**:
   - Form nhập ID Google Analytics, Facebook Pixel.
   - Code editor mini (textarea dùng phông code) để nhúng Header/Footer scripts.
   - Toggle bật/tắt quảng cáo và vùng nhập mã AdSense.

---

## 5. Verification Plan

### Manual Verification
- Chạy `npx prisma db push` để tạo bảng.
- Seed các dữ liệu setting mặc định vào database.
- Xác nhận trang `/admin/settings` hiển thị đầy đủ 4 Tabs với tông màu Xanh dương.
- Lưu cấu hình (ví dụ thay đổi tên site) và kiểm tra xem frontend bên ngoài có thay đổi theo dựa trên API.
- Cấu trúc thư mục mới không phá vỡ bất kỳ luồng hoạt động nào hiện tại.
