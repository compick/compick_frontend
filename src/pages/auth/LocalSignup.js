// src/pages/LocalSignup.jsx
import React, { useState } from "react";
import { apiJson, apiFetch } from "../../api/apiClient";

export default function LocalSignup() {
  const [form, setForm] = useState({ userId: "", password: "", nickname: "", email: "" });
  const [busy, setBusy] = useState({ id:false, nick:false, send:false, verify:false, submit:false });

  const [idCheck, setIdCheck] = useState({ done:false, available:null, msg:"" });
  const [nickCheck, setNickCheck] = useState({ done:false, available:null, msg:"" });
  const [emailState, setEmailState] = useState({
    sending:false, sent:false, verifying:false, verified:false, code:"", msg:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === "userId") setIdCheck({ done:false, available:null, msg:"" });
    if (name === "nickname") setNickCheck({ done:false, available:null, msg:"" });
    if (name === "email")
      setEmailState((s) => ({ ...s, sent:false, verified:false, code:"", msg:"" }));
  };

  const checkUserId = async () => {
    if (!form.userId.trim()) return alert("아이디를 입력하세요.");
    setBusy((b)=>({ ...b, id:true }));
    try {
      const data = await apiJson(`/api/user/check/userid?userId=${encodeURIComponent(form.userId)}`);
      if (data.code === 200)
        setIdCheck({ done:true, available:true, msg:"✅ 사용 가능한 아이디입니다." });
      else setIdCheck({ done:true, available:false, msg:"🚫 이미 사용 중인 아이디입니다." });
    } catch {
      setIdCheck({ done:true, available:false, msg:"오류가 발생했습니다." });
    } finally {
      setBusy((b)=>({ ...b, id:false }));
    }
  };

  const checkNickname = async () => {
    if (!form.nickname.trim()) return alert("닉네임을 입력하세요.");
    setBusy((b)=>({ ...b, nick:true }));
    try {
      const data = await apiJson(`/api/user/check/nickname?nickname=${encodeURIComponent(form.nickname)}`);
      if (data.code === 200)
        setNickCheck({ done:true, available:true, msg:"✅ 사용 가능한 닉네임입니다." });
      else setNickCheck({ done:true, available:false, msg:"🚫 이미 사용 중인 닉네임입니다." });
    } catch {
      setNickCheck({ done:true, available:false, msg:"닉네임 확인 중 오류가 발생했습니다." });
    } finally {
      setBusy((b)=>({ ...b, nick:false }));
    }
  };

  const sendEmailCode = async () => {
    if (!form.email.trim()) return alert("이메일을 입력하세요.");
    setEmailState((s)=>({ ...s, sending:true, msg:"" }));
    setBusy((b)=>({ ...b, send:true }));
    try {
      // x-www-form-urlencoded는 apiFetch 사용
      const res = await apiFetch(`/api/auth/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(form.email)}`
      });
      const data = await res.json();
      if (res.ok && data.code === 200)
        setEmailState((s)=>({ ...s, sending:false, sent:true, msg:"인증코드를 전송했어요." }));
      else setEmailState((s)=>({ ...s, sending:false, sent:false, msg:"전송 실패" }));
    } catch {
      setEmailState((s)=>({ ...s, sending:false, sent:false, msg:"전송 중 오류가 발생했어요." }));
    } finally {
      setBusy((b)=>({ ...b, send:false }));
    }
  };

  const verifyEmailCode = async () => {
    if (!emailState.code.trim()) return alert("인증코드를 입력하세요.");
    setEmailState((s)=>({ ...s, verifying:true, msg:"" }));
    setBusy((b)=>({ ...b, verify:true }));
    try {
      const data = await apiJson(
        `/api/auth/email/verify?email=${encodeURIComponent(form.email)}&code=${encodeURIComponent(emailState.code)}`
      );
      if (data.code === 200)
        setEmailState((s)=>({ ...s, verifying:false, verified:true, msg:"✅ 이메일 인증 완료!" }));
      else setEmailState((s)=>({ ...s, verifying:false, verified:false, msg:"인증 실패" }));
    } catch {
      setEmailState((s)=>({ ...s, verifying:false, verified:false, msg:"인증 중 오류가 발생했어요." }));
    } finally {
      setBusy((b)=>({ ...b, verify:false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCheck.done || !idCheck.available) return alert("아이디 중복확인을 완료하세요.");
    if (!nickCheck.done || !nickCheck.available) return alert("닉네임 중복확인을 완료하세요.");
    if (!emailState.verified) return alert("이메일 인증을 완료하세요.");

    setBusy((b)=>({ ...b, submit:true }));
    try {
      const data = await apiJson(`/api/user/regist`, {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (data.code === 200) {
        alert("🎉 회원가입 완료!");
        window.location.href = "/login";
      } else {
        alert(data.message || "🚫 회원가입 실패");
      }
    } catch (err) {
      alert(err.message || "🚫 회원가입 실패");
    } finally {
      setBusy((b)=>({ ...b, submit:false }));
    }
  };

  return (
    <div className="loginContainer">
      <form className="loginBox" onSubmit={handleSubmit}>
        <h2 className="signupTitle">회원가입</h2>
        <div className="container" style={{ display:"flex", gap:8 }}>
          <input type="text" name="userId" placeholder="아이디"
                 value={form.userId} onChange={handleChange} required autoComplete="username" />
          <button type="button" className="authButton" onClick={checkUserId} disabled={busy.id}>
            {busy.id ? "확인중..." : "아이디 중복확인"}
          </button>
        </div>
        {idCheck.msg && <div className={`status-message ${idCheck.available ? 'success' : 'error'}`}>{idCheck.msg}</div>}

        <input type="password" name="password" placeholder="비밀번호"
               value={form.password} onChange={handleChange} required autoComplete="new-password" />

        <div className="container" style={{ display:"flex", gap:8, marginTop:8 }}>
          <input type="text" name="nickname" placeholder="닉네임"
                 value={form.nickname} onChange={handleChange} required />
          <button type="button" className="authButton" onClick={checkNickname} disabled={busy.nick}>
            {busy.nick ? "확인중..." : "닉네임 중복확인"}
          </button>
        </div>
        {nickCheck.msg && <div className={`status-message ${nickCheck.available ? 'success' : 'error'}`}>{nickCheck.msg}</div>}

        <div className="container" style={{ display:"flex", gap:8, marginTop:8 }}>
          <input type="email" name="email" placeholder="이메일"
                 value={form.email} onChange={handleChange} readOnly={emailState.verified} required />
          <button type="button" className="authButton"
                  onClick={sendEmailCode} disabled={emailState.sending || emailState.verified || busy.send}>
            {emailState.verified ? "인증완료" : (emailState.sending ? "전송중..." : "이메일 인증")}
          </button>
        </div>

        {emailState.sent && !emailState.verified && (
          <div className="container" style={{ display:"flex", gap:8, marginTop:8 }}>
            <input type="text" placeholder="인증코드 입력" 
                   className="verification-input"
                   value={emailState.code}
                   onChange={(e)=>setEmailState((s)=>({ ...s, code:e.target.value }))}/>
            <button type="button" className="authButton"
                    onClick={verifyEmailCode} disabled={emailState.verifying || busy.verify}>
              {emailState.verifying ? "확인중..." : "코드확인"}
            </button>
          </div>
        )}
        {emailState.msg && <div className={`status-message ${emailState.verified ? 'success' : emailState.sent ? 'info' : 'error'}`}>{emailState.msg}</div>}

        <button type="submit" disabled={busy.submit}>
          {busy.submit ? "처리중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
