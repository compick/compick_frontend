import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { page, card, kakaoStyle, plain } from "../../components/ui";

export default function SelectLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const handledRef = useRef(false);

    useEffect(() => {
        const qs = new URLSearchParams(location.search);
        const code = qs.get("code");
        const data = qs.get("data");
        if (!code || handledRef.current) return;
        handledRef.current = true;

        if (code === "200") {
            alert("회원가입이 완료되었습니다. 로그인 해주세요!");
            // URL에서 쿼리 제거 (뒤로가기 시 재등장 방지)
            navigate(location.pathname, { replace: true });
        }else if(code === "500"){

        }else{

        }
    }, [location.search, location.pathname, navigate])

    return (
        <div className={page} style={{ fontFamily: "system-ui, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif" }}>
            <div style={card}>
                <h1 style={{ fontSize: 20, margin: "0 0 16px" }}>로그인 방법 선택</h1>
                <a style={kakaoStyle} href="/login/kakao">카카오 로그인하기</a>
                <a style={plain} href="/login/local">일반로그인하기</a>
            </div>
        </div>
    );
}