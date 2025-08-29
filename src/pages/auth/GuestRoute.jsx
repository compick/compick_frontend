// GuestRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/Cookie";
import { apiJson } from "../../api/apiClient";

export default function GuestRoute({ children }) {
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const at = getCookie("jwt");
    if (!at) return; // 토큰 없으면 게스트 페이지 그대로

    (async () => {
      try {
        // apiJson → AT 자동첨부, 401/만료 시 내부에서 refresh 후 재시도
        const d = await apiJson("/api/user/info");
        if (!cancelled && d?.code === 200) {
          alert("로그아웃시 사용가능!!");
          nav("/", { replace: true }); // 이미 로그인 상태 → 홈으로
        }
      } catch {
        // INVALID_TOKEN, 네트워크 오류 등 → 그대로 게스트 페이지 유지
      }
    })();

    return () => { cancelled = true; };
  }, [nav]);

  return children;
}
