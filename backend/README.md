# Portfolio Backend (Decoupled)

Hệ thống Backend cho dự án Portfolio, được xây dựng bằng NestJS và Prisma.

## 🚀 Tính năng chính
- **Clean Architecture:** Phân tách rõ ràng giữa Domain, Application và Infrastructure.
- **Contract-First:** Sử dụng `@portfolio/contracts` để định nghĩa API Schema chung cho cả Backend và Frontend.
- **Swagger Integration:** Tự động sinh tài liệu API và cung cấp JSON Spec cho Frontend.
- **Multi-Repo Ready:** Có Dockerfile độc lập và CI/CD Pipeline.

## 🛠 Cấu trúc thư mục
- `src/`: Mã nguồn chính của NestJS.
- `shared/packages/contracts/`: Định nghĩa API DTOs và Entities (Source of Truth).
- `shared/packages/types/`: Các kiểu dữ liệu bổ trợ.
- `prisma/`: Schema và Migrations của database.
- `k8s/`: Các manifest triển khai trên Kubernetes.

## 📦 Cài đặt & Chạy Local

1. **Cài đặt dependencies:**
   ```bash
   pnpm install
   ```

2. **Chạy Prisma Generate:**
   ```bash
   npx prisma generate
   ```

3. **Chạy ở chế độ Development:**
   ```bash
   pnpm run start:dev
   ```

## 📜 Quy trình Sync Type với Frontend
Mỗi khi thay đổi DTO hoặc Entity trong `shared/packages/contracts`:
1. Chạy `pnpm build` trong thư mục `shared/packages/contracts`.
2. Chạy `pnpm run swagger:export` ở thư mục gốc backend để cập nhật `swagger-spec.json`.
3. Frontend sẽ tự động nhận diện thay đổi qua CI/CD hoặc chạy `pnpm run api:sync` thủ công.

## 🐳 Docker & CI/CD
- **Dockerfile:** Sử dụng multi-stage build để tối ưu dung lượng image.
- **CI/CD:** Cấu hình qua `.gitlab-ci.yml`, tự động build và push image lên GitLab Registry.
