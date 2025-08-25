// src/pages/auth/KakaoSignup.jsx
import { API_BASE } from "../../config";
import { page, card, kakaoStyle, plain } from "../../components/ui";

export default function KakaoSignup() {
  const go = () => { window.location.href = `${API_BASE}/api/auth/kakao/login`; };
  return (
    <div className={page} style={{ background: "#f9fafb", fontFamily: "system-ui, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif" }}>
      <div style={card}>
        <h1 style={{ margin: "0 0 8px" }}>카카오 회원가입</h1>
        <ul style={{ color: "#374151", margin: "0 0 16px 18px" }}>
          <li>카카오 인증 후 우리 DB에 없으면 자동 가입됩니다.</li>
          <li>있으면 로그인 처리됩니다.</li>
        </ul>
        <button style={kakaoStyle} onClick={go}>카카오로 회원가입하기</button>
        <div style={{ marginTop: 12 }}>
          <a style={plain} href="/auth/select-signup">← 뒤로</a>
        </div>
      </div>
    </div>
  );
}
