import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: isServer 
    ? (process.env.INTERNAL_API_URL || (process.env.NODE_ENV === 'production' ? 'http://backend:3001/api' : 'http://localhost:3001/api'))
    : '/api',
  withCredentials: true,
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors (Backend Offline)
    if (!error.response) {
      console.error('[Axios] Network Error - Backend might be offline');
      return Promise.reject({
        message: 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối.',
        code: 'SERVICE_UNAVAILABLE',
        isOffline: true
      });
    }

    // Handle 500 errors from Next.js Proxy (often happens when backend is down)
    if (error.response?.status === 500) {
      console.warn('[Axios] Received 500 error - Backend might be unreachable via proxy');
      return Promise.reject({
        ...error,
        message: 'Máy chủ đang tạm thời gián đoạn. Vui lòng thử lại sau.',
        isOffline: true
      });
    }

    // Handle Timeouts
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Kết nối quá hạn. Máy chủ đang bận.',
        code: 'TIMEOUT',
        isOffline: true
      });
    }

    // Global errors handling (e.g., redirect to login on 401)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!window.location.pathname.includes('/login')) {
        // Optional: window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
