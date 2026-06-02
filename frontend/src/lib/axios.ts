import axios from 'axios';

const isServer = typeof window === 'undefined';

const getBaseURL = () => {
  if (!isServer) return '/api/v1';

  const internalUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001';
  
  // Xử lý chuỗi URL an toàn, tránh lỗi trùng lặp chữ 'api' hoặc 'v1' ở domain
  let cleanUrl = internalUrl.replace(/\/$/, '');
  
  if (!cleanUrl.endsWith('/api/v1')) {
    if (cleanUrl.endsWith('/api')) {
      cleanUrl = `${cleanUrl}/v1`;
    } else {
      cleanUrl = `${cleanUrl}/api/v1`;
    }
  }
  
  return cleanUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  // 10s cho Production để cân tải SSR/Upload, 5s cho Development để fail-fast
  timeout: process.env.NODE_ENV === 'production' ? 10000 : 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor: Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // CHẶNG 1: Kiểm tra kết nối Internet của thiết bị (Chỉ ở Client)
    if (!isServer && typeof navigator !== 'undefined' && !navigator.onLine) {
      error.isOffline = true;
      error.customMessage = 'Thiết bị của bạn đã mất kết nối Internet. Vui lòng kiểm tra lại.';
      error.customCode = 'NO_INTERNET';
      return Promise.reject(error);
    }

    // CHẶNG 2: Kiểm tra lỗi Quá hạn kết nối (Timeout)
    // Phải đặt TRƯỚC khi check !error.response vì Timeout không có response
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.isOffline = true;
      error.customMessage = 'Kết nối quá hạn. Máy chủ đang bận hoặc phản hồi chậm.';
      error.customCode = 'TIMEOUT';
      return Promise.reject(error);
    }

    // CHẶNG 3: Kiểm tra lỗi sập mạng nội bộ / Backend chết hẳn (Không có phản hồi)
    if (!error.response) {
      console.error('[Axios] Network Error - Backend might be offline');
      error.isOffline = true;
      error.customMessage = 'Không thể kết nối tới máy chủ. Vui lòng thử lại sau.';
      error.customCode = 'SERVICE_UNAVAILABLE';
      return Promise.reject(error);
    }

    // CHẶNG 4: Xử lý các mã lỗi HTTP cụ thể từ Server (Có phản hồi)
    const status = error.response.status;

    // Phân biệt lỗi sập Gateway hệ thống (502, 503, 504) và lỗi Bug code Backend (500)
    if (status === 502 || status === 503 || status === 504) {
      error.isOffline = true;
      error.customMessage = 'Hệ thống đang bảo trì hoặc tạm thời gián đoạn. Vui lòng quay lại sau.';
      error.customCode = `SERVER_GATEWAY_ERROR_${status}`;
    } 
    else if (status === 500) {
      error.isOffline = false; // Backend vẫn sống, chỉ là xử lý request bị crash
      error.customMessage = 'Đã có lỗi xảy ra phía máy chủ (Internal Server Error).';
      error.customCode = 'INTERNAL_SERVER_ERROR';
    } 
    else if (status === 401) {
      error.customMessage = 'Phiên đăng nhập đã hết hạn.';
      error.customCode = 'UNAUTHORIZED';
      
      // Điều hướng về Login nếu ở Client và không phải đang ở trang Login
      if (!isServer && !window.location.pathname.includes('/login')) {
        // window.location.href = '/login';
      }
    } 
    else {
      // Các lỗi Client-error khác (400, 403, 404,...) lấy message từ Backend trả về nếu có
      error.customMessage = error.response.data?.message || 'Yêu cầu không hợp lệ.';
      error.customCode = `HTTP_ERROR_${status}`;
    }

    // Trả về error gốc đã được bồi thêm các thuộc tính custom giúp giữ nguyên Stack Trace để debug
    return Promise.reject(error);
  }
);

export default api;

