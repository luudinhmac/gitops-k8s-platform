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
5. **Docker / Docker Compose** (Nếu muốn chạy PostgreSQL và Redis local nhanh chóng).

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
Chạy câu lệnh tương ứng với hệ điều hành trên máy cá nhân để kết nối local port `6443` về cụm máy chủ Production:

* **Windows (PowerShell):**
  ```powershell
  # Mở một tiến trình SSH Tunnel ngầm kết nối tới Production
  Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
  ```

* **Linux / macOS:**
  ```bash
  # Mở SSH Tunnel chạy ngầm ở background
  ssh -L 6443:10.200.0.1:6443 -N -f k8s-prod
  ```

*Lưu ý:* Cập nhật cấu hình file kubeconfig tại địa chỉ `~/.kube/config` của bạn để trỏ server về địa chỉ local: `server: https://127.0.0.1:6443` và bổ dung `tls-server-name: 10.200.0.1` để khớp với chứng chỉ TLS của Server.

### 4.2. Kết nối tới Database Production (Prisma Debug local)
Khi muốn chạy tool migrate database, seed dữ liệu hoặc sử dụng các GUI tools (DBeaver, TablePlus) kết nối trực tiếp đến PostgreSQL Prod:

* **Windows (PowerShell):**
  ```powershell
  # Chuyển tiếp cổng 5432 cục bộ về StatefulSet Postgres trong cụm Production
  Start-Process ssh -ArgumentList "-L 5432:postgres-production-0.postgres-production.database-production:5432 -N k8s-prod" -WindowStyle Hidden
  ```

* **Linux / macOS:**
  ```bash
  # Chuyển tiếp cổng 5432 cục bộ về StatefulSet Postgres chạy ngầm ở background
  ssh -L 5432:postgres-production-0.postgres-production.database-production:5432 -N -f k8s-prod
  ```

*Lúc này, bạn có thể kết nối công cụ Database client của mình trực tiếp qua `localhost:5432`.*

---

## 5. Thiết Lập Biến Môi Trường Cục Bộ (Env Config)

Hãy tạo các tệp tin `.env` tương ứng tại thư mục gốc của từng phân hệ trên máy local của bạn:

### 5.1. File cấu hình Backend (`/backend/.env`)
```env
# Chuỗi kết nối Database trỏ về cổng Port-Forward hoặc DB local
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5432/<db_name>?sslmode=disable"

# Khóa JWT xác thực token
JWT_SECRET="<your_jwt_secret_key>"

PORT=3001
TZ="Asia/Ho_Chi_Minh"

# Cấu hình Redis local hoặc port forward từ cluster
REDIS_HOST="localhost"
REDIS_PORT=6379
```
*Lưu ý:* Nếu mật khẩu chứa ký tự đặc biệt như `@` (ví dụ: `admin@2026`), bạn **bắt buộc phải mã hóa URL (URL Encode)** thành `%40` để tránh lỗi parse URL của Prisma.

### 5.2. File cấu hình Frontend (`/frontend/.env`)
```env
NODE_ENV="development"
INTERNAL_API_URL="http://localhost:3001/api/v1"
```

---

## 6. Hướng Dẫn Khởi Chạy Lập Trình (Run Commands)

### 6.1. Khởi chạy Database & Redis cục bộ nhanh (Docker)
Nếu không muốn port-forward từ cluster, bạn có thể chạy PostgreSQL và Redis nhanh qua Docker Compose hoặc Docker run:
```bash
# Khởi chạy PostgreSQL container
docker run --name portfolio-db -e POSTGRES_USER=<db_user> -e POSTGRES_PASSWORD=<db_password> -e POSTGRES_DB=<db_name> -p 5432:5432 -d postgres:16-alpine

# Khởi chạy Redis container
docker run --name portfolio-redis -p 6379:6379 -d redis:7-alpine
```

### 6.2. Chạy phân hệ Backend (NestJS)
```bash
cd backend

# 1. Cài đặt các gói thư viện phụ thuộc
pnpm install

# 2. Đồng bộ các types và sinh mã Prisma client code từ DB schema
pnpm prisma generate

# 3. Chạy migrations để khởi tạo database local (nếu dùng db local)
pnpm prisma db push

# 4. Khởi chạy Server ở chế độ debug/watch (tự reload khi đổi code)
pnpm run start:dev
```
Backend sẽ khởi động thành công và lắng nghe tại địa chỉ: [http://localhost:3001](http://localhost:3001). Bạn có thể truy cập Swagger Docs tại `/api/docs`.

### 6.3. Chạy phân hệ Frontend (Next.js)
```bash
cd frontend

# 1. Cài đặt thư viện phụ thuộc
pnpm install

# 2. Khởi chạy dev server Next.js với Fast Refresh
pnpm run dev
```
Frontend sẽ khởi động thành công và lắng nghe tại địa chỉ: [http://localhost:3000](http://localhost:3000).
