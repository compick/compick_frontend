import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';

import SelectLogin from "./auth/SelectLogin";
import LocalLogin from './auth/LocalLogin';
import KakaoLogin from './auth/KakaoLogin';
import SelectSignup from "./auth/SelectSignup";
import LocalSignup from './auth/LocalSignup';
import KakaoSignup from './auth/KakaoSignup';
import KakaoResult from './auth/KakaoResult';

import GuestRoute from './auth/GuestRoute';

import AddBody from './body/AddBody';
import EditImage from './body/add/EditImage';
import WritePost from './body/add/WritePost';
import MyProfile from './user/MyProfile';
import TierDetailPage from './user/TierDetailPage';
import EditProfilePage from './user/EditProfilePage';
import HeartPage from './HeartPage';
import MatchDetailPage from './body/MatchDetailPage';
import ChatManager from './body/ChatManager'; // ChatContainer 대신 ChatManager import
import RankingPage from './user/RankingPage';
import TeamRankingPage from './user/TeamRankingPage'; // 새로 만든 페이지 import
import TeamRankingsPage from './body/TeamRankingsPage'; // 구단순위 페이지 import
import PostDetailPage from './body/PostDetailPage';
import SportHeader from './component/SportHeader';



// URL 파라미터를 읽어 HomeBodyPage에 league prop을 전달하는 래퍼 컴포넌트
const HomePageWrapper = ({ posts, likedMatches, onLikeMatch, onOpenChat, handleLeagueChange, selectedLeague }) => {
    const { sport, league } = useParams();
    const location = useLocation();

    useEffect(() => {
        let leagueToSet = 'all'; // 기본값
        let sportToSet = 'all'; // 기본값
        
        // 홈 페이지인 경우 (루트 경로)
        if (location.pathname === '/') {
            leagueToSet = 'all';
            sportToSet = 'all';
        } else if (league) {
            // /:sport/:league 형태
            leagueToSet = league;
            sportToSet = sport;
        } else if (sport) {
            // /:sport 형태 (예: /soccer, /baseball, /mma)
            leagueToSet = 'all';
            sportToSet = sport;
        }
        
        // 현재 선택된 리그와 다를 때만 변경
        if (selectedLeague !== leagueToSet) {
            handleLeagueChange(leagueToSet);
        }
    }, [sport, league, location.pathname, selectedLeague, handleLeagueChange]);

    // sport와 league 값을 결정
    let finalSport = 'all';
    let finalLeague = 'all';
    
    if (location.pathname === '/') {
        finalSport = 'all';
        finalLeague = 'all';
    } else if (league) {
        finalSport = sport;
        finalLeague = league;
    } else if (sport) {
        finalSport = sport;
        finalLeague = 'all';
    }

    console.log('🏠 HomePageWrapper - URL 파라미터:', { sport, league });
    console.log('🏠 HomePageWrapper - Final props:', { finalSport, finalLeague, selectedLeague });

    return <HomeBodyPage posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} league={finalLeague} sport={finalSport} />;
};

export default function BodyPage({ posts, matches, userScores, capturedImage, setCapturedImage, userInfo, onProfileUpdate, likedMatches, onLikeMatch, onOpenChat, onCloseChat, chatState, onMinimizeChat, onSetActiveChat, onAddComment, onLikeComment, onAddReply, currentUser, onLikePost, onReport, handleLeagueChange, selectedLeague, isLoggedIn, onLogin, onLogout, onDateChange }) {


    
    return (
        <>
            <SportHeader selectedLeague={selectedLeague} isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="bodyContainer">

                <SidebarPage isLoggedIn={isLoggedIn} onLogout={onLogout} />
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport/:league" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />

                        <Route path='/add' element={<AddBody setCapturedImage={setCapturedImage} />} />
                        <Route path='/editImage' element={<AddBody setCapturedImage={setCapturedImage} />} />
                        <Route path='/writePost' element={<AddBody capturedImage={capturedImage} />} />

                        <Route path="/login" element={<GuestRoute><SelectLogin onLogin={onLogin} /></GuestRoute>} />
                        <Route path="/signup" element={<GuestRoute><SelectSignup /></GuestRoute>} />
                        <Route path="/login/local" element={<LocalLogin />} />
                        <Route path="/login/kakao" element={<KakaoLogin />} />
                        <Route path="/signup/local" element={<LocalSignup />} />
                        <Route path="/signup/kakao" element={<KakaoSignup />} />
                        <Route path="/kakao/result" element={<KakaoResult/>} />

                        <Route path="/myProfile" element={<MyProfile userScores={userScores} userInfo={userInfo} />} />
                        <Route path="/edit-profile" element={<EditProfilePage currentUser={userInfo} onSave={onProfileUpdate} />} />
                        <Route path="/tier/:category" element={<TierDetailPage userScores={userScores} />} />
                        <Route path="/heart" element={<HeartPage likedMatches={likedMatches} onLikeMatch={onLikeMatch} />} />
                        <Route path="/match/:matchId" element={<MatchDetailPage likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} />} />
                        <Route path="/ranking" element={<RankingPage />} />
                        <Route path="/ranking/:league" element={<TeamRankingPage />} />
                        <Route path="/team-rankings/:sport" element={<TeamRankingsPage />} />
                        <Route path="/post/:postId" element={<PostDetailPage posts={posts} onAddComment={onAddComment} onLikeComment={onLikeComment} onAddReply={onAddReply} currentUser={currentUser} onLikePost={onLikePost} onReport={onReport} />} />
                    </Routes>
                </div>
            </div>
            <ChatManager
                chatState={chatState}
                onOpenChat={onOpenChat}
                onCloseChat={onCloseChat}
                onMinimizeChat={onMinimizeChat}
                onSetActiveChat={onSetActiveChat}
            />
        </>
    )
}