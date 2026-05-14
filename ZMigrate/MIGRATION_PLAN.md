# MIGRATION_PLAN: Decoupling Monorepo to Multi-Repo

Tài liệu này ghi lại toàn bộ quá trình tách dự án Portfolio từ Monorepo (pnpm workspaces) sang 2 Repository riêng biệt trên GitLab cho Backend và Frontend.

---

## [Phase 1] Phân tích chi tiết (Analysis)

### 1.1. Các thành phần hiện tại
- **Backend (NestJS):** Nằm tại `/backend`. Phụ thuộc vào `@portfolio/contracts` (để validation) và `@portfolio/types`.
- **Frontend (Next.js):** Nằm tại `/frontend`. Phụ thuộc vào `@portfolio/types` (để định nghĩa dữ liệu).
- **Shared (Packages):** Nằm tại `/packages`. Chứa logic chung về kiểu dữ liệu.
- **DevOps:** Sử dụng Dockerfile dùng chung cấu trúc workspace root.

### 1.2. Ràng buộc cần phá vỡ
- **Build-time dependency:** `pnpm-workspace.yaml` và cơ chế link của pnpm.
- **Code dependency:** Các câu lệnh `import ... from '@portfolio/types'`.

### 1.3. Đánh giá rủi ro
- **Mất đồng bộ Type:** Nếu Backend thay đổi API mà Frontend không hay biết. -> Giải pháp: Tự động hóa qua Swagger.
- **Lỗi Docker Build:** Do thiếu thư mục `packages`. -> Giải pháp: Multi-stage build độc lập.

---

## [Phase 2] Cấu trúc đề xuất (Proposed Structure)

### 2.1. Repository: `portfolio-backend`
- **Vị trí:** Gốc repo là thư mục `backend/` cũ.
- **Thư mục `shared/`:** Chứa `contracts` và `types` (copy từ `/packages`).
- **Nhiệm vụ:** Cung cấp API và Spec (Swagger).

### 2.2. Repository: `portfolio-frontend`
- **Vị trí:** Gốc repo là thư mục `frontend/` cũ.
- **Thư mục `src/api-generated/`:** Chứa code được sinh ra từ Swagger.
- **Nhiệm vụ:** Hiển thị giao diện, không giữ mã nguồn shared.

---

## [Phase 3] Kế hoạch thực hiện chi tiết (Milestones)

### Milestone 1: Chuẩn bị Backend (Source of Truth)
- [x] 1.1. Tạo cấu trúc thư mục mới cho Backend.
- [x] 1.2. Chuyển `packages/` vào `backend/shared/`.
- [x] 1.3. Cập nhật `package.json` của Backend để trỏ local vào `shared/`.
- [x] 1.4. Kiểm tra Backend chạy OK và Swagger xuất được JSON.
- [x] 1.5. Viết Dockerfile mới cho Backend.
- [x] 1.6. Tối ưu Swagger Metadata (Bổ sung ApiResponse & ApiProperty).

### Milestone 2: Chuẩn bị Frontend (Consumer)
- [x] 2.1. Tạo cấu trúc thư mục mới cho Frontend.
- [x] 2.2. Xóa bỏ các tham chiếu workspace.
- [x] 2.3. Cài đặt `openapi-typescript` generator.
- [x] 2.4. Refactor Frontend Modules
  - [x] Integrate `openapi-typescript` for automated type generation
  - [x] Create type bridge in `frontend/src/types/index.ts`
  - [x] Replace all `@portfolio/types` imports with `@/types`
  - [x] Verify API contract-first flow
- [x] 2.5. Docker & Infrastructure Separation
  - [x] Create standalone `Dockerfile` for Frontend
  - [x] Update Backend `Dockerfile` (already largely decoupled)
  - [x] Split Kubernetes manifests into separate folders

### Milestone 3: Tách biệt DevOps & CI/CD
- [x] 3.1. Viết `.gitlab-ci.yml` cho Backend (Build & Push).
- [x] 3.2. Viết `.gitlab-ci.yml` cho Frontend (Fetch Swagger -> Gen -> Build & Push).
- [x] 3.3. Tách file K8s YAML vào từng thư mục dự án (`backend/k8s`, `frontend/k8s`).
---

## [Phase 3.5] Hạ tầng & Luồng CI/CD (Infrastructure & Flow)

### Hạ tầng thực tế:
- **Dev (Local Windows):** Viết code, chạy thử Native để test logic.
- **Ansible Node (192.168.157.50):** Control Plane điều khiển hạ tầng.
- **K8s Staging (192.168.157.110):** Môi trường Test nội bộ.
- **K8s Prod (VPS):** Môi trường Production, cài đặt **GitLab Runner (Agent 2)** bên trong K8s.
- **Build Agent (192.168.157.109):** **GitLab Runner (Agent 1)** chuyên build image và push lên GitLab Registry.

### Luồng hoạt động (Trigger by Tag `v*`):
1. **Bước 1: Push Code & Tag:** Git push tag (ví dụ `v1.0.1`) lên GitLab.
2. **Bước 2: Đóng gói (Agent 1):** Runner tại `.109` build Docker image, push lên Registry, sau đó chạy `docker image prune -f`.
3. **Bước 3: Kiểm thử (Staging):** Tự động deploy lên cụm K8s Staging (`.110`) để kiểm tra.
4. **Bước 4: Triển khai (Prod):** Manual Approve trên GitLab -> **Agent 2** (trong VPS K8s) chạy `kubectl set image`. VPS tự pull image qua cổng 443 (Zero Inbound).

---

## [Phase 4] Thực hiện (Execution Log)

### Trạng thái hiện tại: [HOÀN THÀNH MILESTONE 3]
- Milestone 1 & 2: **HOÀN THÀNH**. Hệ thống đã ổn định ở mức local.
- Milestone 3: **HOÀN THÀNH**.
  - Đã viết `.gitlab-ci.yml` cho cả 2 repo với cơ chế sync Swagger linh hoạt.
  - Đã tách biệt K8s Manifests vào từng repo.
  - Đã chuẩn bị sẵn sàng cho việc tách repository vật lý.

---

## [Phase 5] Tách Repository Vật lý (Repo Split)

- [ ] 5.1. Khởi tạo 2 repo trống trên GitLab: `portfolio-backend` và `portfolio-frontend`.
- [x] 5.2. Chuyển nội dung thư mục `backend/` thành gốc của repo backend mới.
- [x] 5.3. Chuyển nội dung thư mục `frontend/` thành gốc của repo frontend mới.
- [ ] 5.4. Cấu hình CI/CD Variables (`BACKEND_SWAGGER_URL`, `CI_REGISTRY`, v.v.) trên GitLab.
- [ ] 5.5. Kiểm tra build thành công từ 2 repo độc lập.

---
*Ghi chú: File này sẽ được cập nhật liên tục sau mỗi bước thực hiện thành công.*
