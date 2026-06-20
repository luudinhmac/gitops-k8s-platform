# 🎯 Project Mission & Overview

## 1. Project Mission
Dự án là một hệ thống **Portfolio kết hợp Blog chuyên nghiệp**, được thiết kế đặc biệt cho Kỹ sư Hệ thống (System Engineer) và các nhà phát triển. Hệ thống tập trung vào việc chia sẻ kiến thức chuyên môn sâu rộng (Blog) và trình bày năng lực thiết kế/vận hành hạ tầng (Portfolio) để phục vụ cho cả người dùng thông thường, các nhà tuyển dụng và cộng đồng kỹ thuật.

Triết lý cốt lõi của dự án là **"Đơn giản hóa trải nghiệm, tối ưu hóa hạ tầng"**, ứng dụng mô hình phát triển phần mềm hiện đại và các kỹ thuật vận hành tự động hóa (GitOps) chuẩn doanh nghiệp.

---

## 2. Core Features (Tính năng chính)

### 2.1. Blog & Content Management
* **Blog-First Design:** Trang chủ hiển thị danh sách các bài viết kỹ thuật trực quan, tối ưu hóa khả năng đọc.
* **Advanced Search:** Tìm kiếm thời gian thực (debounced), hỗ trợ tìm kiếm chéo linh hoạt giữa Tags, Categories và Series.
* **Rich Content:** Hỗ trợ bài viết dưới dạng chuỗi liên kết (Series), phân loại (Categories) và gắn thẻ (Tags).
* **Word/Docx Import:** Tích hợp bộ chuyển đổi và soạn thảo nội dung phong phú từ file Microsoft Word `.docx`.

### 2.2. User & Permission Management (RBAC)
* **Phân quyền người dùng:** Cơ chế phân quyền chi tiết cho Superadmin, Admin, Editor và User thông thường.
* **Account Controls:** Khả năng khóa tài khoản, cấm bình luận hoặc chặn đăng bài trực tiếp từ Admin Dashboard.
* **Profile Management:** Quản lý thông tin cá nhân, cập nhật avatar và lưu trữ lịch sử tương tác.

### 2.3. Maintenance Mode (Chế độ bảo trì thông minh)
* **Granular Control:** Cho phép kích hoạt bảo trì toàn hệ thống (Global) hoặc theo từng tính năng cụ thể (chỉ khóa viết bài, chỉ khóa bình luận).
* **Lối vào bí mật (Passcode Bypass):** Cho phép quản trị viên nhập passcode bí mật để truy cập và kiểm thử các tính năng ngay cả khi hệ thống đang ở trạng thái bảo trì.

### 2.4. Interaction & Notification System
* **Real-time Notifications:** Hệ thống thông báo thông minh về bình luận mới, phản hồi bình luận và các tin nhắn cảnh báo hệ thống.
* **Engagement:** Cho phép Like bài viết và hệ thống bình luận lồng nhau đa tầng (Nested Comments).

### 2.5. SEO & Legal Compliance
* **SEO Optimized:** Tự động tạo sitemap động, quản lý robots.txt và tối ưu hóa metadata động (title, description, open-graph) cho từng trang nội dung và bài viết.
* **Tuân thủ pháp lý:** Thiết lập các trang Điều khoản sử dụng (Terms) và Chính sách bảo mật (Privacy Policy) tuân thủ chặt chẽ theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân tại Việt Nam.

---

## 3. Technology Stack (Ngăn xếp công nghệ)

### 3.1. Frontend
* **Core Framework:** Next.js 16 (App Router) & React 19.
* **Styling:** Tailwind CSS 4 kết hợp PostCSS.
* **Animations:** Framer Motion (hiệu ứng mượt mà, tải nhẹ).
* **State Management:** React Context API & Hooks kết hợp Zustand.
* **HTTP Client:** Axios với interceptors tự động bắt và xử lý lỗi xác thực.
* **Third-party Libraries:** Lucide React (Icons), SWR (Server State management), Mammoth (import .docx).

### 3.2. Backend
* **Core Framework:** NestJS (nền tảng Express).
* **ORM:** Prisma Client.
* **Database:** PostgreSQL (StatefulSet) & Redis (Standalone cache).
* **Authentication:** JWT (JSON Web Token) với Passport.js và HttpOnly Cookies.
* **Security & Hardening:** Helmet (bảo mật HTTP headers), Class-validator (kiểm tra kiểu dữ liệu), Sanitize-html (lọc mã độc XSS).
* **Storage Integration:** MinIO SDK kết nối Cloudflare R2 Object Storage.
* **Media Processing:** Sharp (tự động nén và xử lý định dạng ảnh tải lên).

### 3.3. Infrastructure & DevOps (GitOps)
* **Containerization:** Docker multi-stage builds.
* **Orchestration:** Kubernetes (K8s) cluster.
* **GitOps Operator:** ArgoCD tự động đồng bộ hóa trạng thái hạ tầng từ Git.
* **Networking & Ingress:** Traefik Ingress Controller kết hợp Cloudflare Tunnel và Cilium CNI (eBPF-based).
* **Backup:** Velero (sao lưu lên Cloudflare R2) & etcd snapshot cronjobs.
* **Monitoring:** Prometheus & Grafana (kube-prometheus-stack).
* **Secrets Management:** Bitnami Sealed Secrets (Secrets-as-Code).
