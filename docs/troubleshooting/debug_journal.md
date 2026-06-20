# 📓 Application Debug Journal

Tài liệu này ghi lại các lỗi kỹ thuật quan trọng gặp phải trong quá trình phát triển phân hệ Frontend và Backend cục bộ và các giải pháp đã được áp dụng để khắc phục.

---

## 1. Lỗi Mất Phiên Đăng Nhập (Session Persistence)

* **Triệu chứng (Symptom):** Người dùng đăng nhập thành công vào Admin Dashboard, tuy nhiên khi tải lại trang (F5) hoặc mở một tab mới trên trình duyệt thì phiên làm việc biến mất và hệ thống yêu cầu đăng nhập lại từ đầu.
* **Nguyên nhân (Root Cause):**
  * Phân hệ Frontend thiếu cơ chế quản lý trạng thái xác thực toàn cục (Global Auth State).
  * Thiếu logic khôi phục trạng thái (rehydrate) từ HttpOnly Cookie lưu trên trình duyệt khi ứng dụng Next.js bắt đầu khởi chạy.
* **Giải pháp khắc phục (Solution):**
  1. Xây dựng và bọc toàn bộ ứng dụng trong một `AuthContext` (React Context API).
  2. Sử dụng hook `useEffect` gọi tự động API `/auth/profile` để kiểm tra tính hợp lệ của HttpOnly Cookie ngay khi ứng dụng vừa mount.
  3. Cấu hình tham số `credentials: 'include'` cho toàn bộ các yêu cầu gọi HTTP bằng Axios/Fetch để trình duyệt tự động gửi kèm cookie.

---

## 2. Lỗi Runtime `ReferenceError: useEffect is not defined`

* **Triệu chứng (Symptom):** Trang Login bị màn hình trắng xóa hoàn toàn và xuất hiện lỗi runtime màu đỏ trong console: `ReferenceError: useEffect is not defined`.
* **Nguyên nhân (Root Cause):** Sử dụng React Hook `useEffect` để xử lý các logic phụ trợ nhưng quên không khai báo import từ thư viện `react` ở đầu file.
* **Giải pháp khắc phục (Solution):** Bổ sung dòng code khai báo chính xác ở đầu file trang Login:
  ```typescript
  import { useEffect } from 'react';
  ```

---

## 3. Lỗi Bất Đồng Bộ Hydration (Hydration Mismatch)

* **Triệu chứng (Symptom):** Console của trình duyệt liên tục ném ra các cảnh báo (Warnings) màu đỏ: *"Hydration failed because the initial UI does not match what was rendered on the server"*.
* **Nguyên nhân (Root Cause):**
  * Next.js Server Side Rendering (SSR) tạo ra HTML tĩnh ban đầu dựa trên trạng thái server, nhưng khi xuống trình duyệt (Client), React chạy lại code và tạo ra cây DOM khác.
  * Nguyên nhân là do sử dụng các biến động (như `Date.now()`, `Math.random()`) hoặc cố gắng đọc các thuộc tính của đối tượng `window` / `document` trực tiếp trong luồng render chính trước khi component được mount hoàn toàn ở Client.
* **Giải pháp khắc phục (Solution):**
  1. Thêm thuộc tính `suppressHydrationWarning` trên các thẻ cha gốc như `<html>` và `<body>` trong tệp `layout.tsx`.
  2. Đảm bảo toàn bộ các logic kiểm tra kích thước màn hình hoặc thông tin trình duyệt chỉ chạy bên trong block `useEffect` (sau khi component đã mount lên client).

---

## 4. Mẹo Vận Hành & Gỡ Lỗi Nhanh (Operational Tips)

Khi gặp các sự cố không rõ nguyên nhân liên quan đến quyền truy cập hoặc mất session của trang Admin:
* Hãy nhấn **F12** mở **Browser Console** để xem các bản ghi bắt đầu bằng tiền tố `[Auth]` được in ra từ `AuthContext.tsx`. Các log này sẽ ghi lại chi tiết các bước bắt tay (handshake) và mã lỗi HTTP trả về từ API Backend.
