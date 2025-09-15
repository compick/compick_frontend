// SidebarPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../../utils/Cookie';
import '../../styles/component.css';

export default function SidebarPage({ onLogout }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // 쿠키로 로그인 여부 판단
  const token = getCookie('jwt');
  const loggedIn = !!token;

  const handleLogout = () => {
    console.log('JWT Token:', token);
    deleteCookie('jwt');       // JWT 쿠키 삭제
    onLogout?.();              // 부모에 알림(선택)
    navigate('/');             // 홈으로 이동
  };

  return (
    <div className="sidebarContainer">
      <div className="sidebar">
        <div className="tabIcon" onClick={() => navigate('/')}>
          {/* 홈 아이콘 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {loggedIn &&(
        <div className="tabIcon" onClick={() => navigate('/add')}>
          {/* 추가 아이콘 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        )}

        <div className="tabIcon">
          {/* 검색 아이콘 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        
        {loggedIn &&(
        <div className="tabIcon" onClick={() => navigate('/myProfile')}>
          {/* 프로필 아이콘 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        )}

        <div className="tabIcon" onClick={() => setShowPopup((v) => !v)}>
          {/* 메뉴 아이콘 SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {showPopup && (
        <div className="popupOverlay">
          <div className="popupBox">
            <div className="popupContent">
              {loggedIn ? (
                <>
                  
                  <div className="popupIcon" onClick={handleLogout}>
                    <span>로그아웃</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="popupIcon" onClick={() => navigate('/login')}>
                    <span>로그인</span>
                  </div>
                  <div className="popupIcon" onClick={() => navigate('/signup')}>
                    <span>회원가입</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
