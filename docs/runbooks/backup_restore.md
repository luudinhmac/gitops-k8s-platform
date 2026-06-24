# 💾 Backup & Restore Runbook

Quy trình này hướng dẫn nhân viên vận hành thực hiện sao lưu (Backup) và phục hồi (Restore) toàn bộ cụm Kubernetes, cơ sở dữ liệu PostgreSQL và cấu hình trạng thái của cụm (etcd control plane).

---

## 1. Sao Lưu Toàn Cụm Bằng Velero & Cloudflare R2

Hệ thống sử dụng **Velero** để tự động sao lưu cấu hình toàn bộ cụm Kubernetes và dữ liệu Database (PostgreSQL) lưu trên Persistent Volume (Local Path/Longhorn) lên Cloudflare R2 (S3-compatible Object Storage).

### 1.1. Lịch trình sao lưu tự động (Schedules)
Lịch trình mặc định chạy tự động vào **02:00 AM giờ Việt Nam** (tức 19:00 giờ UTC) hàng ngày và lưu trữ trong **7 ngày**.
* Kiểm tra lịch trình:
  ```bash
  velero schedule get
  ```

### 1.2. Tạo bản sao lưu thủ công khẩn cấp
Trước khi thực hiện các nâng cấp lớn hoặc chạy migration cơ sở dữ liệu:
```bash
# Backup toàn bộ cụm
velero backup create manual-backup-$(date +%F)

# Chỉ backup namespace production và database-production
velero backup create app-backup-$(date +%F) --include-namespaces production,database-production
```

### 1.3. Theo dõi trạng thái bản sao lưu
```bash
# Xem danh sách các bản backup
velero backup get

# Xem chi tiết một bản backup cụ thể để kiểm tra lỗi
velero backup describe manual-backup-xxxx

# Xem log quá trình backup
velero backup logs manual-backup-xxxx
```

### 1.4. Phục hồi từ Velero Backup (Disaster Recovery)
Khi cụm máy chủ bị lỗi hoàn toàn và đã được dựng lại bằng Ansible:
1. Đảm bảo Velero đã kết nối thành công với R2 bucket và đồng bộ thông tin:
   ```bash
   velero backup get
   ```
2. Thực hiện lệnh khôi phục từ bản backup mong muốn:
   ```bash
   # Khôi phục từ bản backup gần nhất
   velero restore create --from-backup manual-backup-xxxx
   
   # Theo dõi tiến trình restore
   velero restore get
   velero restore describe <restore-name>
   ```

> [!WARNING]
> **Khôi phục dữ liệu PostgreSQL StatefulSet:**
> Do sử dụng Persistent Volume, Node Agent của Velero sẽ khôi phục trực tiếp các tệp dữ liệu vào thư mục volume của Pod mới.
> 1. Tránh chạy ghi đè khi Pod database đang hoạt động tích cực để ngăn ngừa lỗi bất đồng bộ file.
> 2. Khuyên dùng: Scale Down các Deployment liên quan (`replicas=0`), thực hiện Restore, sau đó Scale Up trở lại.

### 1.5. Hình ảnh minh họa sao lưu thực tế (Velero Backup Screenshots)

Dưới đây là các bản ghi chép thực tế quá trình sao lưu tự động và cấu hình lưu trữ trên Cloudflare R2:

*   **Danh sách các bản sao lưu K8s tự động hàng ngày lên R2:**
    ![Velero Backups List](../../images/backup-daily-k8s-to-r2.png)

*   **Thông tin chi tiết của một bản sao lưu thành công:**
    ![Velero Backup Detail](../../images/detail-backup-daily-k8s-r2.png)

---

## 2. Sao Lưu & Khôi Phục Cơ Sở Dữ Liệu PostgreSQL Thủ Công

Ngoài Velero, bạn có thể thực hiện sao lưu/khôi phục trực tiếp cơ sở dữ liệu PostgreSQL qua dòng lệnh `pg_dump` để phục vụ di chuyển dữ liệu hoặc test nhanh.

### 2.1. Sao lưu database ra file SQL
```bash
# Sao lưu Database Production
kubectl exec -t postgres-production-0 -n database-production -- pg_dump -U portfolio_user -d portfolio_production > production_backup.sql

# Sao lưu Database Staging
kubectl exec -t postgres-staging-0 -n database -- pg_dump -U portfolio_user -d portfolio_staging > staging_backup.sql
```

### 2.2. Khôi phục database từ file SQL
```bash
# Nạp lại dữ liệu vào Database Production
cat production_backup.sql | kubectl exec -i postgres-production-0 -n database-production -- psql -U portfolio_user -d portfolio_production

# Nạp lại dữ liệu vào Database Staging
cat staging_backup.sql | kubectl exec -i postgres-staging-0 -n database -- psql -U portfolio_user -d portfolio_staging
```

---

## 3. Sao Lưu Cấu Hình Control Plane (etcd backup)

Để đề phòng thảm họa cụm K8s bị hỏng hoàn toàn cấu hình etcd, một cronjob tự động đã được thiết lập trên Master Node để snapshot etcd định kỳ.

### 3.1. Kịch bản chạy snapshot etcd
Snapshot được tạo và lưu trữ trên Master Node tại đường dẫn `/var/lib/etcd-backup/etcd-snapshot.db` sử dụng công cụ `etcdctl`:
```bash
# Lệnh tạo snapshot etcd thủ công
sudo ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pips/ca.crt \
  --cert=/etc/kubernetes/pips/healthcheck-client.crt \
  --key=/etc/kubernetes/pips/healthcheck-client.key \
  snapshot save /var/lib/etcd-backup/etcd-snapshot.db
```

### 3.2. Script đồng bộ etcd lên cloud
Script `/root/sync_etcd_backup.sh` được cấu hình qua cronjob để đồng bộ snapshot etcd lên Cloudflare R2 hàng ngày:
```bash
#!/bin/bash
# Đồng bộ snapshot etcd lên Cloudflare R2 bucket
rclone sync /var/lib/etcd-backup r2:blog-etcd-backups --progress
```
