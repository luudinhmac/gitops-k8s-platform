# Nhật ký Lỗi & Khắc phục sự cố (Debug Journal)

Tài liệu này ghi lại các lỗi kỹ thuật quan trọng gặp phải trong quá trình phát triển dự án Portfolio của **LƯU ĐÌNH MÁC** và các giải pháp đã được áp dụng.

---

## 1. Lỗi Mất phiên đăng nhập (Session Persistence)
- **Triệu chứng:** Đăng nhập thành công nhưng khi mở tab mới hoặc tải lại trang thì bị yêu cầu đăng nhập lại.
- **Nguyên nhân:** 
    - Frontend thiếu cơ chế global state quản lý Auth.
    - Thiếu logic khôi phục trạng thái (rehydrate) từ HttpOnly Cookie khi ứng dụng khởi tạo.
- **Giải pháp:**
    1. Triển khai `AuthContext` bao bọc toàn bộ ứng dụng.
    2. Sử dụng `useEffect` gọi API `/auth/profile` để kiểm tra cookie ngay khi app mount.
    3. Cập nhật `credentials: 'include'` cho toàn bộ các yêu cầu fetch.

## 2. Lỗi ReferenceError: useEffect is not defined
- **Triệu chứng:** Trang Login bị trắng xóa và báo lỗi runtime `useEffect is not defined`.
- **Nguyên nhân:** Sử dụng hook `useEffect` nhưng quên khai báo import từ thư viện `react`.
- **Giải pháp:** Bổ sung `import { useEffect } from 'react';` vào đầu tệp trang Login.

## 3. Lỗi Hydration Mismatch
- **Triệu chứng:** Cảnh báo đỏ trong console: "Hydration failed because the initial UI does not match what was rendered on the server".
- **Nguyên nhân:** Sử dụng các giá trị động hoặc truy cập `window` trong quá trình render phía Server của Next.js.
- **Giải pháp:** Sử dụng thuộc tính `suppressHydrationWarning` trên các thẻ `html` và `body` trong `layout.tsx` và đảm bảo các logic động chỉ chạy sau khi component đã mount.

## 4. Lỗi Sai dấu Tên nguời dùng
- **Triệu chứng:** Tên hiển thị là "Mạc" (dấu nặng) thay vì "Mác" (dấu sắc).
- **Nguyên nhân:** Nhầm lẫn trong quá trình nhập liệu nội dung.
- **Giải pháp:** Rà soát và cập nhật đồng loạt từ `MẠC` sang `MÁC` trên tất cả các trang và Metadata.

---

## 💡 Lưu ý vận hành
Khi gặp lỗi không xác định, hãy kiểm tra **Browser Console** để xem các bản ghi từ `[Auth]` mà tôi đã thiết lập trong `AuthContext.tsx`.
