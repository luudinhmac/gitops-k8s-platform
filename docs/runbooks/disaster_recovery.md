# 🚨 Disaster Recovery Runbook

Tài liệu này hướng dẫn các bước xử lý khẩn cấp khi cụm máy chủ gặp sự cố nghiêm trọng: mất kết nối, thay đổi IP của quản trị viên bị chặn Web UI, lỗi kẹt Database Migrations, hoặc cần cài đặt lại toàn bộ cụm máy chủ từ đầu.

---

## 1. Reset Lỗi Kẹt Database Migrations (Prisma Migration Lock)

Nếu một lần deploy bị lỗi (như lỗi ký tự BOM `\ufeff` trước đây) khiến Prisma bị "kẹt" metadata giả trong database và không chịu tạo bảng ở các lần deploy tiếp theo:

1. **Hạ số lượng Pod Backend về 0** để giải phóng các kết nối đang khóa Database:
   ```bash
   kubectl scale deployment/portfolio-backend-production -n production --replicas=0
   ```
2. **Xóa database lỗi cũ và khởi tạo database trống mới:**
   ```bash
   kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "DROP DATABASE portfolio_production;"
   kubectl exec -it postgres-production-0 -n database-production -- psql -U portfolio_user -d postgres -c "CREATE DATABASE portfolio_production;"
   ```
3. **Kéo số lượng Pod Backend hoạt động trở lại lên 1:**
   ```bash
   kubectl scale deployment/portfolio-backend-production -n production --replicas=1
   ```
4. **Kiểm tra log Pod Backend**, container khởi động `prisma-migrate` sẽ tự động chạy lại bộ migrations sạch sẽ 100%:
   ```bash
   kubectl logs deployment/portfolio-backend-production -n production -c prisma-migrate
   ```
   *(Thực hiện tương tự cho namespace `portfolio` nếu Staging gặp lỗi).*

---

## 2. Cập Nhật Whitelist IP Truy Cập Trang Quản Trị

Khi IP Public của bạn (Quản trị viên) thay đổi, Ingress Gateway (Traefik) sẽ chặn toàn bộ truy cập vào các trang Dashboard (ArgoCD, K8s Dashboard, Grafana) và hiển thị lỗi **403 Forbidden**.

### Các bước mở khóa khẩn cấp:
1. **Lấy IP Public hiện tại** của máy local:
   * Chạy lệnh sau trong PowerShell local:
     ```powershell
     (Invoke-WebRequest ifconfig.me).Content.Trim()
     ```
2. **Mở SSH Tunnel cục bộ** (SSH kết nối qua cổng public `2222` của VPS nên không bị ảnh hưởng bởi đổi IP):
   ```powershell
   Start-Process ssh -ArgumentList "-L 6443:10.200.0.1:6443 -N k8s-prod" -WindowStyle Hidden
   ```
3. **Cập nhật Whitelist trực tiếp trên cụm K8s:**
   Sửa lại IP trong Middleware `admin-allowlist` ở namespace `infra`:
   ```bash
   kubectl edit middleware admin-allowlist -n infra
   ```
   *Tìm đến dòng `sourceRange` và sửa IP cũ thành IP mới của bạn:*
   ```yaml
   spec:
     ipWhiteList:
       sourceRange:
         - <NEW_IP_PUBLIC>/32
   ```
4. **Đồng bộ hóa mã nguồn:** Sửa lại IP mới này trong file `infra/ansible/roles/infra-services/tasks/main.yml` để tránh bị ghi đè hoàn tác ở các lần chạy Ansible sau.

---

## 3. Dựng Lại Toàn Bộ Cụm Máy Chủ Từ Đầu (VPS Rebuild)

Khi VPS bị hỏng hệ điều hành vật lý hoặc bạn muốn chuyển toàn bộ cụm sang một VPS mới:

1. **Cập nhật IP của VPS mới:** Sửa file Ansible Inventory tại `infra/ansible/inventory/hosts.ini` điền IP của VPS mới.
2. **Khởi chạy Ansible Playbook để setup K8s:**
   ```bash
   ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/setup_cluster.yml --ask-become-pass
   ```
   *Ansible sẽ tự động cài đặt Docker, containerd, dựng K3s cluster, cấu hình firewall, và SSH Port 2222.*
3. **Nạp lại Sealed Secrets Decryption Keys:**
   Trước khi cài đặt Sealed Secrets Helm Chart, bạn bắt buộc phải nạp lại Private key cũ đã sao lưu (Xem hướng dẫn tại mục 4.2 của `docs/deployment/k8s_setup_guide.md`):
   ```bash
   kubectl apply -f sealed-secrets-private-keys.yaml
   ```
4. **Khôi phục ứng dụng trên ArgoCD:**
   Truy cập giao diện ArgoCD Web, kết nối lại Repo và chọn **Sync** để tự động kéo toàn bộ Helm Charts và Deployments về cụm mới.
5. **Khôi phục dữ liệu database:** Thực hiện import lại file sql đã backup theo hướng dẫn tại mục 2.2 của `docs/runbooks/backup_restore.md`.

---

## 4. Khôi Phục Cơ Sở Dữ Liệu ETCD (Advanced Master Restore)

> [!CAUTION]
> Khôi phục etcd là tác vụ có rủi ro cực kỳ cao, chỉ thực hiện khi cụm Kubernetes bị hỏng cơ sở dữ liệu etcd không thể tự phục hồi. Quy trình này phải chạy trên Host của VPS dưới quyền root.

1. **Dừng các thành phần Control Plane:**
   Để tránh ghi dữ liệu đè lên nhau, cần di chuyển tạm thời các file cấu hình Static Pods ra khỏi thư mục của kubelet để dừng chúng:
   ```bash
   sudo mv /etc/kubernetes/manifests/*.yaml /tmp/
   # Chờ khoảng 1-2 phút cho các Container apiserver, controller-manager, scheduler, etcd dừng hoàn toàn
   sudo crictl ps # Đảm bảo không còn container hệ thống nào chạy
   ```
2. **Sao lưu thư mục etcd cũ đang lỗi:**
   ```bash
   sudo mv /var/lib/etcd /var/lib/etcd-backup-$(date +%F)
   ```
3. **Thực hiện lệnh khôi phục (etcdctl snapshot restore):**
   ```bash
   # Đường dẫn tới file backup etcd mong muốn
   SNAPSHOT_FILE="/data/k8s/backups/etcd-snapshot-xxxx.db"

   sudo ETCDCTL_API=3 etcdctl snapshot restore "$SNAPSHOT_FILE" \
     --name=k8s-prod \
     --initial-cluster=k8s-prod=https://10.200.0.1:2380 \
     --initial-cluster-token=etcd-cluster-1 \
     --initial-advertise-peer-urls=https://10.200.0.1:2380 \
     --data-dir=/var/lib/etcd
   ```
4. **Đặt lại quyền sở hữu cho thư mục etcd mới khôi phục:**
   ```bash
   sudo chown -R root:root /var/lib/etcd
   ```
5. **Khởi động lại các thành phần Control Plane:**
   Di chuyển các file cấu hình Static Pods trở lại vị trí cũ để kubelet tự động bật lại chúng:
   ```bash
   sudo mv /tmp/*.yaml /etc/kubernetes/manifests/
   # Chờ 1-2 phút cho các pods khởi chạy lại
   kubectl get nodes
   kubectl get pods -n kube-system
   ```
