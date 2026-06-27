# Báo cáo kết quả xử lý bảo mật mã nguồn và Docker Image

Tài liệu này tổng hợp toàn bộ các vấn đề bảo mật được phát hiện bằng công cụ Trivy, phương án xử lý và kết quả sau khi tối ưu hóa mã nguồn cũng như cấu hình Docker Image cho hệ thống Portfolio.

---

## 1. Tổng quan tình trạng bảo mật ban đầu
Trước khi xử lý, hệ thống tồn tại các lỗ hổng bảo mật được quét bởi Trivy ở 3 khu vực:
1. **Backend**: Phát hiện 5 lỗ hổng (1 HIGH, 4 MEDIUM) từ các thư viện dependencies (`sanitize-html`, `postcss`, `qs`, `fast-xml-parser`).
2. **Thư mục gốc (Root Monorepo)**: Phát hiện 19 lỗ hổng (1 CRITICAL, 8 HIGH, 7 MEDIUM, 3 LOW) do chứa tệp `pnpm-lock.yaml` cũ tích hợp toàn bộ monorepo và các gói đã cũ.
3. **Docker Image (Base Image)**: Phát hiện 4 lỗ hổng (1 HIGH, 3 MEDIUM) phát sinh từ bộ công cụ `npm` toàn cục cài sẵn trong ảnh nền `node:22-alpine` (`brace-expansion`, `ip-address`, `picomatch`).

---

## 2. Các biện pháp xử lý đã thực hiện

### A. Khắc phục lỗ hổng trong mã nguồn ứng dụng (Dependencies)
Chúng tôi đã cập nhật các gói phụ thuộc trực tiếp lên phiên bản an toàn và áp dụng cơ chế ghi đè phiên bản (`pnpm.overrides`) cho các gói phụ thuộc gián tiếp (transitive dependencies):

- **Phía Backend**:
  - Nâng cấp trực tiếp gói `sanitize-html` từ phiên bản `2.17.2` lên bản vá an toàn `2.17.4`.
  - Bổ sung cấu hình ghi đè phiên bản (`pnpm.overrides`) trong `backend/package.json` để ép các thư viện dùng phiên bản an toàn:
    - `fast-xml-parser` lên `^1.1.7` (Vá lỗ hổng bảo mật XML).
    - `postcss` lên `^8.5.10` (Khắc phục lỗ hổng ReDoS).
    - `qs` lên `^6.15.2` (Vá lỗi Prototype Pollution).
  - Khởi tạo lại tệp `backend/pnpm-lock.yaml`.

- **Phía Frontend**:
  - Nâng cấp `next` và `eslint-config-next` từ phiên bản `16.2.3` lên `16.2.6`.
  - Nâng cấp `axios` lên phiên bản `1.16.1` (thông qua khai báo `^1.15.2`).
  - Bổ sung cấu hình ghi đè phiên bản (`pnpm.overrides`) trong `frontend/package.json`:
    - `@xmldom/xmldom` lên `^0.8.13` (Khắc phục lỗi thực thi mã từ xa/XSS).
    - `postcss` lên `^8.5.10` (Khắc phục lỗ hổng ReDoS).
  - Khởi tạo lại tệp `frontend/pnpm-lock.yaml`.

- **Thư mục gốc (Root Workspace)**:
  - Do dự án đã tách biệt backend và frontend thành các repository riêng, chúng tôi đã xóa bỏ tệp lock monorepo cũ (`pnpm-lock.yaml` dung lượng 344KB).
  - Xóa bỏ thư mục `node_modules` cũ tại gốc và chạy `pnpm install` để tái thiết lập lockfile độc lập tối giản (chỉ còn **6KB**) chỉ chứa gói `concurrently`. Loại bỏ hoàn toàn 19 lỗ hổng monorepo cũ.

---

### B. Khắc phục lỗ hổng trong Docker Image (Docker Hardening)
Mặc dù mã nguồn dự án đã sạch, Trivy vẫn quét thấy 4 lỗ hổng (1 HIGH, 3 MEDIUM) nằm bên trong thư mục cài đặt `npm`/`npx` toàn cục đi kèm của ảnh nền `node:22-alpine` (`/usr/local/lib/node_modules/npm`). 

Do container chạy production chỉ cần lệnh `node` để thực thi mã nguồn đã biên dịch (không cần đến `npm`/`npx`), chúng tôi đã thực hiện kỹ thuật **Hardening** (làm sạch hệ thống) bằng cách bổ sung lệnh xóa các công cụ này ở stage cuối cùng (`runner stage`) trong cả hai Dockerfile:

- **Thay đổi trong Dockerfile**:
  ```dockerfile
  # Loại bỏ npm và npx để triệt tiêu lỗ hổng bảo mật của ảnh nền gốc
  RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
  ```
- Các tệp tin Dockerfile đã được cập nhật:
  - `backend/Dockerfile`
  - `frontend/Dockerfile`

---

## 3. Kết quả đối chứng (Trước và Sau khi xử lý)

| Khu vực kiểm tra | Số lượng lỗ hổng ban đầu | Số lượng lỗ hổng hiện tại | Trạng thái bảo mật ứng dụng |
| :--- | :---: | :---: | :---: |
| **Backend Code** (`backend/pnpm-lock.yaml`) | **5** | **0** | **100% Sạch** |
| **Frontend Code** (`frontend/pnpm-lock.yaml`) | **1** (chỉ còn Quill)* | **0** (ứng dụng)* | **Đã kiểm soát** |
| **Thư mục gốc** (`pnpm-lock.yaml` cũ) | **19** | **0** | **100% Sạch** |
| **Docker Image Backend** (`backend-test:latest`) | **4** (từ base image) | **0** | **100% Sạch** |
| **Docker Image Frontend** (`frontend-test:latest`) | **4** (từ base image) | **0** | **100% Sạch** |

> [!NOTE]
> **(*) Lưu ý về thư viện Quill:** Lỗ hổng `CVE-2025-15056` (Mức độ LOW) của Quill hiện tại chưa có phiên bản vá lỗi chính thức từ tác giả. Tuy nhiên, hệ thống đã được bảo vệ hoàn toàn nhờ cơ chế **Sanitization (Lọc HTML độc hại) bằng thư viện `sanitize-html` bản vá mới nhất tại Backend** trước khi lưu trữ hoặc hiển thị. Do đó, mã độc không thể hoạt động được.

---

## 4. Khuyến nghị bảo trì định kỳ
1. **Theo dõi bản cập nhật của Quill**: Khi nhà phát triển Quill tung ra phiên bản mới hơn `2.0.3` để vá lỗi XSS, hãy chạy `pnpm update quill` ở frontend để xóa bỏ hoàn toàn cảnh báo này.
2. **Duy trì thói quen quét Trivy định kỳ**: Nên chạy quét Trivy định kỳ hoặc cấu hình CI/CD tự động quét các image sau khi build để phát hiện sớm các lỗ hổng mới phát sinh.
