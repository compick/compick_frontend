import { Routes, Route } from 'react-router-dom';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';
import LoginPage from "./login/LoginUser";
import RegisterUserPage from "./login/RegisterUser";
import AddBody from './body/AddBody';
import MyProfile from './user/MyProfile';
import TierDetailPage from './user/TierDetailPage';
import EditProfilePage from './user/EditProfilePage';
import HeartPage from './HeartPage';
import MatchDetailPage from './body/MatchDetailPage';
import ChatManager from './body/ChatManager'; // ChatContainer 대신 ChatManager import
import RankingPage from './user/RankingPage';
import PostDetailPage from './body/PostDetailPage';

export default function BodyPage({ posts, matches, userScores, capturedImage, setCapturedImage, userInfo, onProfileUpdate, likedMatches, onLikeMatch, activeChatMatch, onOpenChat, onCloseChat, chatState, onMinimizeChat, onSetActiveChat, onAddComment, onLikeComment, onAddReply, currentUser, onLikePost, onReport }){

    return(
        <>
            <div className="bodyContainer">
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
                <div style={{flex: 1 }}>
                    <Routes>
                        <Route path='/home' element={<HomeBodyPage posts={posts} matches={matches} likedMatches={likedMatches} onLikeMatch={onLikeMatch} onOpenChat={onOpenChat} />}/>
                        <Route path='/add' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/editImage' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                        <Route path='/writePost' element={<AddBody capturedImage={capturedImage} />}/>
                        <Route path="/login" element={ <LoginPage/> }/>
                        <Route path="/regist" element={ <RegisterUserPage/> }/>
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