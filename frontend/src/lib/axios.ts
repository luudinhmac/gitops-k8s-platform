import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: isServer 
    ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here (e.g., redirect to login on 401)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Avoid redirecting if already on login page
      if (!window.location.pathname.includes('/login')) {
        // window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
