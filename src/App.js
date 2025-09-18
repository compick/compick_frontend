import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import {getCookie} from "./utils/Cookie";


import BodyPage from "./pages/BodyPage";
import ThemeToggle from "./components/ThemeToggle";
import GlobalChatSidebar from "./components/GlobalChatSidebar";
import profileImg from "./img/icon/defaultProfile.jpeg"; // 이미지 경로 수정
import { ToastContainer } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";
import "./styles/login.css";
import "./styles/component.css";
import "./styles/body.css";
import "./styles/add.css";
import "./styles/user.css";


function App() {
  const currentUser = { name: '나' }; // 현재 사용자 정보 (임시)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastTheme, setToastTheme] = useState("light");

  useEffect(() => {
    const token = getCookie("jwt"); // JWT 쿠키 가져오기
    setIsLoggedIn(!!token); // 있으면 true, 없으면 false
  }, []);
  useEffect(() => {
    // html 태그의 data-theme 속성 감시
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setToastTheme(currentTheme === "dark" ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 초기값 세팅
    const initTheme = document.documentElement.getAttribute("data-theme");
    setToastTheme(initTheme === "dark" ? "dark" : "light");

    return () => observer.disconnect();
  }, []);
  const handleLogin = () => {
    // 로그인 성공 시 백엔드에서 JWT 쿠키를 내려주고,
    // 프론트에서는 다시 확인해서 상태 갱신
    const token = getCookie("jwt");
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    // 쿠키 삭제 (예: util 함수로 clearCookie 호출)
    document.cookie = "jwt=; Max-Age=0; path=/;"; 
    setIsLoggedIn(false);
  };

  const [capturedImage, setCapturedImage] = useState(null); // 캡처 이미지 상태 추가
  const [userInfo, setUserInfo] = useState({
    introduction: "",
    profileImg: profileImg
  });

  const [selectedLeague, setSelectedLeague] = useState('all');
  
  const handleLeagueChange = useCallback((league) => {
    setSelectedLeague(league);
  }, []);

  const [likedMatches, setLikedMatches] = useState([]);
  
  const [chatState, setChatState] = useState({
      openChats: [],
      minimizedChats: [],
      activeChatId: null,
  });
  
  const [isChatSidebarVisible, setIsChatSidebarVisible] = useState(false);
 

  const handleLikeMatch = (matchToToggle) => {
    setLikedMatches(prev => {
        const isLiked = prev.find(match => match.id === matchToToggle.id);
        if (isLiked) {
            return prev.filter(match => match.id !== matchToToggle.id);
        } else {
            return [...prev, matchToToggle];
        }
    });
  };

  const handleProfileUpdate = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  const handleOpenChat = (match) => {
      setChatState(prev => {
          // 이미 열려있거나 최소화된 경우, 해당 채팅을 활성화
          if (prev.openChats.some(c => c.id === match.id) || prev.minimizedChats.some(c => c.id === match.id)) {
              return {
                  ...prev,
                  openChats: [...prev.openChats.filter(c => c.id !== match.id), match], // 활성화하기 위해 목록의 맨 뒤로
                  minimizedChats: prev.minimizedChats.filter(c => c.id !== match.id), // 최소화 해제
                  activeChatId: match.id,
              };
          }
          // 새로 열기
          return {
              ...prev,
              openChats: [...prev.openChats, match],
              activeChatId: match.id,
          };
      });
      
      // 채팅을 열 때 사이드바도 자동으로 열기
      setIsChatSidebarVisible(true);
  };

  const handleCloseChat = (matchId) => {
      setChatState(prev => ({
          ...prev,
          openChats: prev.openChats.filter(c => c.id !== matchId),
          activeChatId: prev.activeChatId === matchId ? prev.openChats[prev.openChats.length - 2]?.id || null : prev.activeChatId,
      }));
  };

  const handleMinimizeChat = (match) => {
      setChatState(prev => ({
          ...prev,
          openChats: prev.openChats.filter(c => c.id !== match.id),
          minimizedChats: [...prev.minimizedChats.filter(c => c.id !== match.id), match],
          activeChatId: prev.activeChatId === match.id ? prev.openChats[prev.openChats.length - 2]?.id || null : prev.activeChatId,
      }));
  };
  
  const handleSetActiveChat = (matchId) => {
      setChatState(prev => ({ ...prev, activeChatId: matchId }));
  };

  const handleToggleChatSidebar = () => {
      setIsChatSidebarVisible(prev => !prev);
  };


  
  const handleReport = (type, id, reason) => {
      console.log(`Report received:
      Type: ${type}
      ID: ${id}
      Reason: ${reason}`);
      alert('신고가 접수되었습니다. 검토 후 처리하겠습니다.');
  };

    return (
    <BrowserRouter>
      <ThemeToggle />
      <div className={`app-container ${isChatSidebarVisible ? 'sidebar-visible' : ''}`}>
        <BodyPage 
           
           capturedImage={capturedImage}
           setCapturedImage={setCapturedImage}
           userInfo={userInfo}
           onProfileUpdate={handleProfileUpdate}
           likedMatches={likedMatches}
           onLikeMatch={handleLikeMatch}
           chatState={chatState}
           onOpenChat={handleOpenChat}
           onCloseChat={handleCloseChat}
           onMinimizeChat={handleMinimizeChat}
           onSetActiveChat={handleSetActiveChat}
           onReport={handleReport}
           currentUser={currentUser}
           handleLeagueChange={handleLeagueChange}
           selectedLeague={selectedLeague}
           isLoggedIn={isLoggedIn}
           onLogin={handleLogin}
           onLogout={handleLogout}
        />
        <GlobalChatSidebar
          chatState={chatState}
          onOpenChat={handleOpenChat}
          onCloseChat={handleCloseChat}
          onMinimizeChat={handleMinimizeChat}
          onSetActiveChat={handleSetActiveChat}
          isVisible={isChatSidebarVisible}
          onToggleVisibility={handleToggleChatSidebar}
        />
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme={toastTheme} />
    </BrowserRouter>
  );
}

export default App;
