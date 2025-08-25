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
import PostDetailPage from './body/PostDetailPage';
import SportHeader from './component/SportHeader';


// URL 파라미터를 읽어 HomeBodyPage에 league prop을 전달하는 래퍼 컴포넌트
const HomePageWrapper = ({ posts, matches, likedMatches, onLikeMatch, onOpenChat, handleLeagueChange, onDateChange, selectedLeague }) => {
    const { sport, league } = useParams();
    const location = useLocation();

    useEffect(() => {
        let leagueToSet = 'all'; // 기본값
        if (league) {
            leagueToSet = league;
        } else if (sport) {
            leagueToSet = sport;
        } else if (location.pathname === '/') {
            leagueToSet = 'all';
        }
        handleLeagueChange(leagueToSet);
    }, [sport, league, location, handleLeagueChange]);

    return <HomeBodyPage posts={posts} matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} onDateChange={onDateChange} league={selectedLeague} />;
};


export default function BodyPage({ posts, matches, userScores, capturedImage, setCapturedImage, userInfo, onProfileUpdate, likedMatches, onLikeMatch, onOpenChat, onCloseChat, chatState, onMinimizeChat, onSetActiveChat, onAddComment, onLikeComment, onAddReply, currentUser, onLikePost, onReport, handleLeagueChange, selectedLeague, isLoggedIn, onLogin, onLogout, onDateChange }){

    return(
        <>
            <SportHeader selectedLeague={selectedLeague} />
            <div className="bodyContainer">
                <SidebarPage isLoggedIn={isLoggedIn} onLogout={onLogout} />
                <div style={{flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} onDateChange={onDateChange} posts={posts} matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} onDateChange={onDateChange} posts={posts} matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport/:league" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} onDateChange={onDateChange} posts={posts} matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />

                        <Route path='/add' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/editImage' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/writePost' element={<AddBody capturedImage={capturedImage} />}/>

                        <Route path="/login" element={ <SelectLogin onLogin={onLogin} /> }/>
                        <Route path="/signup" element={ <SelectSignup/> }/>
                        <Route path="/login/local" element={ <LocalLogin/> }/>
                        <Route path="/login/kakao" element={ <KakaoLogin/> }/>
                        <Route path="/signup/local" element={ <LocalSignup/> }/>
                        <Route path="/signup/kakao" element={ <KakaoSignup />}/>

                        <Route path="/myProfile" element={<MyProfile userScores={userScores} userInfo={userInfo} />}/>
                        <Route path="/edit-profile" element={<EditProfilePage currentUser={userInfo} onSave={onProfileUpdate} />} />
                        <Route path="/tier/:category" element={<TierDetailPage userScores={userScores} />}/>
                        <Route path="/heart" element={<HeartPage likedMatches={likedMatches} onLikeMatch={onLikeMatch} />} />
                        <Route path="/match/:matchId" element={<MatchDetailPage matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} />} />
                        <Route path="/ranking" element={<RankingPage />} />
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