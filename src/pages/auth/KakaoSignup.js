// src/pages/KakaoSignup.jsx
import React, { useState, useCallback } from "react";
import { API_BASE } from "../../config";
import { page, card, kakaoStyle, plain } from "../../components/ui";

export default function KakaoSignup() {
  const [busy, setBusy] = useState(false);

  const go = useCallback(() => {
    if (busy) return;
    setBusy(true);
    // OAuth 시작: 백엔드로 리다이렉트
    window.location.replace("/api/auth/signup/kakao");
  }, [busy]);

  return (
    <div
      className={page}
      style={{
        background: "#f9fafb",
        fontFamily:
          "system-ui, Segoe UI, Roboto, Apple SD Gothic Neo, Malgun Gothic, sans-serif",
      }}
    >
      <div style={card}>
        <h1 style={{ margin: "0 0 8px" }}>카카오 회원가입</h1>
        <ul style={{ color: "#374151", margin: "0 0 16px 18px" }}>
          <li>카카오 인증 후 우리 DB에 없으면 자동 가입됩니다.</li>
          <li>이미 연동되어 있으면 로그인 처리됩니다.</li>
        </ul>

        <button
          type="button"
          style={{ ...kakaoStyle, opacity: busy ? 0.8 : 1, cursor: busy ? "not-allowed" : "pointer" }}
          onClick={go}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "카카오로 이동 중..." : "카카오로 회원가입하기"}
        </button>

        <div style={{ marginTop: 12 }}>
          <a style={plain} href="/signup">뒤로</a>
        </div>
      </div>
    </div>
  );
}
