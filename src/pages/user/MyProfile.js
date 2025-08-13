import { useState } from "react";
import { Link } from "react-router-dom"; // Link import
import profileImg from "../../img/icon/defaultProfile.jpeg";
import TierInfo from "./TierInfo";
import EditProfileModal from "./EditProfileModal";
// TierDetailModal import 제거

export default function MyProfile({ userScores }){ // prop으로 userScores 받기
    // MyProfile 내의 userScores 상태는 제거
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // selectedTier 및 관련 함수 제거

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    // handleProfileUpdate, userInfo 상태는 그대로
    const handleProfileUpdate = (newUserInfo) => {
        setUserInfo(newUserInfo);
        console.log("Updated user info:", newUserInfo);
    };

    const [userInfo, setUserInfo] = useState({
        nickname: "홍길동1234",
        profileImg: profileImg,
        introduction: "안녕하세요! 축구를 사랑하는 유저입니다.",
    });

    return(
        <div className="uploadContainer">
            <div className="profileBox">
                <div className="container col">
                    <span className="profileNickName">{userInfo.nickname}</span>
                    <span className="profileIntroduction">{userInfo.introduction}</span>
                    {/* Link 컴포넌트로 변경 */}
                    <Link to="/all-tiers" className="link">내 티어 보러가기</Link>
                </div>
                <div className="profileImg" onClick={openEditModal}>
                    <img src={userInfo.profileImg}/>
                </div>
            </div>

            <div className="tierContainer">
                {Object.entries(userScores)
                    .filter(([, data]) => data.score > 0)
                    .sort(([, dataA], [, dataB]) => dataB.score - dataA.score)
                    .map(([category, data]) => (
                        <Link to={`/tier/${category}`} key={category} className="tierInfoWrapper">
                            <TierInfo category={category} score={data.score} />
                        </Link>
                ))}
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    onClose={closeEditModal}
                    currentUser={userInfo}
                    onSave={handleProfileUpdate}
                />
            )}
            {/* TierDetailModal 렌더링 JSX 제거 */}
        </div>
    )
}