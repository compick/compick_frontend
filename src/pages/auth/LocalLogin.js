// src/pages/LocalLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/Cookie";
import { apiJson } from "../../api/apiClient";

export default function LocalLogin() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // 서버가 { code:200, data: "<accessToken>" } 형태로 응답한다고 가정
      const data = await apiJson("/api/user/login/normal", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (data.code === 200 && data.data?.accessToken) {
        setCookie("jwt", data.data.accessToken, 3600); // 1시간 유효 예시
        alert("로그인 성공");
        navigate("/", { replace: true });
      } else {
        alert("로그인 실패: " + (data.message || "알 수 없는 오류"));
      }
    } catch (err) {
      alert("오류 발생: " + (err.message || "NETWORK_ERROR"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <span>계정 로그인</span>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button type="submit" disabled={busy}>
            {busy ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <button
          className="kakaoButton"
          onClick={() => navigate("/login/kakao")}
          disabled={busy}
        >
          카카오 로그인
        </button>

        <div className="container or">
          <div className="shortLine" />
          <span> 또는 </span>
          <div className="shortLine" />
        </div>

        
        <button
          className="registerButton"
          onClick={() => navigate("/signup")}
          disabled={busy}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
