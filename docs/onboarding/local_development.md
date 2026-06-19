# 💻 Local Development & Connectivity Guide

Tài liệu này hướng dẫn nhà phát triển mới cách cài đặt môi trường lập trình cục bộ (Local Development) và thiết lập kết nối từ xa đến cụm Kubernetes để debug hoặc đồng bộ cơ sở dữ liệu.

---

## 1. Công Cụ Cần Thiết (Prerequisites)

Hãy đảm bảo máy tính cá nhân của bạn đã cài đặt sẵn các công cụ sau:
1. **Node.js** (Phiên bản LTS từ `20.x` trở lên).
2. **pnpm** (Trình quản lý package hiệu năng cao):
   ```bash
   npm install -g pnpm
   ```
3. **kubectl** (Để tương tác trực tiếp với API Server của cụm K8s).
4. **OpenSSH Client** (Được tích hợp mặc định trong Windows 10/11 PowerShell hoặc Terminal của macOS/Linux).

---

## 2. Bản Đồ Địa Chỉ Kết Nối Hệ Thống (IP Address Cheatsheet)

Dưới đây là thông tin địa chỉ các máy chủ ảo hóa (VMs) trong hệ thống mạng:

| Tên Host / VM | Địa Chỉ IP | Cổng SSH | SSH Key Sử Dụng | Vai Trò |
| :--- | :--- | :---: | :--- | :--- |
| **`ansible-node`** | `192.168.157.50` | `22` | `~/.ssh/id_ed25519_ansible` | Node trung tâm điều khiển và chạy playbook Ansible. |
| **`build-runner`** | `192.168.157.109`| `22` | `~/.ssh/id_ed25519_ansible` | Máy chạy GitLab Runner phục vụ đóng gói CI/CD. |
| **`k8s-staging`** | `192.168.157.133`| `22` | `~/.ssh/id_ed25519_ansible` | Node chạy thử nghiệm Kubernetes Staging. |
| **`k8s-prod`** | `103.6.235.15` | `2222` | `~/.ssh/id_ed25519_ansible` | Máy chủ VPS Production thực tế. |

---

## 3. Cấu Hình SSH Config Đơn Giản Hóa Kết Nối

Để tránh việc phải gõ các câu lệnh SSH dài dòng phức tạp mỗi lần kết nối, hãy cập nhật cấu hình file SSH config trên máy local cá nhân của bạn:

* **Đường dẫn tệp cấu hình local:**
  * Windows: `C:\Users\<username>\.ssh\config`
  * macOS / Linux: `~/.ssh/config`

* **Nội dung cấu hình mẫu:**
  ```text
  Host k8s-prod
      HostName 103.6.235.15
      User macld
      IdentityFile ~/.ssh/id_ed25519_ansible
      Port 2222

  Host k8s-staging
      HostName 192.168.157.133
      User macld
      IdentityFile ~/.ssh/id_ed25519_ansible
      Port 22

  Host ansible-node
      HostName 192.168.157.50
      User macld
      IdentityFile ~/.ssh/id_ed25519_ansible
      Port 22

  Host build-runner
      HostName 192.168.157.109
      User macld
      IdentityFile ~/.ssh/id_ed25519_ansible
      Port 22
  ```

* **Lệnh kết nối nhanh:**
  ```bash
  ssh k8s-prod
  ssh ansible-node
  ```

---

## 4. Kết Nối Tới Các Dịch Vụ Trên Cluster (Remote Debugging)

Do Kubernetes API Server và Database PostgreSQL chỉ lắng nghe ở địa chỉ IP nội bộ để đảm bảo an toàn, bạn bắt buộc phải tạo đường truyền trung gian (SSH Tunnel Port Forwarding) từ máy local của mình:

### 4.1. Tạo Tunnel kết nối tới Kubernetes API Server (kubectl local)
Chạy câu lệnh PowerShell hoặc Bash sau trên máy cá nhân để kết nối local port `6443` về cụm máy chủ Production:
```powershell
# Mở một tiến trình SSH Tunnel ngầm kết nối tới Production
Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
```
*Lưu ý:* Cập nhật cấu hình file kubeconfig tại địa chỉ `~/.kube/config` của bạn để trỏ server về địa chỉ local: `server: https://127.0.0.1:6443` và bổ sung `tls-server-name: 10.200.0.1` để khớp với chứng chỉ TLS của Server.

### 4.2. Kết nối tới Database Production (Prisma Debug local)
Khi muốn chạy tool migrate database, seed dữ liệu hoặc sử dụng các GUI tools (DBeaver, TablePlus) kết nối trực tiếp đến PostgreSQL Prod:
```powershell
# Chuyển tiếp cổng 5432 cục bộ về StatefulSet Postgres trong cụm Production
Start-Process ssh -ArgumentList "-L 5432:postgres-production-0.postgres-production.database-production:5432 -N k8s-prod" -WindowStyle Hidden
```
*Lúc này, bạn có thể kết nối công cụ Database client của mình trực tiếp qua `localhost:5432`.*

---

## 5. Thiết Lập Biến Môi Trường Cục Bộ (Env Config)

Hãy tạo các tệp tin `.env` tương ứng tại thư mục gốc của từng phân hệ trên máy local của bạn:

### 5.1. File cấu hình Backend (`/backend/.env`)
```env
# Chuỗi kết nối Database trỏ về cổng Port-Forward (localhost:5432) đã mở ở trên
DATABASE_URL="postgresql://portfolio_user:macld%402026@localhost:5432/portfolio_production?sslmode=disable"

# Khóa JWT xác thực token (trùng khớp với JWT_SECRET trong cluster secret)
JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="

PORT=3001
TZ="Asia/Ho_Chi_Minh"
```
*Lưu ý:* Nếu mật khẩu chứa ký tự đặc biệt như `@` (ví dụ: `macld@2026`), bạn **bắt buộc phải mã hóa URL (URL Encode)** thành `%40` để tránh lỗi parse URL của Prisma.

### 5.2. File cấu hình Frontend (`/frontend/.env`)
```env
NODE_ENV="development"
INTERNAL_API_URL="http://localhost:3001/api/v1"
```

---

## 6. Hướng Dẫn Khởi Chạy Lập Trình (Run Commands)

### 6.1. Chạy phân hệ Backend (NestJS)
```bash
cd backend

# 1. Cài đặt các gói thư viện phụ thuộc
pnpm install

# 2. Đồng bộ các types và sinh mã Prisma client code từ DB schema
pnpm prisma generate

# 3. Khởi chạy Server ở chế độ debug/watch (tự reload khi đổi code)
pnpm run start:dev
```
Backend sẽ khởi động thành công và lắng nghe tại địa chỉ: [http://localhost:3001](http://localhost:3001). Bạn có thể truy cập Swagger Docs tại `/api/docs`.

### 6.2. Chạy phân hệ Frontend (Next.js)
```bash
cd frontend

# 1. Cài đặt thư viện phụ thuộc
pnpm install

# 2. Khởi chạy dev server Next.js với Fast Refresh
pnpm run dev
```
Frontend sẽ khởi động thành công và lắng nghe tại địa chỉ: [http://localhost:3000](http://localhost:3000).
