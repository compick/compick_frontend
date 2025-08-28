import { useEffect} from "react";
import { page, card, kakaoStyle, plain } from "../../components/ui";

export default function SelectSignup() {

    return (
        <div className={page} style={{ background: "#f8fafc", fontFamily: "system-ui, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif" }}>
            <div style={card}>
                <h1 style={{ fontSize: 20, margin: "0 0 16px" }}>회원가입 방법 선택</h1>
                <a style={kakaoStyle} href="/signup/kakao">카카오 회원가입하기</a>
                <a style={plain} href="/signup/local">일반 회원가입하기</a>
            </div>

        </div>
    );
}