# LƯU ĐÌNH MÁC | Fullstack Portfolio & Blog System

## Overview
Dự án Portfolio + Blog chuyên nghiệp dành cho Kỹ sư Hệ thống (System Engineer) để trình diễn các kỹ năng hạ tầng, dự án ảo hóa và chia sẻ kiến thức chuyên môn qua các bài viết kỹ thuật.

## Tech Stack
- **Frontend:** Next.js (App Router)
- **Backend:** NestJS
- **Database:** PostgreSQL (Dockerized)
- **DevOps:**
  - Docker & Docker Compose (Containerization: Apps, DB, Nginx)
  - Kubernetes (Production Orchestration: Single-node kubeadm)
  - Ansible (Automated Roles-based Infrastructure & App Deployment)
  - Nginx (Unified Reverse Proxy & SSL Gateway)

## Features
- **Blog-First Architecture:** Hệ thống được cấu trúc với Blog là trang chủ (`/`) để tối ưu việc chia sẻ kiến thức, trong khi các phần Portfolio, Giới thiệu, Dự án được quy hoạch gọn gàng trong mục `/about`.
- **Legal Compliance:** Đã tích hợp trang **Quyền riêng tư** và **Điều khoản sử dụng** theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam.
- **Settings Module:** Bảng điều khiển quản lý toàn bộ thiết lập hệ thống động trên Dashboard, chia thành cấu hình Giao diện, SEO, cũng như giám sát an toàn Môi trường Hệ thống.
- **Advanced Search:** Tính năng tìm kiếm Real-time (debounced), tìm kiếm chéo tag, category, series không phân biệt chữ hoa chữ thường.
- **Blue/Sky UI Identity:** Giao diện được tối ưu hóa đồng nhất bằng tông màu Xanh chuyên nghiệp, với bảng thiết kế tinh gọn cho trải nghiệm Dev/Tech content.
- **Authentication:** Quy trình xác thực JWT bền vững với HttpOnly Cookies, tự động khôi phục phiên bản hồ sơ người dùng đầy đủ.
- **Advanced User Management:** Quản trị viên (Admin & Superadmin) có thể kiểm soát chi tiết quyền hạn của từng người dùng thông qua Settings Box: cấm đăng nhập (Khóa tài khoản), cấm bình luận, cấm đăng bài, và thay đổi vai trò trực quan. Tài khoản **Superadmin** có quyền hạn tối cao, quản lý được cả các tài khoản Admin khác.
- **Maintenance Mode:** Hệ thống bảo trì phân mảnh (Global, Posts, Comments) cho phép khóa toàn bộ website hoặc từng chức năng cụ thể. Tích hợp "Cửa bí mật" (Hidden Door) với Passcode xác thực dành riêng cho Quản trị viên để truy cập quản trị trong lúc bảo trì.
- **Notification System:** Hệ thống thông báo thời hạn thực với huy hiệu (badges) thông minh trên Navbar. Thông báo cho người dùng về các tương tác (bình luận, trả lời) và các sự kiện hệ thống quan trọng.
- **Security-First API:** Tài liệu Swagger được bảo vệ theo môi trường và giới hạn IP. Các thông tin nhạy cảm (pass hash) được lọc bỏ hoàn toàn khỏi các phản hồi API.

## Project Structure
```text
frontend/      # Next.js Application (Build Once, Run Anywhere)
backend/       # NestJS API (Stateless, DB Retry Logic)
ansible/       # Ansible Roles & Automation
docs/          # Technical Documentation & Deployment Reports
```

## Local Development
**Yêu cầu:** Node.js (LTS), PostgreSQL.
**Lưu ý:** Tuyệt đối KHÔNG sử dụng Docker cho môi trường Local theo quy tắc dự án.

1. **Cài đặt:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
2. **Khởi chạy:**
   ```bash
   # Terminal 1 (Frontend)
   npm run dev
   # Terminal 2 (Backend)
   npm run start:dev
   ```
3. **Truy cập:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Swagger Docs: http://localhost:3001/api/docs (Local only)

## Environment Variables
Sử dụng các tệp `.env.example` được cung cấp trong từng thư mục làm mẫu.

**Backend:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DATABASE_URL`
- `JWT_SECRET`, `ENABLE_SWAGGER`
- `ALLOWED_ORIGINS`

**Frontend:**
- (Không còn yêu cầu biến môi trường lúc build nhờ kiến trúc Proxy tập trung)

## Git Workflow
Hệ thống tuân thủ quy trình làm việc chuyên nghiệp:
- `feature/*` → `development`: Phát triển tính năng mới.
- `dev` → `staging`: Kiểm thử trên VM Staging.
- `main` → `production`: Vận hành chính thức.

## Deployment

Dự án hỗ trợ hai phương thức triển khai tự động hóa qua **Ansible Roles**:

### 1. Môi trường Staging (Docker Compose)
Dành cho kiểm thử nhanh trên VM đơn lẻ.
```bash
cd ansible
# Triển khai qua Docker Compose
ansible-playbook -i inventory.ini playbooks/staging.yml
```

### 2. Môi trường Production (Kubernetes)
Kiến trúc Production-Grade trên cụm Single-node K8s.
*   **Hạ tầng:** Kubeadm, Flannel CNI, Dashboard.
*   **Networking:** HostNetwork Nginx (Cổng 80/443 chuẩn), tương thích Cloudflare.
*   **Security:** Quản lý tập trung qua K8s Secrets & ConfigMaps.

**Triển khai:**
```bash
# 1. Setup Cluster (Cài đặt môi trường K8s)
ansible-playbook -i inventory.ini playbooks/k8s_setup.yml

# 2. Deploy App (Build, Sync & Run)
ansible-playbook -i inventory.ini playbooks/k8s_app_deploy.yml
```
Quy trình K8s tự động bao gồm bridge Image từ Docker sang Containerd, cấp phát SSL, và khởi tạo Secrets động (bao gồm auto-gen JWT).

---

## DevOps Architecture
**Quy trình:** Laptop → GitHub → Ansible Controller → VM (All Docker Containers)

Kiến trúc này đảm bảo tính đóng gói tuyệt đối, cho phép di chuyển ứng dụng giữa các Server một cách dễ dàng (Portability).

## Security Notes
- **API Protection:** Swagger chỉ hiển thị ở môi trường nội bộ/staging và bị chặn ở Production bởi Nginx.
- **Data Privacy:** Các trường nhạy cảm trong Cấu hình (Settings) được che giấu tự động trước khi gửi về Client.
- **Network Security:** Backend và DB không mở cổng ra internet, chỉ cho phép truy cập thông qua Nginx Proxy.



## Author
**LƯU ĐÌNH MÁC** - System Engineer & Linux Expert.
