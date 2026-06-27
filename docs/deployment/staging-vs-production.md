# ⚖️ Staging vs Production Environments Policy

Tài liệu này định nghĩa sự khác biệt về cấu hình, chính sách và tiêu chuẩn vận hành giữa hai môi trường **Staging** (Thử nghiệm) và **Production** (Thực tế).

---

## 1. Bảng so sánh tổng quan (Key Differences)

| Đặc tính | Môi trường Staging | Môi trường Production |
| :--- | :--- | :--- |
| **Namespace K8s** | `portfolio` & `database` | `production` & `database-production` |
| **Nhánh Git Kích Hoạt** | `dev` | `main` (thông qua Git Tags) |
| **Tên Miền (Domain)** | `staging.luumac.io.vn` | `blog.luumac.io.vn` / `api.luumac.io.vn` |
| **Số lượng Pods** | 1 replica (tiết kiệm tài nguyên) | Tối thiểu 2 replicas (High Availability) |
| **Cơ chế Co Giãn (HPA)** | Không áp dụng | Kích hoạt (Auto-scale từ 2 đến 5 Pods) |
| **QoS Class** | BestEffort / Burstable (thấp) | Burstable (chặt chẽ, định lượng tài nguyên lớn) |
| **Trình Lưu Trữ (Storage)** | StorageClass `local-path` (single node) | StorageClass `longhorn` (distributed storage) |
| **Dọn Dẹp Smoke Test** | Tự động đăng ký & xóa user test | Chỉ chạy kiểm tra API Read-Only (an toàn DB) |
| **Phê duyệt triển khai** | Tự động đồng bộ (Auto CD) | Phê duyệt thủ công (Manual Approve) |

---

## 2. Chính sách Vận hành & Cấu hình

### 2.1. Triển khai và Đồng bộ
*   **Staging**: Mọi commit thành công trên nhánh `dev` đều tự động build docker image và đẩy cấu hình mới lên cụm để kiểm thử tức thì.
*   **Production**: Yêu cầu tạo Git Tag từ nhánh `main` để kích hoạt build Docker image có tag phiên bản cụ thể. Việc deploy lên cluster thực tế bắt buộc phải có thao tác nhấn nút duyệt thủ công (**Manual Play**) trên giao diện GitLab Runner nhằm tránh deploy sai sót ngoài ý muốn.

### 2.2. Kiểm thử khói (Smoke Testing)
*   **Staging**: Thực hiện kiểm tra toàn diện, bao gồm cả luồng ghi dữ liệu (Đăng ký tài khoản, đăng nhập) và dọn dẹp dữ liệu tự động (Clean up) để đảm bảo toàn bộ nghiệp vụ hoạt động trơn tru.
*   **Production**: Tuyệt đối **không chạy bất kỳ nghiệp vụ ghi dữ liệu nào** trong quá trình test tự động để tránh làm sai lệch dữ liệu sản phẩm thực tế của người dùng. Chỉ thực hiện các truy vấn đọc dữ liệu (Read Queries) và kiểm tra mã trạng thái HTTP Endpoint.

### 2.3. Sao lưu & Phục hồi (Backups)
*   **Staging**: Không thiết lập lịch trình sao lưu Velero tự động hàng ngày để giảm tải hệ thống (chỉ chụp snapshot cục bộ khi cần).
*   **Production**: Bắt buộc kích hoạt sao lưu Velero lên R2 hàng ngày lúc 02:00 AM kèm theo sao lưu snapshots của cơ sở dữ liệu etcd của Control Plane.
