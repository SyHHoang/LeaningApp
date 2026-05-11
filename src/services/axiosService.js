import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => { return response; },
  async (error) => {
    const originalRequest = error.config;
    console.log("error trong axios",error.response)
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;//tạo thuộc tính _retry  trong configđể tránh vòng lặp vô hạn nếu refresh token cũng hết hạn hoặc có lỗi khác

      try {
        // withCredentials tự gửi refreshToken cookie lên backend
        //không dùng axiosInstance vì có interceptor
        //nếu gọi api refresh mà cái đó bị lỗi thì nó sẽ lặp vô hạn
        //đó là nếu giả sử  BE trả về các lỗi sau cho mọi route error.response?.status === 401 &&error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry
        await axios.post(
          `${axiosInstance.defaults.baseURL}/refreshToken`,
          {},
          {    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true, }
        );

        // Retry request gốc, browser tự gắn accessToken cookie mới
        //gọi lại requeest cũ (gửi accessToken) với config mới
        //không dùng.get,.post nữa là vì trong config mới này đã có rồi
        //dùng axiosInsstance thay vì axios vì có intercepter
        return axiosInstance(originalRequest);//gửi config mới có thêm thuộc tính retry để tránh lặp

      } catch (err) {
        console.log("err",err)
        window.location.href = 'auth/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
