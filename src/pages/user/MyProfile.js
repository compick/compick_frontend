import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TierList from "./TierList";
import MyVotesPage from "./MyVotesPage";
import FavoritesPage from "./FavoritesPage";
import MyCommentsPage from "./MyCommentsPage";
// PasswordConfirmModal 및 checkPassword import 제거

export default function MyProfile({ userScores, userInfo }) {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('tiers');
    
    // 모달 관련 상태 및 핸들러 모두 제거

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'tiers':
                return <TierList userScores={userScores} />;
            case 'votes':
                return <MyVotesPage />;
            case 'favorites':
                return <FavoritesPage />;
            case 'comments':
                return <MyCommentsPage />;
            default:
                return <TierList userScores={userScores} />;
        }
    };

    return (
        <div className="uploadContainer">
            <div className="profileBox">
                <div className="container col">
                    <span className="profileNickName">{userInfo.nickname}</span>
                    <span className="profileIntroduction">{userInfo.introduction}</span>
                </div>
                <div className="container col profileImginBox" onClick={() => handleNavigate('/edit-profile')}>
                    <div className="profileImg">
                        <img src={userInfo.profileImg} alt="프로필" />
                    </div>
                </div>
            </div>

            <div className="profileMenuContainer">
                <button className={`profileMenuButton ${activeView === 'tiers' ? 'active' : ''}`} onClick={() => handleViewChange('tiers')}>내 티어</button>
                <button className={`profileMenuButton ${activeView === 'votes' ? 'active' : ''}`} onClick={() => handleViewChange('votes')}>내 투표함</button>
                <button className={`profileMenuButton ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => handleViewChange('favorites')}>즐겨찾기</button>
                <button className={`profileMenuButton ${activeView === 'comments' ? 'active' : ''}`} onClick={() => handleViewChange('comments')}>작성한 댓글</button>
                <button className="profileMenuButton" onClick={() => handleNavigate('/edit-profile')}>회원정보 수정</button>
            </div>

            <div className="profileContentContainer">
                {renderContent()}
            </div>
            
            {/* 모달 렌더링 JSX 제거 */}
        </div>
    );
}