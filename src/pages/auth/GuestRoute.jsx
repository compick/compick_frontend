// GuestRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/Cookie";
import { API_BASE } from "../../config";

export default function GuestRoute({ children }) {
  const nav = useNavigate();
  useEffect(() => {
    const t = getCookie("jwt");
    if (!t) return; // 토큰 없으면 그대로 진입
    fetch(`${API_BASE}/api/user/info`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (d?.code === 200) nav("/", { replace: true }); })
      .catch(() => {}); // 토큰이 invalid면 그대로 로그인 페이지에 머물기
  }, [nav]);
  return children;
}
