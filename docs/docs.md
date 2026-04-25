# Portfolio & Blog System - Technical Documentation

## 1. Project Overview
Dự án là một hệ thống Portfolio kết hợp Blog chuyên nghiệp, được thiết kế đặc biệt cho Kỹ sư Hệ thống (System Engineer). Hệ thống tập trung vào việc chia sẻ kiến thức kỹ thuật (Blog) và trình diễn năng lực hạ tầng (Portfolio).

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router) & React 19.
- **Styling:** Tailwind CSS 4 (Sử dụng `@tailwindcss/postcss`).
- **Animations:** Framer Motion.
- **Icons:** Lucide React.
- **State Management:** React Context API & Hooks.
- **HTTP Client:** Axios.
- **Rich Text Editor:** React Quill New.
- **Document Processing:** Mammoth (Hỗ trợ import nội dung từ file `.docx`).
- **Theme:** Next Themes (Hỗ trợ Dark/Light/System mode).

### Backend
- **Framework:** NestJS.
- **ORM:** Prisma.
- **Database:** PostgreSQL.
- **Authentication:** JWT (JSON Web Token) với Passport.js.
- **Validation:** class-validator & class-transformer.
- **File Handling:** Multer & Sharp (Tối ưu hóa hình ảnh).
- **Email:** Nodemailer.
- **API Documentation:** Swagger (@nestjs/swagger).
- **Security:** sanitize-html, cookie-parser, CORS.

### DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose.
- **Automation:** Ansible (Roles & Playbooks).
- **Web Server:** Nginx (Reverse Proxy & SSL Management).
- **SSL:** Certbot (Let's Encrypt).
- **Monitoring:** System environment monitor (tích hợp trong Admin Dashboard).

## 3. Core Features

### 3.1. Blog & Content Management
- **Blog-First:** Trang chủ hiển thị danh sách bài viết kỹ thuật.
- **Advanced Search:** Tìm kiếm thời gian thực (debounced), hỗ trợ tìm kiếm chéo giữa Tags, Categories và Series.
- **Rich Content:** Hỗ trợ bài viết dưới dạng chuỗi (Series), phân loại (Categories) và gắn thẻ (Tags).
- **Editor:** Trình soạn thảo văn bản phong phú với khả năng import từ file Word.

### 3.2. User & Permission Management
- **Role-Based Access Control (RBAC):** Phân quyền Superadmin, Admin, Editor và User.
- **Account Controls:** Khả năng khóa tài khoản, cấm bình luận hoặc cấm đăng bài trực tiếp từ Dashboard.
- **Profile:** Quản lý thông tin cá nhân, ảnh đại diện và lịch sử tương tác.

### 3.3. Maintenance Mode (Hệ thống bảo trì)
- **Granular Control:** Có thể bật bảo trì toàn trang (Global) hoặc theo từng chức năng (Posts, Comments).
- **Hidden Door:** Lối vào bí mật dành cho Admin thông qua Passcode để truy cập quản trị ngay cả khi đang bảo trì.
- **Implementation:** Sử dụng Middleware/Proxy tại Frontend để kiểm tra trạng thái từ Backend Settings.

### 3.4. Interaction & Notifications
- **Real-time Notifications:** Thông báo về bình luận, phản hồi và tin nhắn hệ thống với huy hiệu thông minh.
- **Engagement:** Hệ thống Like bài viết và bình luận lồng nhau (Nested Comments).

### 3.5. SEO & Legal
- **SEO Optimized:** Tự động tạo Sitemap, Robots.txt và Metadata động cho từng bài viết.
- **Legal Compliance:** Đã tích hợp các trang Điều khoản (Terms) và Quyền riêng tư (Privacy) theo Nghị định 13/2023/NĐ-CP.

## 4. Architecture & Context

### 4.1. Monorepo Structure
Dự án được tổ chức theo cấu trúc Monorepo sử dụng `pnpm workspaces`:
- `frontend/`: Ứng dụng Next.js.
- `backend/`: API NestJS.
- `ansible/`: Hạ tầng và triển khai.

### 4.2. Deployment Flow
1. **Local Development:** Chạy native bằng Node.js và PostgreSQL (không Docker).
2. **Staging/Production:** 
   - Sử dụng Ansible để đồng bộ mã nguồn lên VM/VPS.
   - Toàn bộ các dịch vụ (**Frontend, Backend, Database, Nginx**) đều chạy trong Docker container.
   - Nginx đóng vai trò Reverse Proxy và quản lý SSL tập trung ngay trong Docker network.

### 4.3. Refactoring Notes (Context)
- **Unified Containerization:** Nginx đã được chuyển hoàn toàn sang Docker, giúp môi trường Staging và Production nhất quán 100% về cấu trúc hạ tầng.
- **SSL Strategy:** 
    - **Staging:** Sử dụng chứng chỉ tự ký (Self-signed) sinh ra tự động để phục vụ kiểm thử nội bộ.
    - **Production:** Sử dụng Let's Encrypt với hệ thống tự động gia hạn (Cron job) hàng tháng.
- **Environment Driven:** Mọi thông tin nhạy cảm (mật khẩu, IP, SSH Key) không còn lưu trong code mà được nạp từ biến môi trường của node Ansible.

## 5. Deployment Setup

### 5.1. Yêu cầu biến môi trường
Trước khi triển khai, cần chuẩn bị file `.env.ansible` (dựa trên mẫu `.env.ansible.example`) chứa các thông tin:
- `PROD_IP`, `PROD_USER`, `PROD_SSH_KEY_PATH`: Thông tin kết nối VPS.
- `PROD_DB_PASSWORD`, `PROD_DOMAIN`: Cấu hình ứng dụng production.
- `STAGING_IP`, `STAGING_DB_PASSWORD`: Cấu hình cho môi trường staging.

### 5.2. Lệnh thực thi
```bash
# Load biến môi trường
export $(cat .env.ansible | xargs)

# Triển khai Production
ansible-playbook -i inventory.ini playbooks/production.yml

# Triển khai Staging
ansible-playbook -i inventory.ini playbooks/staging.yml
```

## 6. Development Guidelines
- Luôn tuân thủ quy trình Git (`feature/*` -> `dev` -> `staging` -> `main`).
- Biến môi trường nhạy cảm phải được đặt trong `.env` hoặc `.env.ansible` và không commit lên Git.
- Mọi API mới cần được khai báo trong Swagger.
- Chú thích mã nguồn (Comments) trong hệ thống Ansible phải được viết bằng tiếng Anh để đảm bảo tính chuyên nghiệp và dễ đọc cho đội ngũ kỹ thuật.
