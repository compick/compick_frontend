import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TierList from "./TierList";
import MyVotesPage from "./MyVotesPage";
import FavoritesPage from "./FavoritesPage";
import MyCommentsPage from "./MyCommentsPage";
import { deleteCookie } from '../../utils/Cookie';
import { apiJson } from "../../api/apiClient";

export default function MyProfile({ userScores, userInfo }) {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("tiers");

    // 닉네임 / 소개글 / 프로필 이미지 상태
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState({
        nickname: userInfo?.nickname || "",
        introduction: userInfo?.introduction || "",
        profileImg: userInfo?.profileImg || ""
    });
    console.log("[MyProfile] userData =", userInfo.profileImg);
    
    useEffect(() => {
        apiJson("/api/user/info")
            .then((data) => {
                if (data?.code === 200) {
                    const user = data.data;
                    console.log("[MyProfile] user =", user);
                    setCurrentUser({nickName: user.nickname, introduction: user.introduction, profileImg: user.profileImg});
                    
                    setUserData({
                        nickname: user.nickname ?? "",
                        introduction: user.introduction ?? "",
                        profileImg: user.profileImg 
                        // profileImg: user.profileImg ?? "/img/icon/defaultProfile.jpeg"
                      });
                } else {
                    alert(data.message);
                }
            })
            .catch((err) => {
                alert(err.message);
                deleteCookie("jwt");
                window.location.href = "/login";
            });
    }, []);

    const handleNavigate = (path) => {
        if (path === "/edit-profile") {
            // EditProfilePage로 현재 사용자 데이터 전달
            navigate(path, {
                state: {
                    userData: {
                        nickname: userData.nickname,
                        introduction: userData.introduction,
                        profileImg: userData.profileImg
                    }
                }
            });
        } else {
            navigate(path);
        }
    };

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    const renderContent = () => {
        switch (activeView) {
            case "tiers":
                return <TierList userScores={userScores} />;
            case "votes":
                return <MyVotesPage />;
            case "favorites":
                return <FavoritesPage />;
            case "comments":
                return <MyCommentsPage />;
            default:
                return <TierList userScores={userScores} />;
        }
    };

    return (
        <div className="uploadContainer">
            <div className="profileBox">
                <div className="container col">
                    <span className="profileNickName">{userData.nickname}</span>
                    <span className="profileIntroduction">{userData.introduction}</span>
                </div>
                <div
                    className="container col profileImginBox"
                    onClick={() => handleNavigate("/edit-profile")}
                >
                    <div className="profileImg">
                        <img src={userData.profileImg} alt="프로필" />
                    </div>
                </div>
            </div>

            <div className="profileMenuContainer">
                <button
                    className={`profileMenuButton ${activeView === "comments" ? "active" : ""}`}
                    onClick={() => handleViewChange("comments")}
                >
                    작성한 댓글
                </button>
            </div>

            <div className="profileContentContainer">{renderContent()}</div>
        </div>
    );
}
