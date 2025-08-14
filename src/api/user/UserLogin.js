import api from '../ApiSetting';
// 로그인
export const UserLogin = (formData) => {
    const tt = api.post('/user/login', formData );
    tt.then(res => {
        console.log(res);
    })    
    return tt;
};

// 로그인 상태 확인
export const userLoginCheck = () => {
    return api.get("/user/status"); 
};

//로그아웃
export const userLogout = () => {
    return api.post("/user/logout ",{
     path: window.location.pathname,
    });
};
//회원가입
export const userRegist = (formData) => {
    console.log(formData);
    return api.post('/user/register',JSON.stringify(formData),);
}