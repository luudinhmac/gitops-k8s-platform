# 🧪 Smoke Test Strategy & Orchestration

Tài liệu này chi tiết hóa chiến lược smoke test tự động hóa được tích hợp vào pipeline CI/CD (GitLab Runner) sau khi mã nguồn được ArgoCD triển khai thành công lên cụm Kubernetes.

---

## 1. Vai trò của Smoke Test
Smoke Test đóng vai trò là chốt chặn cuối cùng (post-deployment verification) nhằm đảm bảo:
*   Các dịch vụ Core API phản hồi đúng thiết kế.
*   Cơ sở dữ liệu kết nối thành công và có thể đọc/ghi dữ liệu.
*   Hệ thống xác thực và phân quyền (JWT, Super Admin role) hoạt động ổn định.
*   Không xảy ra hiện tượng kẹt luồng (pipeline hang) nhờ thiết lập network timeout.

---

## 2. Nội dung Script `smoke_test.sh`

Dưới đây là toàn bộ mã nguồn script smoke test được cấu hình tại [backend/.gitlab-ci/smoke_test.sh](file:///d:/DATA/Portfolio/backend/.gitlab-ci/smoke_test.sh):

```bash
#!/bin/sh
# CI/CD Smoke Test Script
# Last Updated: 2026-06-27
set -e

URL=$1
ENV=$2

# Configure standard timeouts for curl
CURL_TIMEOUTS="--connect-timeout 5 --max-time 15"

echo "========================================================="
echo "STARTING SMOKE TEST FOR ENV: $ENV ON URL: $URL"
echo "========================================================="

# 1. Health check
echo "Step 1: Checking health endpoint..."
HEALTH_RESP=$(curl -s $CURL_TIMEOUTS "${URL}/api/v1/health")
echo "Health Response: $HEALTH_RESP"
STATUS=$(echo "$HEALTH_RESP" | jq -r '.status' 2>/dev/null || true)
DATABASE=$(echo "$HEALTH_RESP" | jq -r '.database' 2>/dev/null || true)

if [ "$STATUS" != "ok" ] || [ "$DATABASE" != "connected" ]; then
    echo "Health check failed!"
    exit 1
fi
echo "Health check passed!"

# 2. Get Public Core Endpoint (Categories)
echo "Step 2: Checking public categories endpoint..."
CATEGORIES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $CURL_TIMEOUTS "${URL}/api/v1/categories")
if [ "$CATEGORIES_STATUS" -ne 200 ]; then
    echo "Failed to fetch categories. Status code: $CATEGORIES_STATUS"
    exit 1
fi
echo "Public categories endpoint passed!"

# 3. Read Query Tests (Posts & Parameters)
echo "Step 3: Running read query tests on posts..."
POSTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $CURL_TIMEOUTS "${URL}/api/v1/posts")
if [ "$POSTS_STATUS" -ne 200 ]; then
    echo "Failed to fetch posts. Status code: $POSTS_STATUS"
    exit 1
fi

POSTS_QUERY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $CURL_TIMEOUTS "${URL}/api/v1/posts?q=smoke&limit=5&page=1&sort=createdAt:desc")
if [ "$POSTS_QUERY_STATUS" -ne 200 ]; then
    echo "Failed to fetch posts with query parameters. Status code: $POSTS_QUERY_STATUS"
    exit 1
fi
echo "Public posts read queries passed!"

# 4. Check Authenticated Endpoint without Token (should be 401)
echo "Step 4: Checking profile endpoint without authorization header..."
PROFILE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $CURL_TIMEOUTS "${URL}/api/v1/auth/profile")
if [ "$PROFILE_STATUS" -ne 401 ]; then
    echo "Expected 401 Unauthorized for unauthenticated profile access, but got: $PROFILE_STATUS"
    exit 1
fi
echo "Unauthenticated access check passed!"

# 5. Staging-only Login, Write, and Cleanup Flow (to prevent database pollution in production)
if [ "$ENV" = "staging" ]; then
    RANDOM_ID=$(date +%s)
    TEST_USER="smoke_${RANDOM_ID}"
    TEST_EMAIL="smoke_${RANDOM_ID}@example.com"
    TEST_PASS="TestPass123"

    echo "Step 5: [Staging-only] Registering test user: $TEST_USER"
    REG_RESP=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      $CURL_TIMEOUTS \
      -d "{\"username\":\"$TEST_USER\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}" \
      "${URL}/api/v1/auth/register")
      
    REG_USER=$(echo "$REG_RESP" | jq -r '.username' 2>/dev/null || true)
    REG_USER_ID=$(echo "$REG_RESP" | jq -r '.id' 2>/dev/null || true)
    
    if [ "$REG_USER" != "$TEST_USER" ] || [ -z "$REG_USER_ID" ] || [ "$REG_USER_ID" = "null" ]; then
        echo "Registration failed! Response: $REG_RESP"
        exit 1
    fi
    echo "Registration successful! User ID: $REG_USER_ID"

    echo "Step 6: [Staging-only] Logging in test user..."
    LOGIN_RESP=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      $CURL_TIMEOUTS \
      -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}" \
      "${URL}/api/v1/auth/login")
      
    TOKEN=$(echo "$LOGIN_RESP" | jq -r '.token' 2>/dev/null || true)
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        echo "Login failed! Response: $LOGIN_RESP"
        exit 1
    fi
    echo "Login successful! Token acquired."

    echo "Step 7: [Staging-only] Fetching profile with token..."
    PROFILE_RESP=$(curl -s -X GET \
      -H "Authorization: Bearer $TOKEN" \
      $CURL_TIMEOUTS \
      "${URL}/api/v1/auth/profile")
      
    PROFILE_SUCCESS=$(echo "$PROFILE_RESP" | jq -r '.success' 2>/dev/null || true)
    PROFILE_USERNAME=$(echo "$PROFILE_RESP" | jq -r '.user.username' 2>/dev/null || true)
    
    if [ "$PROFILE_SUCCESS" != "true" ] || [ "$PROFILE_USERNAME" != "$TEST_USER" ]; then
        echo "Authenticated profile fetch failed! Response: $PROFILE_RESP"
        exit 1
    fi
    echo "Authenticated profile check passed!"

    # Cleanup test user
    if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
        echo "Step 8: [Staging-only] Logging in as Admin to clean up test user..."
        ADMIN_LOGIN_RESP=$(curl -s -X POST \
          -H "Content-Type: application/json" \
          $CURL_TIMEOUTS \
          -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" \
          "${URL}/api/v1/auth/login")
        
        ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESP" | jq -r '.token' 2>/dev/null || true)
        if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
            echo "Step 9: [Staging-only] Deleting test user with ID: $REG_USER_ID..."
            DELETE_RESP=$(curl -s -X DELETE \
              -H "Authorization: Bearer $ADMIN_TOKEN" \
              $CURL_TIMEOUTS \
              "${URL}/api/v1/users/$REG_USER_ID")
            DELETE_SUCCESS=$(echo "$DELETE_RESP" | jq -r '.success' 2>/dev/null || true)
            if [ "$DELETE_SUCCESS" = "true" ]; then
                echo "Test user deleted successfully!"
            else
                echo "Failed to delete test user. Response: $DELETE_RESP"
            fi
        else
            echo "Could not log in as Admin for cleanup (Token: $ADMIN_TOKEN)."
        fi
    else
        echo "ADMIN_USERNAME or ADMIN_PASSWORD environment variable is not set. Skipping test user cleanup to prevent credential exposure."
    fi
fi

echo "========================================================="
echo "ALL SMOKE TESTS PASSED SUCCESSFULLY!"
echo "========================================================="
```

---

## 3. Phân Tích Chi Tiết Từng Bước Kiểm Thử

### Bước 1: Kiểm tra trạng thái sức khỏe (Health Check)
*   **Địa chỉ gọi**: `${URL}/api/v1/health`
*   **Mục tiêu**: Đảm bảo cổng dịch vụ Backend đã sẵn sàng và cơ sở dữ liệu đã kết nối thành công.
*   **Chi tiết logic**: Phân tích phản hồi JSON bằng `jq`, xác nhận `.status == "ok"` và `.database == "connected"`. Nếu cơ sở dữ liệu bị ngắt kết nối (ví dụ: DB sập hoặc sai cấu hình thông tin kết nối), phép kiểm thử sẽ dừng ngay lập tức.

### Bước 2: Truy xuất danh mục danh sách công khai (Public Categories Check)
*   **Địa chỉ gọi**: `${URL}/api/v1/categories`
*   **Mục tiêu**: Xác nhận Endpoint công khai chính hoạt động tốt, trả về mã trạng thái HTTP `200`.

### Bước 3: Đọc và Truy vấn Dữ liệu (Read Query Tests - Posts)
*   **Địa chỉ gọi**: 
    1. `${URL}/api/v1/posts`
    2. `${URL}/api/v1/posts?q=smoke&limit=5&page=1&sort=createdAt:desc`
*   **Mục tiêu**: Kiểm tra không chỉ khả năng lấy dữ liệu mà còn kiểm chứng các thành phần logic như tìm kiếm văn bản (`q`), phân trang (`limit`/`page`), và sắp xếp kết quả (`sort`). Điều này phát hiện sớm các lỗi cú pháp SQL phát sinh từ tầng ORM (Prisma).

### Bước 4: Kiểm thử Bảo mật Xác thực (Authentication Gate Check)
*   **Địa chỉ gọi**: `${URL}/api/v1/auth/profile` (không kèm Header `Authorization`)
*   **Mục tiêu**: Xác thực cổng kiểm soát JWT hoạt động đúng thiết kế bằng cách kiểm chứng phản hồi HTTP trả về chính xác mã lỗi `401 Unauthorized`.

### Bước 5-9: Kiểm thử Nghiệp vụ Ghi & Tự Động Dọn Dẹp (Chỉ áp dụng trên Staging)
Để tránh làm ô nhiễm cơ sở dữ liệu trên môi trường Production, quy trình ghi dữ liệu (Tạo mới User) được rào chắn chặt chẽ thông qua việc so khớp biến `$ENV`:
*   **Chiến lược ID Ngẫu nhiên (Random ID Strategy)**: Tạo tài khoản test ngẫu nhiên bằng cách sinh ID dạng `smoke_$(date +%s)` giúp các pipeline chạy song song độc lập và không bao giờ xảy ra lỗi trùng lặp dữ liệu (Unique Constraint).
*   **Chu trình Kiểm thử (End-to-End Flow)**: Đăng ký thành công (`Step 5`) -> Đăng nhập lấy Token (`Step 6`) -> Gọi API profile có kèm Token để xác thực phân quyền (`Step 7`).
*   **Bảo mật & Tự động Dọn dẹp (Autoclean)**:
    *   Bảo mật thông tin: Không lưu trữ tài khoản quản trị (Super Admin) trực tiếp trong mã nguồn. 
    *   Hệ thống đọc dữ liệu tài khoản admin qua các biến môi trường được mã hóa của GitLab CI (`ADMIN_USERNAME`/`ADMIN_PASSWORD`).
    *   Sau khi quy trình test hoàn tất, script đăng nhập bằng tài khoản Admin để lấy token (`Step 8`), thực hiện xóa bỏ chính xác tài khoản test vừa tạo bằng ID (`Step 9`), đảm bảo cơ sở dữ liệu Staging luôn sạch sẽ.
