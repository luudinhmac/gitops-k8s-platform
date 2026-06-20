# ADR 0001: Clean Architecture Domain Isolation Refactoring

* **Status:** Accepted
* **Date:** 2026-06-17
* **Author:** Lead Solutions Architect

---

## Context (Bối cảnh)

Trong quá trình đánh giá và kiểm thử hạ tầng/mã nguồn của hệ thống Backend (NestJS), chúng tôi phát hiện cấu trúc thiết kế của mô-đun Bài viết (`Posts Module`) gặp phải các lỗi vi phạm nghiêm trọng về mặt kiến trúc (Architectural Violations):

1. **Prisma Leakage in Service Layer (Rò rỉ ORM ở lớp nghiệp vụ):**
   Lớp dịch vụ `PostsService` tự xây dựng trực tiếp các đối tượng truy vấn raw Prisma (như `where`, `select`, `orderBy`) và các logic tìm kiếm đặc thù của Prisma (`{ contains: query, mode: 'insensitive' }`).
2. **Repository Pattern Violation (Vi phạm mẫu Repository):**
   Lớp `PostsRepository` chỉ đóng vai trò là một lớp bao bọc hời hợt (pass-through wrapper), chuyển tiếp trực tiếp các phương thức của Prisma (`findMany`, `count`) lên Service mà không cung cấp sự trừu tượng hóa nào.
3. **DTO Duplication (Trùng lặp DTO):**
   DTO tạo bài viết (`create-post.dto.ts`) bị trùng lặp cấu trúc với các contract chia sẻ (`packages/contracts/src/posts.ts`).
4. **Coupled Dependency Flow (Liên kết phụ thuộc chặt chẽ):**
   Lớp nghiệp vụ phụ thuộc trực tiếp vào database schema. Mọi thay đổi trong Prisma Schema sẽ kéo theo thay đổi trực tiếp ở lớp Service.

---

## Decision (Quyết định)

Chúng tôi quyết định thực hiện tái cấu trúc (refactoring) để cô lập miền nghiệp vụ (**Domain Isolation**), tuân thủ triết lý Kiến trúc sạch (Clean Architecture):

1. **Tách biệt Entity miền nghiệp vụ:**
   Tạo thực thể domain độc lập `post.entity.ts` và định nghĩa kiểu dữ liệu `post.types.ts` để phân tách hoàn toàn dữ liệu nghiệp vụ khỏi Prisma Models.
2. **Trừu tượng hóa Repository:**
   Repository sẽ đảm nhận nhiệm vụ chuyển đổi qua lại giữa Prisma Models và Domain Entities. Lớp Service sẽ chỉ giao tiếp với Repository thông qua các thực thể Domain sạch.
3. **Đồng bộ hóa Contract DTO:**
   Xóa bỏ DTO trùng lặp và liên kết trực tiếp tới các DTO chuẩn hóa từ packages contract dùng chung.

---

## Consequences (Hệ quả)

### Tích cực:
* **Decoupled Business Logic:** Lớp Service hoàn toàn sạch bóng các câu lệnh truy vấn ORM. Có thể dễ dàng thay đổi ORM (ví dụ từ Prisma sang TypeORM hoặc Mongoose) mà không cần sửa đổi logic nghiệp vụ trong Service.
* **Schema Safety:** Thay đổi cấu trúc bảng cơ sở dữ liệu chỉ cần cập nhật ở lớp Repository mapper, giảm thiểu rủi ro lỗi lan truyền.
* **Reusability:** Sử dụng DTO từ contract chung giúp đồng bộ chặt chẽ kiểu dữ liệu giữa Frontend và Backend.

### Hạn chế:
* Tăng số lượng file cần quản lý (Entities, Mappers, Interfaces).
* Tăng thời gian viết code ban đầu do phải định nghĩa mapper chuyển đổi kiểu dữ liệu.

---

## Detailed Implementation Phases

### Phase 0: Phân tích & Phát hiện vi phạm
* **Lớp Service:** Rò rỉ Prisma tại `PostsService.findAll` (dòng 81-152).
* **Lớp Repository:** Nhận kiểu generic `Record<string, any>`, ép lớp Service phải tự xử lý Prisma queries.
* **Các file bị ảnh hưởng:**
  * `[MODIFY]` `posts.service.ts`
  * `[MODIFY]` `posts.repository.ts`
  * `[DELETE]` `create-post.dto.ts`

### Phase 1: Domain Isolation (Cô lập miền nghiệp vụ)
Đã triển khai định nghĩa domain thực thể sạch, độc lập với framework NestJS và ORM:
* `[NEW]` [post.entity.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/domain/post.entity.ts)
* `[NEW]` [post.types.ts](file:///d:/DATA/Portfolio/backend/src/modules/posts/domain/post.types.ts)
