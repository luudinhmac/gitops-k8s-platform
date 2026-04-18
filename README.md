# LƯU ĐÌNH MÁC | Fullstack Portfolio & Blog System

## Overview
Dự án Portfolio + Blog chuyên nghiệp dành cho Kỹ sư Hệ thống (System Engineer) để trình diễn các kỹ năng hạ tầng, dự án ảo hóa và chia sẻ kiến thức chuyên môn qua các bài viết kỹ thuật.

## Tech Stack
- **Frontend:** Next.js (App Router)
- **Backend:** NestJS
- **Database:** PostgreSQL (Native on Local/VM)
- **DevOps:**
  - Docker & Docker Compose
  - Ansible (Automation)
  - Nginx (Reverse Proxy)

## Features
- **Blog-First Architecture:** Hệ thống được cấu trúc với Blog là trang chủ (`/`) để tối ưu việc chia sẻ kiến thức, trong khi các phần Portfolio, Giới thiệu, Dự án được quy hoạch gọn gàng trong mục `/about`.
- **Legal Compliance:** Đã tích hợp trang **Quyền riêng tư** và **Điều khoản sử dụng** theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam.
- **Settings Module:** Bảng điều khiển quản lý toàn bộ thiết lập hệ thống động trên Dashboard, chia thành cấu hình Giao diện, SEO, cũng như giám sát an toàn Môi trường Hệ thống.
- **Advanced Search:** Tính năng tìm kiếm Real-time (debounced), tìm kiếm chéo tag, category, series không phân biệt chữ hoa chữ thường.
- **Blue/Sky UI Identity:** Giao diện được tối ưu hóa đồng nhất bằng tông màu Xanh chuyên nghiệp, với bảng thiết kế tinh gọn cho trải nghiệm Dev/Tech content.
- **Authentication:** Quy trình xác thực JWT bền vững với HttpOnly Cookies, tự động khôi phục phiên bản hồ sơ người dùng đầy đủ.

## Project Structure
```text
frontend/      # Next.js Application
backend/       # NestJS API (Prisma + PostgreSQL)
ansible/       # Ansible Playbooks & Inventory
docs/          # Technical Documentation & Debug Logs
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

## Environment Variables
Sử dụng các tệp `.env.example` được cung cấp trong từng thư mục làm mẫu.

**Backend:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DATABASE_URL`
- `JWT_SECRET`
- `ALLOWED_ORIGINS`

**Frontend:**
- `NEXT_PUBLIC_API_URL`

## Git Workflow
Hệ thống tuân thủ quy trình làm việc chuyên nghiệp:
- `feature/*` → `development`: Phát triển tính năng mới.
- `dev` → `staging`: Kiểm thừ trên VM (Cổng 8000).
- `main` → `production`: Vận hành chính thức (Cổng 80/443).

## Deployment

Dự án sử dụng hệ thống tự động hóa **Ansible Roles** để quản lý hạ tầng và triển khai đa môi trường một cách chuyên nghiệp.

### 1. Hạ tầng (Infrastructure)
Hệ thống tự động thiết lập các thành phần sau trên VM Linux:
- **Docker & Docker Compose**: Nền tảng vận hành container.
- **MariaDB (Native)**: Cơ sở dữ liệu chính cho toàn bộ hệ thống.
- **Nginx (Reverse Proxy)**: Cài đặt Native để điều phối và bảo mật các luồng truy cập.

### 2. Môi trường triển khai (Environments)
Mã nguồn và dữ liệu được lưu trữ tập trung tại phân vùng **/data**:
- **Production**: Triển khai tại `/data/prod` (Nginx Cổng 80).
- **Development**: Triển khai tại `/data/dev` (Nginx Cổng 8000).

### 3. Cách vận hành Ansible
Cấu hình IP máy chủ tại `ansible/hosts`, sau đó chạy các lệnh sau:

**Thiết lập toàn bộ hạ tầng (Chỉ chạy lần đầu):**
```bash
ansible-playbook -i ansible/hosts ansible/site.yml --tags infra
```

**Triển khai ứng dụng (Khi có cập nhật mã nguồn):**
```bash
ansible-playbook -i ansible/hosts ansible/site.yml --tags deploy
```

**Triển khai riêng cho từng môi trường:**
```bash
# Chỉ triển khai cho Production
ansible-playbook -i ansible/hosts ansible/site.yml --limit prod --tags deploy

# Chỉ triển khai cho Development
ansible-playbook -i ansible/hosts ansible/site.yml --limit dev --tags deploy
```

### 4. Cấu hình SSL (HTTPS)
Dự án tích hợp sẵn **Certbot** để cấp phát chứng chỉ Let's Encrypt tự động.

**Các bước kích hoạt:**
1. Trỏ Domain của bạn về IP của máy chủ VM.
2. Cập nhật các biến trong `ansible/group_vars/all.yml`:
   ```yaml
   enable_ssl: true
   domain_name: "yourdomain.com"
   cert_email: "luumac2801@gmail.com"
   ```
3. Chạy Playbook cấu hình Nginx:
   ```bash
   ansible-playbook -i ansible/hosts ansible/site.yml --tags nginx
   ```

Hệ thống sẽ tự động yêu cầu chứng chỉ, cấu hình cổng 443 và thiết lập Redirect từ HTTP sang HTTPS.

---

## DevOps Architecture
**Quy trình:** Laptop → GitHub → Ansible Controller → VM (Native DB & Docker Apps)

Thiết kế này tối ưu hóa hiệu năng bằng cách chạy Database Native trực tiếp trên OS và đóng gói ứng dụng trong Docker để dễ dàng quản lý phiên bản và môi trường.

## Security Notes
- Luôn sử dụng biến môi trường cho các thông tin nhạy cảm.
- Cookie định danh được cấu hình `httpOnly` và `SameSite: Lax`.
- Chỉ cho phép các domain được định nghĩa trong `ALLOWED_ORIGINS` truy cập API.


# Database & Seeding
npx prisma db push
npx ts-node seed_admin.ts

# Git Sync
git add .
git commit -m "feat(core): migrate to PostgreSQL and restructure routing"
git push origin dev
git checkout main
git merge dev
git push origin main
git checkout dev


## Author
**LƯU ĐÌNH MÁC** - System Engineer & Linux Expert.
