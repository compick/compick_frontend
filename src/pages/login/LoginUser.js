import { useNavigate } from 'react-router-dom';

export default function LoginUser({ onLogin }){
    const navigate = useNavigate();

    const handleLoginClick = () => {
        // 추후 여기에 실제 로그인 API 연동 로직 추가
        // 예: loginApi(id, pw).then(response => { ... })
        
        // 로그인 성공 시
        onLogin();
        navigate('/'); // 홈으로 이동
    };

    return(
        <div className="loginContainer">
            <div className="loginBox">
                <span>계정 로그인</span>
                <input type="text" placeholder="아이디"/>
                <input type="password" placeholder="비밀번호"/>
                <button onClick={handleLoginClick}>로그인</button>
                <span>비밀번호 찾기</span>
                    <div className="container or">
                    <div className="shortLine"/>
                    <span> 또는 </span>
                    <div className="shortLine"/>
                </div>
                <button className="registerButton" onClick={() => navigate('/regist')}>회원가입</button>
            </div>
        </div>
    )
}