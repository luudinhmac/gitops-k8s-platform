# Frontend Development Rules & Standards

Tài liệu này tổng hợp các tiêu chuẩn bắt buộc khi phát triển Frontend cho dự án Portfolio để đảm bảo chất lượng Production và UX tốt nhất.

## 1. Accessibility & Autofill (QUAN TRỌNG)
Để trình duyệt không báo lỗi trong tab **Issues** và hỗ trợ tự động điền form (Autofill) mượt mà:
- **ID & Name**: Mọi thẻ `<input>`, `<select>`, `<textarea>` đều phải có thuộc tính `id` và `name` duy nhất.
- **Label Association**: Mọi ô nhập liệu phải có `<label>` đi kèm. Trong React, sử dụng thuộc tính `htmlFor` trên thẻ Label để trỏ đúng vào `id` của Input.
- **Zero Issues**: Code được coi là hoàn thiện khi không còn bất kỳ cảnh báo đỏ/vàng nào trong mục **Issues** của Chrome DevTools liên quan đến Form.

## 2. Xử lý dữ liệu nhạy cảm (URL Safety)
- Khi hiển thị hoặc bóc tách các chuỗi kết nối (như `DATABASE_URL` chứa mật khẩu):
  - **Sử dụng class `URL`**: Luôn ưu tiên dùng `new URL(string)` thay vì Regex thủ công để tránh lỗi khi mật khẩu có ký tự đặc biệt như `@`, `:`, `#`.
  - **Mã hóa mật khẩu**: Luôn sử dụng `encodeURIComponent()` khi ghép mật khẩu vào chuỗi URL để đảm bảo an toàn.

## 3. Thẩm mỹ & Trải nghiệm (Aesthetics)
- **Typography**: Không dùng font hệ thống mặc định. Ưu tiên các bộ font hiện đại (Inter, Space Grotesk, v.v.).
- **Micro-interactions**: Sử dụng Framer Motion cho các hiệu ứng chuyển cảnh, hover để tạo cảm giác hệ thống "sống động".
- **Dark Mode First**: Ưu tiên thiết kế tối ưu cho Dark Mode với các dải màu Cyan/Slate/Indigo cao cấp.