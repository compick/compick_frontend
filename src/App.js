import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import {getCookie} from "./utils/Cookie";


import BodyPage from "./pages/BodyPage";
import ThemeToggle from "./components/ThemeToggle";
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

  useEffect(() => {
    const token = getCookie("jwt"); // JWT 쿠키 가져오기
    setIsLoggedIn(!!token); // 있으면 true, 없으면 false
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

  const [userScores, setUserScores] = useState({
      soccer: {
          score: 820,
          rankPercent: 15,
          currentSeason: "Season 3",
          seasons: {
              "Season 1": [150, 200, 180, 250, 320],
              "Season 2": [400, 520, 480, 600, 650],
              "Season 3": [700, 680, 750, 820],
          },
          voteHistory: [
              { id: 1, date: '2023-10-27', change: '+20', reason: '승리 예측 성공' },
              { id: 2, date: '2023-10-25', change: '-10', reason: '패배 예측 실패' },
              { id: 3, date: '2023-10-22', change: '+15', reason: '스코어 예측 성공' },
          ]
      },
      baseball: {
          score: 780,
          rankPercent: 1,
          currentSeason: "Season 2",
          seasons: {
              "Season 1": [800, 850, 920, 880, 1000],
              "Season 2": [1020, 1050, 1030, 1080],
          },
          voteHistory: [
            { id: 1, date: '2023-10-26', change: '+30', reason: 'MVP 예측 성공' },
            { id: 2, date: '2023-10-24', change: '-20', reason: '승리 예측 실패' },
          ]
      },
      ufc: {
          score: 50,
          rankPercent: 78,
          currentSeason: "Season 1",
          seasons: {
              "Season 1": [100, 80, 120, 90, 50],
          },
          voteHistory: [
            { id: 1, date: '2023-10-28', change: '-50', reason: 'KO패 예측 실패' },
          ]
      },
  });
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
  const [posts, setPosts] = useState([
      { 
          id: 1, 
          title: '오늘 경기 명장면.gif', 
          author: '축구광팬',
          createdAt: '2025-08-10',
          imageUrl: 'https://via.placeholder.com/600x400.gif', 
          views: 1250,
          likedBy: ['유저2', '유저3'],
          comments: [
              { id: 101, user: '축구팬', text: '와, 정말 멋진 골이네요!', likedBy: ['유저3'], replies: [] },
              { id: 102, user: '리버풀팬', text: '우리 선수가 최고!', likedBy: [], replies: [] },
          ]
      },
      { 
          id: 2, 
          title: '야구 경기 하이라이트', 
          author: '야구매니아',
          createdAt: '2025-08-09',
          imageUrl: 'https://via.placeholder.com/600x400.jpg', 
          views: 980,
          likedBy: ['유저1', '유저4'],
          comments: [
              { id: 201, user: '야구팬', text: '정말 멋진 플레이네요!', likedBy: [], replies: [] },
          ]
      },
      { 
          id: 3, 
          title: 'UFC 경기 결과', 
          author: 'MMA팬',
          createdAt: '2025-08-08',
          imageUrl: 'https://via.placeholder.com/600x400.png', 
          views: 750,
          likedBy: ['유저2'],
          comments: []
      },
      { 
          id: 4, 
          title: '축구 선수 인터뷰', 
          author: '스포츠기자',
          createdAt: '2025-08-07',
          imageUrl: 'https://via.placeholder.com/600x400.gif', 
          views: 650,
          likedBy: ['유저1', '유저3', '유저4'],
          comments: [
              { id: 401, user: '팬1', text: '좋은 인터뷰였습니다!', likedBy: ['유저2'], replies: [] },
          ]
      },
      { 
          id: 5, 
          title: '야구장 관람 후기', 
          author: '야구관람객',
          createdAt: '2025-08-06',
          imageUrl: 'https://via.placeholder.com/600x400.jpg', 
          views: 420,
          likedBy: ['유저1'],
          comments: []
      },
  ]);

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

  const handleAddComment = (postId, commentText) => {
      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              const newComment = { id: Date.now(), user: '나', text: commentText, likedBy: [] };
              return { ...post, comments: [...post.comments, newComment] };
          }
          return post;
      }));
  };

  const handleLikeComment = (postId, commentId) => {
      const toggleLike = (comments, targetId) => {
          return comments.map(comment => {
              if (comment.id === targetId) {
                  const isLiked = comment.likedBy.includes(currentUser.name);
                  const newLikedBy = isLiked 
                      ? comment.likedBy.filter(user => user !== currentUser.name)
                      : [...comment.likedBy, currentUser.name];
                  return { ...comment, likedBy: newLikedBy };
              }
              if (comment.replies && comment.replies.length > 0) {
                  return { ...comment, replies: toggleLike(comment.replies, targetId) };
              }
              return comment;
          });
      };

      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              return { ...post, comments: toggleLike(post.comments, commentId) };
          }
          return post;
      }));
  };

  const handleAddReply = (postId, parentCommentId, replyText) => {
      const addReplyToComment = (comments, parentId, text) => {
          return comments.map(comment => {
              if (comment.id === parentId) {
                  const newReply = { id: Date.now(), user: '나', text, likedBy: [] };
                  return { ...comment, replies: [...comment.replies, newReply] };
              }
              if (comment.replies && comment.replies.length > 0) {
                  return { ...comment, replies: addReplyToComment(comment.replies, parentId, text) };
              }
              return comment;
          });
      };

      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              return { ...post, comments: addReplyToComment(post.comments, parentCommentId, replyText) };
          }
          return post;
      }));
  };

  const handleLikePost = (postId) => {
      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              const isLiked = post.likedBy.includes(currentUser.name);
              const newLikedBy = isLiked
                  ? post.likedBy.filter(user => user !== currentUser.name)
                  : [...post.likedBy, currentUser.name];
              return { ...post, likedBy: newLikedBy };
          }
          return post;
      }));
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
      <BodyPage 
         userScores={userScores} 
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
         posts={posts}
         onAddComment={handleAddComment}
         onLikeComment={handleLikeComment}
         onAddReply={handleAddReply}
         onLikePost={handleLikePost}
         onReport={handleReport}
         currentUser={currentUser}
         handleLeagueChange={handleLeagueChange}
         selectedLeague={selectedLeague}
         isLoggedIn={isLoggedIn}
         onLogin={handleLogin}
         onLogout={handleLogout}
      />
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
