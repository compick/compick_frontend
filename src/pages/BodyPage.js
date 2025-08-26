import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';
import LoginPage from "./login/LoginUser";
import RegisterUserPage from "./login/RegisterUser";
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
import PostDetailPage from './body/PostDetailPage';
import SportHeader from './component/SportHeader';

// URL 파라미터를 읽어 HomeBodyPage에 league prop을 전달하는 래퍼 컴포넌트
const HomePageWrapper = ({ posts, likedMatches, onLikeMatch, onOpenChat, handleLeagueChange, selectedLeague }) => {
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

    return <HomeBodyPage posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} league={selectedLeague} sport={sport} />;
};


export default function BodyPage({ posts, userScores, capturedImage, setCapturedImage, userInfo, onProfileUpdate, likedMatches, onLikeMatch, onOpenChat, onCloseChat, chatState, onMinimizeChat, onSetActiveChat, onAddComment, onLikeComment, onAddReply, currentUser, onLikePost, onReport, handleLeagueChange, selectedLeague, isLoggedIn, onLogin, onLogout }){

    return(
        <>
            <SportHeader selectedLeague={selectedLeague} isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="bodyContainer">
                {/* <SidebarPage> 는 SportHeader로 이동 */}
                <div style={{flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />
                        <Route path="/:sport/:league" element={<HomePageWrapper handleLeagueChange={handleLeagueChange} posts={posts} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} selectedLeague={selectedLeague} />} />

                        <Route path='/add' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/editImage' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/writePost' element={<AddBody capturedImage={capturedImage} />}/>
                        <Route path="/login" element={ <LoginPage onLogin={onLogin} /> }/>
                        <Route path="/regist" element={ <RegisterUserPage/> }/>
                        <Route path="/myProfile" element={<MyProfile userScores={userScores} userInfo={userInfo} />}/>
                        <Route path="/edit-profile" element={<EditProfilePage currentUser={userInfo} onSave={onProfileUpdate} />} />
                        <Route path="/tier/:category" element={<TierDetailPage userScores={userScores} />}/>
                        <Route path="/heart" element={<HeartPage likedMatches={likedMatches} onLikeMatch={onLikeMatch} />} />
                        <Route path="/match/:matchId" element={<MatchDetailPage likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} />} />
                        <Route path="/ranking" element={<RankingPage />} />
                        <Route path="/ranking/:league" element={<TeamRankingPage />} />
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