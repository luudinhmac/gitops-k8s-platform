# Project Architecture & Coding Standards

Tài liệu này quy định các quy tắc kiến trúc và tiêu chuẩn mã nguồn cho dự án Portfolio (Next.js + NestJS). Mọi tính năng mới cần tuân thủ các quy tắc này để đảm bảo hệ thống luôn sạch sẽ, dễ bảo trì và tối ưu SEO.

---

## 1. Nguyên tắc "Thin Client" (Frontend nhẹ)

Frontend chỉ đóng vai trò render giao diện và xử lý tương tác người dùng (UX). Toàn bộ logic nghiệp vụ nặng phải nằm ở Backend.

- **Quy tắc:**
    - KHÔNG lọc (filter) mảng dữ liệu lớn ở Frontend. Hãy yêu cầu Backend thực hiện qua Query Params (ví dụ: `?userId=123`).
    - KHÔNG sắp xếp (sort) dữ liệu phức tạp ở Frontend. Hãy sử dụng tham số `?sort=latest|views|likes`.
    - KHÔNG thực hiện các phép tính toán nghiệp vụ (ví dụ: tính thời gian đọc bài viết, xây dựng cây bình luận) ở Frontend. Backend phải trả về dữ liệu đã được tính toán sẵn.
    - Frontend chỉ giữ các "State UI" (ví dụ: `isOpen`, `isLoading`, `activeTab`).

---

## 2. Kiến trúc Feature-Based (Frontend)

Mã nguồn Frontend được tổ chức theo tính năng (Features) thay vì theo loại file (Components/Services/Hooks).

- **Cấu trúc thư mục:**
    - `src/features/[featureName]/components/`: Các UI components chỉ dành riêng cho tính năng đó (ví dụ: `PostCard`, `NotificationBell`).
    - `src/features/[featureName]/services/`: Các API calls và logic xử lý riêng cho tính năng đó.
    - `src/shared/components/ui/`: Các thành phần nguyên tử (Atoms) tái sử dụng toàn cục (Button, Badge, Dialog, Input...).
    - `src/shared/components/common/`: Các thành phần phức hợp dùng chung (ErrorBoundary, FormattedDate, UserAvatar...).
    - `src/app/`: Chỉ chứa các Page và Layout (Routing). Hạn chế tối đa việc viết logic UI phức tạp trực tiếp trong Page.

---

## 3. Quản lý Import & Đường dẫn

Để tránh lỗi khi di chuyển file và giúp mã nguồn dễ đọc hơn:

- **Quy tắc:**
    - Luôn sử dụng đường dẫn tuyệt đối (Absolute Alias) bắt đầu bằng `@/`.
    - **TỐT:** `import Button from '@/shared/components/ui/Button';`
    - **XẤU:** `import Button from '../../../components/ui/Button';`
    - Hạn chế sử dụng `@/components/` (cũ), hãy chuyển sang `@/features/` hoặc `@/shared/`.

---

## 4. An toàn kiểu dữ liệu (Type Safety)

- **Quy tắc:**
    - Ưu tiên sử dụng các Interface/Type dùng chung từ gói `@portfolio/contracts`.
    - KHÔNG định nghĩa lại các interface core (như `Post`, `User`, `Category`) cục bộ trong từng Page/Component để tránh xung đột kiểu dữ liệu.
    - Luôn kiểm tra kiểu dữ liệu khi gọi API (Sử dụng `async/await` với `try/catch`).

---

## 5. Tiêu chuẩn Backend API

Mỗi Endpoint danh sách (List) trong Backend cần hỗ trợ các tham số chuẩn:

- **Query Parameters:**
    - `q`: Tìm kiếm từ khóa.
    - `userId`: Lọc theo chủ sở hữu.
    - `status`: Lọc theo trạng thái (published, draft, blocked...).
    - `sort`: Sắp xếp theo `latest`, `views`, `likes`, `comments`.
    - `limit` / `page`: Phân trang.

---

## 6. Trải nghiệm người dùng (UX) & SEO

- **UX:**
    - Phải có trạng thái `loading` (Skeletons/Spinners) cho mọi tác vụ bất đồng bộ.
    - Sử dụng Framer Motion cho các hiệu ứng chuyển cảnh mượt mà.
    - Thông báo lỗi/thành công (Toasts/Dialogs) rõ ràng cho người dùng.
- **SEO:**
    - Sử dụng Server Components cho các trang nội dung để Google Bot dễ quét.
    - Luôn có Metadata (Title, Description, OpenGraph) cho từng Page.
    - Sử dụng Semantic HTML (`<article>`, `<nav>`, `<aside>...`).

---

*Tài liệu này được cập nhật lần cuối vào ngày 25/04/2026 sau đợt Refactor quy mô lớn.*
