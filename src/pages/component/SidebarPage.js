import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, deleteCookie } from '../../utils/Cookie';


const icons = [
    { name: "", svg: <path d="M4 10v10h5v-6h6v6h5V10L12 3z" /> },
    { name: "search", svg: <circle cx="11" cy="11" r="6" />, extra: <line x1="15.5" y1="15.5" x2="20" y2="20" /> },
    { name: "add", svg: <><line x1="12" y1="6" x2="12" y2="18" /><line x1="6" y1="12" x2="18" y2="12" /></> },
    { name: "heart", svg: <path d="M12 21s-6-4.35-6-8a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 3.65-6 8-6 8z" /> },
    { name: "ranking", svg: <><path d="M8 4h8v2h2v2c0 2.2-1.5 4-3.5 4H9.5C7.5 12 6 10.2 6 8V6h2V4z" /><path d="M10 18h4v2h-4z" /></> },
    { name: "myProfile", svg: <circle cx="12" cy="8" r="4" />, extra: <path d="M6 20c0-2 4-4 6-4s6 2 6 4" /> },
];

const loginIcon = { name: "login", svg: <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /> };
const logoutIcon = { name: "logout", svg: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /> };

export default function SidebarPage() {
    const [activeIcon, setActiveIcon] = useState("");
    const navigate = useNavigate();

    const token = getCookie('jwt');
    const isLoggedIn = !!token;
    const handleLogoutClick = () => {
        console.log("JWT Token:", token);
        deleteCookie('jwt'); // JWT 쿠키 삭제
        navigate('/login'); // 로그아웃 후 홈으로 이동
    };

    return (
        <div className="sidebarContainer">
            <div className="sidebar">
                {icons.map((icon) => (
                    <Link to={`/${icon.name}`} key={icon.name} style={{ textDecoration: "none" }}>
                        <div
                            className={`tabIcon ${activeIcon === icon.name ? "active" : ""}`}
                            onClick={() => setActiveIcon(icon.name)}
                        >
                            <svg viewBox="0 0 24 24" className="tabItem" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {icon.svg}
                                {icon.extra}
                            </svg>
                        </div>
                    </Link>
                ))}
                {isLoggedIn ? (
                    <div className={`tabIcon ${activeIcon === logoutIcon.name ? "active" : ""}`} onClick={handleLogoutClick} style={{cursor: 'pointer'}}>
                        <svg viewBox="0 0 24 24" className="tabItem" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {logoutIcon.svg}
                        </svg>
                    </div>
                ) : (
                    <Link to={`/${loginIcon.name}`} style={{ textDecoration: "none" }}>
                        <div className={`tabIcon ${activeIcon === loginIcon.name ? "active" : ""}`} onClick={() => setActiveIcon(loginIcon.name)}>
                            <svg viewBox="0 0 24 24" className="tabItem" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {loginIcon.svg}
                            </svg>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
