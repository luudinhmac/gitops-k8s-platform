# ⚡ Performance Testing Strategy (k6 Load Testing)

Tài liệu này đặc tả quy trình kiểm thử hiệu năng (Load Testing) và đo độ chịu tải của hệ thống API Backend và Frontend sử dụng công cụ **k6**.

---

## 1. Mục tiêu kiểm thử hiệu năng
*   Xác định giới hạn tải (Break Point) của hệ thống API dưới tải trọng lớn.
*   Xác nhận cơ chế tự động co giãn Horizontal Pod Autoscaler (HPA) hoạt động đúng thiết kế khi CPU vượt ngưỡng 80%.
*   Đo đạc độ trễ phản hồi (Response Latency) p95, p99 để tối ưu hóa code và connection pool.

---

## 2. Kịch bản kiểm thử mẫu với k6 (`load-test.js`)

Dưới đây là một kịch bản kiểm thử giả lập tăng dần lượng người dùng đồng thời (virtual users - VUs) truy cập vào API đọc danh sách bài viết:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp-up từ 0 lên 50 user đồng thời trong 1 phút
    { duration: '3m', target: 50 },  // Duy trì tải trọng 50 user trong 3 phút
    { duration: '1m', target: 100 }, // Đẩy tải lên 100 user (Stress Test)
    { duration: '2m', target: 100 }, // Duy trì 100 user
    { duration: '1m', target: 0 },   // Ramp-down về 0 user
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Tỷ lệ request lỗi phải nhỏ hơn 1%
    http_req_duration: ['p(95)<500'], // 95% request phải phản hồi trong thời gian < 500ms
  },
};

export default function () {
  const url = 'https://api.luumac.io.vn/api/v1/posts';
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const res = http.get(url, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has posts': (r) => r.json().hasOwnProperty('data'),
  });
  
  sleep(1); // Mỗi user chờ 1 giây trước khi thực hiện request tiếp theo
}
```

---

## 3. Quy trình thực thi kiểm thử

### Bước 1: Cài đặt k6 cục bộ
*   Windows: `winget install grafana.k6`
*   macOS: `brew install k6`

### Bước 2: Chạy kiểm thử
Thực thi lệnh k6 chạy kịch bản:
```bash
k6 run load-test.js
```

### Bước 3: Giám sát Hệ thống trong lúc Test
Trong quá trình chạy k6, mở Grafana Dashboard để giám sát:
*   Mức sử dụng tài nguyên CPU/RAM của các Pod Backend.
*   Trạng thái co giãn số lượng Pod của HPA:
    ```bash
    kubectl get hpa -n production -w
    ```
*   Độ trễ truy vấn database trên PostgreSQL.
