// src/pages/KakaoResult.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/Cookie"; // SameSite=Lax; Secure 권장

export default function KakaoResult() {
  const nav = useNavigate();
  const loc = useLocation();
  const [msg, setMsg] = useState("로그인 처리 중...");

  useEffect(() => {
    const hash = loc.hash || "";
    const search = loc.search || "";
    const token = new URLSearchParams(hash.replace(/^#/, "")).get("token");
    const code  = new URLSearchParams(search).get("code"); // 백엔드가 붙여준 코드

    const done = (path) => nav(path, { replace: true });

    if (code === "200" && token) {
      setCookie("jwt", token, 3600); // AT 쿠키 저장
      // URL 정리 후 홈으로
      window.history.replaceState(null, "", "/");
      done("/");
    } else {
      setMsg("로그인 실패 또는 취소되었습니다.");
      // 필요하면 실패사유 쿼리로 전달
      setTimeout(() => done("/signup?error=oauth_failed"), 800);
    }
  }, [loc, nav]);

  return <div style={{padding:24}}> {msg} </div>;
}
