# 💻 Local Development (Hướng Dẫn Phát Triển Local)

Tài liệu này hướng dẫn cách cài đặt môi trường, cấu hình biến và kết nối kiểm thử ứng dụng từ máy tính cá nhân local.

---

## 🛠️ Công Cụ Cần Thiết (Prerequisites)

Hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
1.  **Node.js** (Phiên bản LTS từ 20.x trở lên)
2.  **pnpm** (Trình quản lý package hiệu năng cao):
    ```bash
    npm install -g pnpm
    ```
3.  **kubectl** (Để tương tác với cụm K8s từ local)
4.  **OpenSSH client** (Được tích hợp sẵn trong Windows 10/11 PowerShell hoặc macOS Terminal)

---

## 🔌 Kết Nối Tới Các Dịch Vụ Trên Cluster (Remote Debugging)

Để kiểm tra code local chạy thực tế với Database hoặc cụm Kubernetes, bạn sử dụng kỹ thuật SSH Port Forwarding qua cổng SSH công khai `2222`.

### 1. Kết nối với Kubernetes API (`kubectl` local)
Chạy lệnh sau trên PowerShell để mở đường truyền kết nối local cổng `6443` về cụm máy chủ:
```powershell
Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
```
*Sau khi chạy, bạn có thể gọi `kubectl get pods` ngay từ máy local của mình.*

### 2. Kết nối tới Database Production (Prisma Debug local)
Khi muốn chạy tool di chuyển schema hoặc seed database từ máy local trỏ thẳng về Postgres trên K8s:
```powershell
# Chuyển tiếp cổng 5432 cục bộ về StatefulSet Postgres trong cụm
Start-Process ssh -ArgumentList "-L 5432:postgres-production-0.postgres-production.database-production:5432 -N k8s-prod" -WindowStyle Hidden
```
*Lúc này, cổng 5432 local trên máy bạn sẽ kết nối trực tiếp đến PostgreSQL Prod.*

---

## 📝 Thiết Lập File Môi Trường Cục Bộ (Env Config)

Tạo các file `.env` tương ứng ở các thư mục dự án trên máy local:

### 1. Cấu hình Backend (`/backend/.env`)
```env
# Kết nối qua SSH Tunnel cổng 5432 đã mở ở bước trên
DATABASE_URL="postgresql://portfolio_user:macld%402026@localhost:5432/portfolio_production"

# Khóa JWT xác thực token (trùng khớp với JWT_SECRET trong cluster secret)
JWT_SECRET="5Ttv+p4uNMkFFnM2N/1jY86/XpsjZv8v8EZKaU120BA="

PORT=3001
TZ="Asia/Ho_Chi_Minh"
```

### 2. Cấu hình Frontend (`/frontend/.env`)
```env
NODE_ENV="development"
INTERNAL_API_URL="http://localhost:3001/api/v1"
```

---

## 🏃 Các Lệnh Khởi Chạy Cục Bộ (Run Commands)

Di chuyển vào thư mục của từng dự án (`backend` hoặc `frontend`) và khởi chạy:

### 1. Chạy Backend (NestJS)
```bash
# 1. Cài đặt các thư viện phụ thuộc
pnpm install

# 2. Tạo client code từ DB schema
pnpm prisma generate

# 3. Khởi chạy server ở chế độ debug/watch
pnpm run start:dev
```
Backend sẽ khởi chạy tại [http://localhost:3001](http://localhost:3001).

### 2. Chạy Frontend (Next.js)
```bash
# 1. Cài đặt các thư viện phụ thuộc
pnpm install

# 2. Khởi chạy dev server với tính năng Fast Refresh
pnpm run dev
```
Frontend sẽ khởi chạy tại [http://localhost:3000](http://localhost:3000).
