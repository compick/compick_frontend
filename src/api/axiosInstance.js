import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // API 기본 URL을 설정합니다.
    timeout: 10000, // 요청 타임아웃을 10초로 설정합니다.
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가하는 로직 (필요시)
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리 로직 (필요시)
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // 예: 401 Unauthorized 에러 시 로그인 페이지로 리디렉션
        if (error.response && error.response.status === 401) {
            // window.location = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
