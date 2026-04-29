# Portfolio Frontend (Decoupled)

Ứng dụng Frontend cho dự án Portfolio, được xây dựng bằng Next.js (App Router) và Tailwind CSS.

## 🚀 Tính năng chính
- **Standalone Repo:** Không còn phụ thuộc vào monorepo, build độc lập.
- **Contract-First Consumption:** Tự động sinh Type từ Swagger của Backend.
- **Modern UI:** Thiết kế Stealth UI tối giản, tối ưu cho trải nghiệm người dùng.
- **Type Safety:** 100% TypeScript với Type được đồng bộ tự động.

## 🛠 Cấu trúc thư mục
- `src/app/`: Next.js App Router (Pages & Layouts).
- `src/components/`: UI Components dùng chung.
- `src/features/`: Logic theo từng tính năng (Auth, Posts, Users...).
- `src/types/`: Chứa `api.generated.ts` (sinh từ Swagger) và type bridge.
- `k8s/`: Các manifest triển khai trên Kubernetes.

## 📦 Cài đặt & Chạy Local

1. **Cài đặt dependencies:**
   ```bash
   pnpm install
   ```

2. **Đồng bộ API Type (Cần Backend đang chạy):**
   ```bash
   pnpm run api:sync
   ```

3. **Chạy ở chế độ Development:**
   ```bash
   pnpm run dev
   ```

## 📜 Quy trình Cập nhật Type
Khi Backend có thay đổi về API Schema:
1. Đảm bảo Backend đang chạy ở local hoặc có file `swagger-spec.json` mới nhất.
2. Chạy lệnh:
   ```bash
   pnpm run api:sync
   ```
3. Kiểm tra các lỗi TypeScript (nếu có) và cập nhật code tương ứng.

## 🐳 Docker & CI/CD
- **Dockerfile:** Cấu hình multi-stage build cho Next.js Standalone mode.
- **CI/CD:** `.gitlab-ci.yml` tự động đồng bộ type và build image.
