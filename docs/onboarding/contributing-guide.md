# 🤝 Contributing & Git Workflow Guide

Tài liệu này đặc tả quy trình đóng góp mã nguồn (Contributing Guidelines) và các quy tắc quản trị Git (Git Rules) áp dụng thống nhất trong toàn bộ dự án.

---

## 1. Quy tắc đặt tên Nhánh (Branch Naming Conventions)

Mọi nhánh làm việc mới bắt buộc phải được tạo từ nhánh `dev` (cho Staging) và tuân thủ định dạng đặt tên sau:

```text
<type>/<jira-ticket-id>-<short-description>
```

### Các tiền tố hợp lệ (`type`):
*   **`feat/`**: Phát triển tính năng mới (ví dụ: `feat/categories-tree-logic`).
*   **`fix/`**: Sửa lỗi mã nguồn (ví dụ: `fix/auth-cookie-expiry`).
*   **`hotfix/`**: Sửa lỗi khẩn cấp trực tiếp trên production (tạo từ nhánh `main`).
*   **`refactor/`**: Tái cấu trúc mã nguồn mà không thay đổi tính năng.
*   **`docs/`**: Cập nhật hoặc bổ sung tài liệu.
*   **`ci/`**: Thay đổi cấu hình pipeline hoặc kịch bản deploy.

---

## 2. Quy chuẩn thông điệp Commit (Conventional Commits)

Chúng tôi áp dụng chuẩn **Conventional Commits** để tự động hóa việc tạo changelog và theo dõi lịch sử commit rõ ràng:

```text
<type>(<scope>): <subject>

[optional body]
```

### 2.1. Các loại commit chính (`type`):
*   **`feat`**: Một tính năng mới cho người dùng.
*   **`fix`**: Sửa lỗi cho ứng dụng.
*   **`docs`**: Chỉ thay đổi tài liệu.
*   **`style`**: Thay đổi format code (whitespace, semi-colons) không ảnh hưởng logic.
*   **`refactor`**: Thay đổi mã nguồn cải tiến cấu trúc nhưng không fix bug hay thêm feature.
*   **`test`**: Thêm mới hoặc sửa đổi các bộ test.
*   **`chore`**: Các thay đổi phụ trợ cho việc build, quản trị thư viện (ví dụ: update `.gitignore`).

### 2.2. Ví dụ commit đúng chuẩn:
```text
feat(auth): implement jwt token generation on login

Adds jsonwebtoken signing logic in AuthenticationService and returns
an access token to the client on successful verification.
```

---

## 3. Quy trình làm việc với Pull Request (PR / Merge Request)

1.  **Đồng bộ local**: Luôn rebase code của bạn với nhánh `dev` mới nhất trước khi đẩy lên remote.
2.  **Chạy kiểm tra local**: Đảm bảo dự án build thành công và không có lỗi ESLint ở máy local cá nhân:
    ```bash
    pnpm lint
    pnpm build
    ```
3.  **Tạo Merge Request**: Tạo MR trên GitLab hướng về nhánh đích `dev`.
4.  **Tự động kiểm tra**: GitLab CI sẽ tự động chạy các job Lint, Test, Security Scan. Nếu pipeline báo thất bại, MR sẽ **không được phép gộp (merge)**.
5.  **Review Code**: MR cần có ít nhất 1 sự phê duyệt (approve) từ các thành viên khác trong team trước khi được gộp.
