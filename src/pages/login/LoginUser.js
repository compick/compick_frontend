export default function LoginUser(){

    return(
        <div className="loginContainer">
            <div className="loginBox">
                <span>계정 로그인</span>
                <input type="text" placeholder="아이디"/>
                <input type="password" placeholder="비밀번호"/>
                <button>로그인</button>
                <span>비밀번호 찾기</span>
                    <div className="container or">
                    <div className="shortLine"/>
                    <span> 또는 </span>
                    <div className="shortLine"/>
                </div>

                <span> 로그인 api 추가</span>
            </div>
        </div>
    )
}