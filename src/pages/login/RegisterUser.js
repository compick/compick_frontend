import React, { useState } from "react";

export default function RegisterUser() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
    userName: "",
    phone: "",
    email: ""
  });

  const [idCheck, setIdCheck] = useState({ done: false, available: null, msg: "" });
  const [emailState, setEmailState] = useState({
    sending: false,
    sent: false,
    verifying: false,
    verified: false,
    code: "",
    msg: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "userId") setIdCheck({ done: false, available: null, msg: "" });
    if (name === "email") setEmailState((s) => ({ ...s, sent: false, verified: false, code: "", msg: "" }));
  };

  const checkUserId = async () => {
    if (!form.userId.trim()) return alert("아이디를 입력하세요.");
    try {
      const res = await fetch(
        `/api/user/check/userid?userId=${encodeURIComponent(form.userId)}`,
        {
          method: "GET",
          credentials: "include"
        });
      const data = await res.json();
      if (data.available) {
        setIdCheck({ done: true, available: true, msg: "✅ 사용 가능한 아이디입니다." });
      } else {
        setIdCheck({ done: true, available: false, msg: "🚫 이미 사용 중인 아이디입니다." });
      }
    } catch (e) {
      setIdCheck({ done: true, available: false, msg: "오류가 발생했습니다." });
    }
  };

  const sendEmailCode = async () => {
    if (!form.email.trim()) return alert("이메일을 입력하세요.");
    setEmailState((s) => ({ ...s, sending: true, msg: "" }));
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(form.email)}`
      });
      const data = await res.json();
      if (data.success !== false) {
        setEmailState((s) => ({ ...s, sending: false, sent: true, msg: "인증코드를 전송했어요." }));
      } else {
        setEmailState((s) => ({ ...s, sending: false, sent: false, msg: data.msg || "전송 실패" }));
      }
    } catch {
      setEmailState((s) => ({ ...s, sending: false, sent: false, msg: "전송 중 오류가 발생했어요." }));
    }
  };

  const verifyEmailCode = async () => {
    if (!emailState.code.trim()) return alert("인증코드를 입력하세요.");
    setEmailState((s) => ({ ...s, verifying: true, msg: "" }));
    try {
      const res = await fetch("/api/auth/email/verify", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: emailState.code })
      });
      const data = await res.json();
      if (data.verified) {
        setEmailState((s) => ({ ...s, verifying: false, verified: true, msg: "✅ 이메일 인증 완료!" }));
      } else {
        setEmailState((s) => ({ ...s, verifying: false, verified: false, msg: data.msg || "인증 실패" }));
      }
    } catch {
      setEmailState((s) => ({ ...s, verifying: false, verified: false, msg: "인증 중 오류가 발생했어요." }));
    }
  };

  const phoneAuth = () => {
    const { IMP } = window;
    IMP.init("imp12345678");
    IMP.certification(
      {
        pg: "inicis",
        merchant_uid: "mid_" + new Date().getTime(),
        m_redirect_url: "/signup/complete",
      },
      function (rsp) {
        if (rsp.success) {
          fetch(`/api/auth/result?imp_uid=${rsp.imp_uid}`)
            .then((res) => res.json())
            .then((data) => {
              setForm((prev) => ({ ...prev, phone: data.phone }));
              alert("✅ 인증 성공: " + data.name);
            });
        } else {
          alert("❌ 인증 실패: " + rsp.error_msg);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCheck.done || !idCheck.available) return alert("아이디 중복확인을 완료하세요.");
    if (!emailState.verified) return alert("이메일 인증을 완료하세요.");

    const res = await fetch("/api/user/regist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert("🎉 회원가입 완료!");
      window.location.href = "/login";
    } else {
      alert("🚫 실패: " + data.msg);
    }
  };

  return (
    <div className="loginContainer">
      <h2 className="signupTitle">회원가입</h2>
      <form className="loginBox" onSubmit={handleSubmit}>
        {/* 아이디 + 중복확인 */}
        <div className="container" style={{ gap: 8, display: "flex" }}>
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={form.userId}
            onChange={handleChange}
            required
          />
          <button type="button" className="authButton" onClick={checkUserId}>
            아이디 중복확인
          </button>
        </div>
        {idCheck.msg && (
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {idCheck.msg}
          </div>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="userName"
          placeholder="이름"
          value={form.userName}
          onChange={handleChange}
          required
        />

        {/* 이메일 + 이메일 인증 버튼 */}
        <div className="container" style={{ gap: 8, display: "flex" }}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            readOnly={emailState.verified}
          />
          <button
            type="button"
            className="authButton"
            onClick={sendEmailCode}
            disabled={emailState.sending || emailState.verified}
          >
            {emailState.verified ? "인증완료" : emailState.sending ? "전송중..." : "이메일 인증"}
          </button>
        </div>

        {/* 이메일 코드 입력란 + 코드확인 버튼 (전송 후 표시, 인증 전까지만) */}
        {emailState.sent && !emailState.verified && (
          <div className="container" style={{ gap: 8, display: "flex", marginTop: 8 }}>
            <input
              type="text"
              name="emailCode"
              placeholder="인증코드 입력"
              value={emailState.code}
              onChange={(e) => setEmailState((s) => ({ ...s, code: e.target.value }))}
            />
            <button
              type="button"
              className="authButton"
              onClick={verifyEmailCode}
              disabled={emailState.verifying}
            >
              {emailState.verifying ? "확인중..." : "코드확인"}
            </button>
          </div>
        )}
        {emailState.msg && (
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {emailState.msg}
          </div>
        )}

        {/* 휴대폰 인증 */}
        <div className="container" style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            name="phone"
            placeholder="휴대폰번호"
            value={form.phone}
            readOnly
            style={{ marginRight: "20px" }}
          />
          <button type="button" className="authButton" onClick={phoneAuth}>
            휴대폰 인증
          </button>
        </div>

        <button type="submit" className="submitButton" style={{ marginTop: 12 }}>
          회원가입
        </button>
      </form>
    </div>
  );
}
