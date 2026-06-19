# 💻 Coding Guidelines & Architecture Standards

Tài liệu này quy định các nguyên tắc thiết kế mã nguồn, quy chuẩn thư mục và tiêu chuẩn chất lượng áp dụng đồng bộ cho cả Frontend (Next.js) và Backend (NestJS).

---

## 1. Nguyên Tắc Cốt Lõi: Smart Server – Lean Client

Để tối ưu hóa hiệu năng thiết bị của người dùng, tiết kiệm băng thông và duy trì mã nguồn sạch, hệ thống tuân thủ nghiêm ngặt nguyên lý phân tách trách nhiệm:

* **Backend (Smart Server) đảm nhận:**
  * Toàn bộ logic nghiệp vụ (Business Logic).
  * Lọc (filtering), sắp xếp (sorting) và phân trang (pagination) trên các tập dữ liệu lớn.
  * Các phép tính toán nghiệp vụ hoặc tổng hợp dữ liệu nặng (ví dụ: tính toán thời gian đọc bài viết, xây dựng cấu trúc cây bình luận đa cấp).
  * Xác thực thông tin, phân quyền và đảm bảo an ninh (Security validation).
* **Frontend (Lean Client) đảm nhận:**
  * Render giao diện người dùng (UI rendering).
  * Quản lý các tương tác của người dùng (User interaction).
  * Duy trì các trạng thái UI thuần túy (`isOpen`, `isLoading`, `activeTab`).
  * Chỉ thực hiện các biến đổi dữ liệu nhỏ phục vụ hiển thị (UI-level transformations).

### 🚫 Các Anti-patterns cần tránh:
* Thực hiện lọc hoặc sắp xếp các mảng dữ liệu lớn (như danh sách bài viết) trực tiếp trên trình duyệt.
* Tự tính toán hoặc xử lý logic nghiệp vụ phức tạp ở Frontend.
* Gọi API dồn dập cho các tương tác chỉ mang tính chất UI.

---

## 2. Kiến Trúc Thư Mục Frontend (Feature-Based)

Mã nguồn Frontend được tổ chức theo **Tính năng (Features)** thay vì theo loại tệp tin nhằm đảm bảo khả năng mở rộng dễ dàng khi dự án phát triển.

### Cấu trúc thư mục chuẩn (`/frontend/src/`):
```text
src/
├── app/                      # Định nghĩa Page và Layout (Routing Next.js)
├── features/                 # Các Module tính năng độc lập
│   ├── post/                 # Ví dụ: Tính năng bài viết
│   │   ├── components/       # Các UI components chỉ dùng riêng cho post (PostCard, PostDetail)
│   │   ├── services/         # API calls và business logic của post
│   │   ├── hooks/            # Custom React Hooks riêng cho post
│   │   └── types.ts          # Các định nghĩa kiểu dữ liệu riêng
│   └── user/                 # Ví dụ: Tính năng người dùng
├── shared/                   # Tài nguyên dùng chung toàn dự án
│   ├── components/
│   │   ├── ui/               # Các Atoms components tái sử dụng (Button, Input, Badge)
│   │   └── common/           # Các Molecular components dùng chung (ErrorBoundary, Avatar)
│   ├── lib/                  # Utilities và helper functions dùng chung
│   └── constants/            # Các hằng số toàn cục (config, HTTP endpoints)
```

### Quy tắc miền (Domain Rules):
* **KHÔNG** import trực tiếp logic nội bộ (components/services/hooks) chéo giữa các thư mục `features/` với nhau.
* Nếu hai feature cần sử dụng chung một component hoặc logic, hãy di chuyển tài nguyên đó vào thư mục `shared/` hoặc kết nối thông qua lớp API/Zustand Store.

---

## 3. Quy Tắc Đường Dẫn Tuyệt Đối (Absolute Imports)

* Bắt buộc sử dụng đường dẫn tuyệt đối bắt đầu bằng ký tự `@/` để tránh lỗi đường dẫn tương đối dài dòng (`../../../../`).
* **Ví dụ tốt:**
  ```typescript
  import Button from '@/shared/components/ui/Button';
  import { useGetPost } from '@/features/post/hooks/useGetPost';
  ```
* **Ví dụ xấu:**
  ```typescript
  import Button from '../../../shared/components/ui/Button';
  ```

---

## 4. An Toàn Kiểu Dữ Liệu (Type Safety)

* **Contracts-First:** Sử dụng các định nghĩa Interface/Type dùng chung được đồng bộ từ thư viện `@portfolio/contracts` (Swagger-generated).
* **KHÔNG** tự ý định nghĩa lại các kiểu dữ liệu cốt lõi (như `User`, `Post`, `Category`, `Comment`) cục bộ tại từng trang hoặc component để tránh xung đột kiểu dữ liệu khi cập nhật DB schema.
* Luôn bọc các yêu cầu gọi API bất đồng bộ trong các block `try/catch` để xử lý ngoại lệ một cách an toàn.

---

## 5. Tiêu Chuẩn Thiết Kế API Backend

Mọi API trả về danh sách dữ liệu (List API) phải hỗ trợ đầy đủ các tham số truy vấn (Query Parameters) chuẩn hóa sau:

| Tham số | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| **`q`** | Tìm kiếm từ khóa (Search). | `?q=kubernetes` |
| **`userId`** | Lọc dữ liệu theo ID người dùng. | `?userId=12` |
| **`status`** | Lọc theo trạng thái nội dung. | `?status=published` |
| **`sort`** | Sắp xếp: `latest` (mới nhất), `views` (lượt xem), `likes` (lượt thích). | `?sort=views` |
| **`page`** | Số trang hiện tại. | `?page=1` |
| **`limit`** | Số lượng bản ghi trên một trang. | `?limit=10` |

### Định dạng phản hồi chuẩn (Response Structure):
* **Khi thành công (200 OK):**
  ```json
  {
    "data": [ ... ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 142
    }
  }
  ```
* **Khi có lỗi (Error Response):**
  ```json
  {
    "message": "Nội dung lỗi chi tiết cho client hiển thị",
    "code": "ERROR_CODE_INDEXED",
    "status": 400
  }
  ```

---

## 6. Tiêu Chuẩn UX & SEO

### Trải nghiệm người dùng (UX):
* **Trạng thái tải (Loading):** Ưu tiên sử dụng component **Skeleton** thay vì Spinner xoay truyền thống để tránh giật lag layout (layout shift).
* **Hiệu ứng chuyển cảnh:** Sử dụng Framer Motion một cách tiết chế để tăng độ mượt (micro-animations), tránh lạm dụng gây rối mắt.
* **Thông báo phản hồi:** Sử dụng Toasts/Dialogs rõ ràng khi người dùng thực hiện các thao tác quan trọng (thêm, sửa, xóa, gửi form).

### Tối ưu hóa tìm kiếm (SEO):
* **Server Components:** Bắt buộc sử dụng React Server Components cho các trang nội dung tĩnh hoặc các trang cần Google Bot lập chỉ mục (Blog, chi tiết bài viết, chi tiết dự án).
* **Metadata:** Định nghĩa đầy đủ `title`, `description` và các thẻ `openGraph` cho từng Route.
* **Semantic HTML:** Luôn viết mã HTML đúng ngữ nghĩa, sử dụng các thẻ `<article>`, `<section>`, `<nav>`, `<aside>` thay vì lạm dụng thẻ `<div>`.
