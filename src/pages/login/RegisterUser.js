import React, { useState } from "react";

export default function RegisterUser(){
    
        
    const [form, setForm] = useState({
        userId: "",
        userPw: "",
        userName: "",
        phone: "",
        userEmail: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const phoneAuth = () => {
        const { IMP } = window;
        IMP.init("imp12345678"); // 아임포트 테스트용 코드

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

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
            alert("🎉 회원가입 완료!");
            window.location.href = "/login";
            } else {
            alert("🚫 실패: " + data.msg);
            }
        });
    };

  return (
    <div className="loginContainer">
      <h2 className="signupTitle">회원가입</h2>
      <form className="loginBox" onSubmit={handleSubmit}>
        <input type="text" name="userId" placeholder="아이디" 
         value={form.userId} onChange={handleChange} required />
        <input type="password" name="userPw" placeholder="비밀번호"
         value={form.userPw} onChange={handleChange} required/>
        <input type="text" name="userName" placeholder="이름"
          value={form.userName} onChange={handleChange} required/>
        <div className="container">
        <input type="text" name="phone" placeholder="휴대폰번호"
          value={form.phone} readOnly style={{marginRight: "20px"}}/>
        <button type="button" className="authButton" onClick={phoneAuth}>
          휴대폰 인증
        </button>
        </div>
        <button type="submit" className="submitButton">회원가입</button>
      </form>
    </div>
  );
}
