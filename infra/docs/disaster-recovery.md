# 🚨 Disaster Recovery (Quy Trình Khôi Phục Sự Cố)

Tài liệu này hướng dẫn các bước xử lý khẩn cấp khi cụm máy chủ gặp sự cố nghiêm trọng, mất kết nối, lỗi Database, hoặc cần cài đặt lại từ đầu.

---

## 💾 1. Sao Lưu & Khôi Phục Database (PostgreSQL Backup & Restore)

Môi trường Production sử dụng PostgreSQL dạng StatefulSet chạy trong namespace `database-production`. 

### 1.1. Lệnh Sao lưu Database (Backup)
Chạy lệnh sau trên máy chủ VPS để kết xuất toàn bộ dữ liệu ra file SQL:
```bash
# Thực hiện pg_dump trong Pod và xuất ra file nén trên Host VPS
kubectl exec -t postgres-production-0 -n database-production -- pg_dump -U portfolio_user -d portfolio_production | gzip > /data/k8s/backups/postgres_prod_$(date +%F).sql.gz
```
*Khuyến khích lập lịch cronjob trên VPS chạy lệnh này hàng ngày.*

### 1.2. Lệnh Khôi phục Database (Restore)
Khi cần khôi phục dữ liệu từ file backup:
```bash
# 1. Giải nén file backup
gunzip postgres_prod_backup.sql.gz

# 2. Xóa database cũ đang lỗi và tạo mới database trống
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"

# 3. Import lại dữ liệu từ file backup
kubectl exec -i postgres-production-0 -n database-production -- psql -U portfolio_user -d portfolio_production < postgres_prod_backup.sql
```

---

## ⚡ 2. Khắc Phục Lỗi Bị Kẹt Database Migrations (Prisma Lock Fix)

Nếu một lần deploy bị lỗi khiến Prisma lock database metadata (báo lỗi không thể chạy migrations tiếp theo dù code đã sửa), hãy thực hiện quy trình reset sạch migrations:

```bash
# 1. Hạ số lượng Pod Backend về 0 để giải phóng các kết nối đang bị kẹt
kubectl scale deployment/portfolio-backend-production -n production --replicas=0

# 2. Thực hiện xóa và tạo mới database trống
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"

# 3. Kéo số lượng Pod Backend hoạt động trở lại lên 1
kubectl scale deployment/portfolio-backend-production -n production --replicas=1

# 4. Kiểm tra log pod Backend, init container 'prisma-migrate' sẽ tự động chạy bộ migrations sạch
kubectl logs deployment/portfolio-backend-production -n production -c prisma-migrate
```

---

## 🌐 3. Xử Lý Khi IP Public Của Router Local Thay Đổi (Chặn Web UI)

Khi IP Public của bạn thay đổi, Traefik sẽ chặn toàn bộ truy cập vào các trang quản trị (ArgoCD, K8s Dashboard, Grafana) và báo lỗi **403 Forbidden**.

### Các bước khôi phục:
1.  **Lấy IP Public hiện tại:** Truy cập [https://ifconfig.me](https://ifconfig.me) hoặc chạy lệnh sau trong PowerShell local:
    ```powershell
    (Invoke-WebRequest ifconfig.me).Content.Trim()
    ```
2.  **Mở SSH Tunnel cục bộ:** (SSH kết nối qua cổng public `2222` của VPS nên không bị ảnh hưởng bởi đổi IP).
    ```powershell
    Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
    ```
3.  **Cập nhật Whitelist trên K8s:**
    Thay đổi trực tiếp IP trong Middleware `admin-allowlist` ở namespace `infra`:
    ```bash
    kubectl edit middleware admin-allowlist -n infra
    ```
    *Tìm đến dòng `sourceRange` và sửa IP cũ thành IP mới của bạn:* `- <NEW_IP_PUBLIC>/32`.
4.  **Cập nhật vào code triển khai:** Sửa lại IP mới trong file [main.yml (infra-services)](file:///d:/DATA/Portfolio/infra/ansible/roles/infra-services/tasks/main.yml) để tránh bị ghi đè ở các lần chạy Ansible sau.

---

## 🔧 4. Dựng Lại Toàn Bộ Cụm Máy Chủ Từ Đầu (Reinstall Cluster)

Khi cần cài đặt lại hệ điều hành VPS hoặc dựng cụm trên VPS mới:

1.  **Cập nhật IP của VPS mới:** Sửa file cấu hình Ansible Inventory tại `infra/ansible/inventory/hosts.ini` điền IP của VPS mới.
2.  **Chạy Ansible Playbook:**
    ```bash
    ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/setup_cluster.yml --ask-become-pass
    ```
    *Ansible sẽ tự động cài đặt Docker, Masking SSH Socket, Cấu hình SSH Port 2222, dựng Kubernetes (K3s), và áp các rule mạng iptables.*
3.  **Nạp lại Secrets trên K8s:**
    Chạy các lệnh tạo Secret chứa `DATABASE_URL` và `JWT_SECRET` cho hai namespace `portfolio` và `production` (Chi tiết cấu hình xem tại **Giai đoạn 3** trong `docs/standard_deployment_playbook.md`).
4.  **Khôi phục ứng dụng trên ArgoCD:**
    Truy cập giao diện ArgoCD Web, kết nối lại Repo và chọn **Sync** để tự động kéo toàn bộ Helm Charts và Deployments về cụm mới.
5.  **Khôi phục Database backup:** Thực hiện import lại file sql đã backup theo hướng dẫn tại **Mục 1.2**.
