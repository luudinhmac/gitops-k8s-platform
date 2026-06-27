# 🚢 Zero-Downtime Deployment Strategy

Tài liệu này đặc tả kiến trúc triển khai không gián đoạn dịch vụ (Zero-Downtime Deployments) được áp dụng trên cụm Kubernetes cho các phân hệ Frontend (Next.js) và Backend (NestJS).

---

## 1. Chiến lược cập nhật Rolling Update

Để đảm bảo các ứng dụng luôn sẵn sàng phục vụ người dùng 24/7 ngay cả trong quá trình cập nhật phiên bản mới, cấu hình Helm deployment định nghĩa chiến lược **RollingUpdate** với cấu hình nghiêm ngặt:

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Phân tích cơ chế:
*   **`maxUnavailable: 0`**: Quy định rằng trong suốt quá trình cập nhật, **không một Pod cũ nào được phép bị tắt** trước khi có Pod mới khởi chạy thành công và ở trạng thái sẵn sàng (`Ready`).
*   **`maxSurge: 1`**: Cho phép Kubernetes khởi tạo thêm tối đa 1 Pod mới chạy phiên bản mới song song với các Pod cũ. Cụm sẽ tạm thời chạy nhiều Pod hơn thông thường trong thời gian chuyển giao.
*   **Luồng hoạt động**:
    1.  Kích hoạt deploy phiên bản mới -> K8s khởi tạo Pod mới (Surge).
    2.  Pod mới chạy và được kiểm tra bởi các đầu dò sức khỏe (Probes).
    3.  Khi Probes báo Pod mới lành mạnh (`Ready`) -> Traffic Ingress bắt đầu định tuyến tới Pod mới.
    4.  K8s tiến hành dừng Pod cũ từ từ, đảm bảo không có yêu cầu nào của người dùng bị gián đoạn.

---

## 2. Vai trò của Liveness & Readiness Probes

Các đầu dò sức khỏe (Probes) là thành phần cốt lõi để Kubernetes xác định trạng thái thực tế của Container. 

### 2.1. Liveness Probe (Đầu dò Sự sống)
*   **Mục tiêu**: Phát hiện các trạng thái treo luồng, nghẽn dòng (deadlocks) hoặc lỗi crash ngầm của ứng dụng.
*   **Hành vi**: Nếu đầu dò thất bại liên tiếp vượt quá ngưỡng cấu hình (`failureThreshold`), Kubernetes sẽ tự động **kill container và khởi động lại Pod** (Self-Healing).

### 2.2. Readiness Probe (Đầu dò Sẵn sàng)
*   **Mục tiêu**: Xác định xem ứng dụng đã tải xong cấu hình, khởi tạo kết nối DB/Redis và sẵn sàng nhận traffic từ Ingress chưa.
*   **Hành vi**: Nếu đầu dò thất bại, Kubernetes sẽ **gỡ Pod ra khỏi danh sách Endpoint của Service**. Người dùng sẽ không bị điều hướng vào Pod đang lỗi.

### 2.3. Cấu hình thực tế trong Helm Template
Dưới đây là cấu hình Probes được triển khai cho Frontend:
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 5
```

### 2.4. Bỏ qua xác thực ở Middleware (Middleware Health Bypass)
*   **Vấn đề**: Ở phiên bản trước, Next.js Middleware chặn mọi request để kiểm tra bảo mật/bảo trì và chuyển hướng hoặc proxy sang Backend. Nếu Backend gặp sự cố hoặc phản hồi chậm, đầu dò của Frontend cũng sẽ báo thất bại, dẫn đến Kubernetes xóa sạch các Pod Frontend dù bản thân Frontend không lỗi.
*   **Giải pháp**: Cập nhật Next.js Middleware (`frontend/src/middleware.ts`) để **bỏ qua hoàn toàn** việc xử lý hoặc chuyển tiếp đối với endpoint `/api/health`, cho phép nó được phản hồi cục bộ tức thì bởi Frontend:
    ```typescript
    // Bypass health check endpoint immediately to avoid backend calls, proxying, or maintenance redirects
    if (pathname === '/api/health') {
      return NextResponse.next();
    }
    ```
    Điều này **tách biệt hoàn toàn (decouple)** trạng thái sống của Frontend khỏi Backend, ngăn chặn hiện tượng sập dây chuyền (cascading failures).

---

## 3. Vai trò của PodDisruptionBudget (PDB)

Khi cụm Kubernetes chạy các hoạt động bảo trì tự động (ví dụ: nâng cấp phiên bản node, drain node để sửa phần cứng), các Pod có thể bị tắt đột ngột ngoài ý muốn. 

Để ngăn chặn việc này làm sập hệ thống, một chính sách **PodDisruptionBudget (PDB)** được áp dụng cho cả Frontend và Backend:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: portfolio-backend-pdb
  namespace: production
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: portfolio-backend
```

### Phân tích cơ chế:
*   **`minAvailable: 1`**: Quy định cụm K8s phải luôn duy trì **ít nhất 1 Pod hoạt động** cho dịch vụ Backend trong mọi hoạt động bảo trì tự nguyện (`voluntary disruptions`).
*   Nếu quản trị viên chạy lệnh `kubectl drain node-1`, Kubernetes sẽ kiểm tra PDB. Nếu việc tắt Pod trên `node-1` làm số lượng Pod hoạt động giảm xuống dưới `minAvailable`, lệnh drain sẽ bị tạm dừng cho đến khi Pod mới ở node khác sẵn sàng, bảo vệ ứng dụng khỏi nguy cơ mất hoàn toàn kết nối.
