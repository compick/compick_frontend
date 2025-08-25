import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/Cookie';
import {API_BASE} from "../../config"

export default function LocalLogin() {
    const [form, setForm] = useState({ userId: "", password: "" });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        try {

            const res = await fetch(`${API_BASE}/api/user/login/normal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            console.log(data);
            if (data.code === 200) {
                alert("로그인 성공");
                document.cookie = `jwt=${data.data}; path=/;`
                window.location.href = "/";
            } else {
                alert("로그인 실패: " + data.message);
            }
        } catch(e) {
            alert("오류 발생");
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginBox">
                <span>계정 로그인</span>
                <input type="text"
                    placeholder="아이디"
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                />
                <input type="password"
                    placeholder="비밀번호"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>로그인</button>

                <span>비밀번호 찾기</span>

                <div className="container or">
                    <div className="shortLine" />
                    <span> 또는 </span>
                    <div className="shortLine" />
                </div>
                <button className="registerButton" onClick={() => navigate('/regist')}>회원가입</button>
                <span> 로그인 api 추가</span>
            </div>
        </div>
    )
}