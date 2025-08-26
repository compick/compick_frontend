import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // API 기본 URL을 설정합니다.
    timeout: 3000, // 타임아웃을 10초로 증가
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
        
        // 디버깅을 위해 요청 정보 출력
        console.log('=== REQUEST DEBUG ===');
        console.log('Full URL:', config.baseURL + config.url);
        console.log('Method:', config.method?.toUpperCase());
        console.log('Headers:', config.headers);
        console.log('Params:', config.params);
        console.log('Data:', config.data);
        console.log('====================');
        
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리 로직 (필요시)
axiosInstance.interceptors.response.use(
    response => {
        console.log('=== RESPONSE DEBUG ===');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.log('=====================');
        return response;
    },
    error => {
        console.error('=== ERROR DEBUG ===');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
        console.error('Config:', error.config);
        console.error('===================');
        
        // 예: 401 Unauthorized 에러 시 로그인 페이지로 리디렉션
        if (error.response && error.response.status === 401) {
            // window.location = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
