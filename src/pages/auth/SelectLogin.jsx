import { page, card, kakaoStyle, plain } from "../../components/ui";

export default function SelectLogin(){
    return (
        <div className={page} style={{ background: "#f8fafc", fontFamily: "system-ui, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif" }}>
            <div style={card}>
                <h1 style={{fontSize: 20, margin: "0 0 16px"}}>로그인 방법 선택</h1>
                <a style={kakaoStyle} href="/login/kakao">카카오 로그인하기</a>
                <a style={plain} href="/login/local">일반로그인하기</a>
            </div>
        </div>
    );
}