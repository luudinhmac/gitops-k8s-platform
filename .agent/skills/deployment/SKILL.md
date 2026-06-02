QUY TRÌNH TRIỂN KHAI (DEPLOYMENT WORKFLOW)
Mọi tác vụ cập nhật hệ thống từ xa qua SSH BẮT BUỘC tuân thủ quy trình 5 bước để đảm bảo tính an toàn, khả năng truy vết và tối ưu tài nguyên:

BƯỚC 1: ĐỒNG BỘ & ĐỊNH DANH (SYNC & TAGGING)
Truy cập thư mục dự án và thực hiện git pull để lấy mã nguồn mới nhất.

Gắn Tag định danh: Sử dụng Git Commit Hash để làm Tag cho Docker Image nhằm phục vụ việc truy vết và Rollback.

Lệnh mẫu: REV=$(git rev-parse --short HEAD)

BƯỚC 2: XÂY DỰNG IMAGE (DOCKER BUILD)
Thực hiện build đồng thời 2 Tag: Tag định danh (:hash) và Tag vận hành (:latest).

Cú pháp: docker build -t <app_name>:$REV -t <app_name>:latest .

Yêu cầu: Kiểm tra sự tồn tại của Dockerfile và .env trước khi build.

BƯỚC 3: QUẢN LÝ CONTAINER (STOP & REMOVE)
Dừng và xóa container cũ một cách an toàn để giải phóng Port và tài nguyên.

Cú pháp an toàn: (docker stop <app_name> || true) && (docker rm <app_name> || true)

BƯỚC 4: KHỞI CHẠY (DOCKER RUN)
Triển khai phiên bản mới với các tham số tối ưu:

-d --name <app_name>: Chạy ngầm với tên cố định.

-p <host_port>:<container_port>: Map port chính xác (Vd: 127.0.0.1:3000:3000).

--env-file .env: Nạp cấu hình từ file môi trường cục bộ trên server.

--restart always: Tự động khởi động lại khi server reboot hoặc app crash.

Cú pháp: docker run -d --name <app_name> -p 3000:3000 --env-file .env --restart always <app_name>:latest

BƯỚC 5: HẬU KIỂM & DỌN DẸP (CLEANUP & VERIFY)
Cleanup: Xóa các image cũ (dangling images) để tránh đầy ổ cứng: docker image prune -f.

Verify: Kiểm tra trạng thái hoạt động: docker ps và docker logs --tail 20 <app_name>.

NGUYÊN TẮC VẬN HÀNH (CORE RULES):
Toán tử nối lệnh: Luôn sử dụng && giữa các bước chính. Nếu git pull hoặc docker build lỗi, Agent phải dừng lại ngay lập tức và báo cáo, không được phép stop container đang chạy ổn định.

Tính đóng gói: Mọi lệnh SSH phải được gửi dưới dạng một chuỗi lệnh duy nhất để tối ưu kết nối và đảm bảo tính nguyên tử (Atomicity).

Bảo mật: Không bao giờ commit file .env lên Git. Agent phải kiểm tra sự tồn tại của file này trên server đích trước khi chạy lệnh docker run.

VÍ DỤ LỆNH TRIỂN KHAI CHUẨN:
Bash
ssh macld@192.168.157.109 "cd /home/macld/portfolio-app && \
git pull origin main && \
REV=\$(git rev-parse --short HEAD) && \
docker build -t portfolio-app:\$REV -t portfolio-app:latest . && \
(docker stop portfolio-app || true) && \
(docker rm portfolio-app || true) && \
docker run -d --name portfolio-app -p 127.0.0.1:3000:3000 --env-file .env --restart always portfolio-app:latest && \
docker image prune -f"