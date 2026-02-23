    import axios from 'axios';
    import { TokenService } from '@/services/tokenService.js';
    const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
    });
// Request Interceptor
//lấy token và gửi vào header
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {//nếu dữ liệu gửi đi dạng formdata thì xóa header
      delete config.headers['Content-Type']
    }
    const token = TokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
//bắt lỗi API dựa vào response trả về từ backend
axiosInstance.interceptors.response.use(
    (response) => {
    const {token} = response.data || {};
    console.log('token là',token)
    if (token &&response.config.url.includes('/auth/login')) {
      TokenService.setToken(token)
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Xử lý refresh token nếu cần
      console.error('Unauthorized');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance
