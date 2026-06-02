# Báo Cáo Triển Khai Hạ Tầng Staging & Kế Hoạch Production

Báo cáo này tổng hợp quá trình thiết lập hạ tầng Kubernetes cho dự án Portfolio trên môi trường Staging (192.168.157.110).

## 1. Các Lệnh Chính Đã Thực Thi

Toàn bộ quá trình được tự động hóa qua Ansible từ máy `ansible-node` (192.168.157.50).

- **Lệnh triển khai tổng thể:**
  ```bash
  ansible-playbook -i inventory.ini setup_infra.yml -e "RUNNER_TOKEN_STAGING=<your-token>"
  ```
- **Lệnh kiểm tra trạng thái (tại k8s-staging):**
  ```bash
  kubectl get pods -A
  kubectl get svc -n infra
  kubectl logs -l app.kubernetes.io/name=traefik -n infra
  ```

## 2. Các Vấn Đề Gặp Phải & Hướng Xử Lý

| Vấn đề | Nguyên nhân | Hướng xử lý | Tình trạng |
| :--- | :--- | :--- | :--- |
| **PVC không Bind được PV** | Các PV thiếu `storageClassName` cụ thể dẫn đến xung đột với trình provisioner mặc định. | Ép cứng `storageClassName: manual` và chỉ định `volumeName` cho từng PVC. | **Fix Cứng** |
| **Lỗi thứ tự Deploy** | Service deploy trước khi PV sẵn sàng dẫn đến Pod kẹt ở trạng thái `Pending`. | Điều chỉnh Ansible Role để Apply Storage trước và thêm task `Wait for PV`. | **Fix Cứng** |
| **Traefik không mở cổng 80/443** | Dùng `NodePort` mặc định của Helm hoặc `hostPort` bị chặn bởi CNI (Cilium). | Chuyển Traefik sang chế độ `hostNetwork: true`. | **Fix Cứng** |
| **Traefik Permission Denied** | Cổng 80/443 là cổng đặc quyền, Traefik (user thường) không có quyền bind. | Cấu hình `securityContext` chạy dưới quyền `root` (UID 0) và thêm `NET_BIND_SERVICE`. | **Fix Cứng** |
| **404 Not Found (Ingress)** | Traefik chặn `ExternalName` mặc định và Ingress ở khác namespace với Service. | Bật `allowExternalNameServices` và chuyển Ingress về namespace `portfolio`. | **Fix Cứng** |

## 3. Các Thay Đổi Quan Trọng Trong Config

### A. Hạ Tầng (Ansible Roles)
- **`infra-services`**: Cấu hình Helm Traefik cực kỳ chi tiết để chạy được trên Bare-metal/VM (HostNetwork + Root).
- **`k8s-deploy`**: Tách bạch việc sync manifest và apply theo thứ tự ưu tiên (Storage -> Secrets -> Apps).

### B. Kubernetes Manifests
- **Storage**: Chuyển toàn bộ sang chuẩn `manual`. Đảm bảo dữ liệu bền vững tại `/data/k8s/`.
- **Ingress**: Đặt tại namespace của ứng dụng (`portfolio`) để đảm bảo tính ổn định cao nhất và tránh lỗi phân giải DNS giữa các namespace.

### C. Tự động hóa dọn dẹp
- **Docker Cleanup**: Đã cấu hình Cron job tại máy `build-runner` (3:00 AM mỗi ngày) để dọn dẹp các Docker image cũ/dangling, chỉ giữ lại những bản cần thiết để tránh đầy ổ đĩa.

## 4. Kiểm Tra Để Triển Khai Lên Production

Để khi chạy lên Production "chỉ cần run là chạy", bạn cần lưu ý:

1. **Cập nhật Inventory**: Tạo file `production_inventory.ini` với đúng IP của các Node Production.
2. **Kiểm tra Cổng**: Đảm bảo cổng 80 và 443 trên các máy Production không bị chiếm bởi Nginx/Apache cài trực tiếp trên OS.
3. **Đường dẫn Lưu trữ**: Đảm bảo thư mục `/data/k8s/` đã được tạo (hoặc để Ansible tự tạo) với quyền ghi đầy đủ.
4. **Secrets**: Kiểm tra lại các biến môi trường trong `portfolio-secrets` (DB password, JWT secret) cho môi trường Production.
5. **DNS**: Trỏ tên miền chính thức về IP của Node chạy Traefik trên Production.

---
**Kết luận:** Hạ tầng hiện tại đã đạt trạng thái **Production-Ready**. Các bản vá đã được tích hợp trực tiếp vào Source Code của repository `infra`, không còn các cấu hình tạm thời.
