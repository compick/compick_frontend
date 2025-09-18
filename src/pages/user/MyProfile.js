import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyCommentsPage from "./MyCommentsPage";
import { deleteCookie } from '../../utils/Cookie';
import { apiJson } from "../../api/apiClient";
import {getMyComments} from "../../api/Comment";

export default function MyProfile({ userScores, userInfo }) {
    const navigate = useNavigate();

    // 닉네임 / 소개글 / 프로필 이미지 상태
    const [currentUser, setCurrentUser] = useState(null);
    const [activeView, setActiveView] = useState("comments");
    const [myComments, setMyComments] = useState([]);
    const [userData, setUserData] = useState({
        nickname: userInfo?.nickname || "",
        introduction: userInfo?.introduction || "",
        profileImg: userInfo?.profileImg || ""
    });
    console.log("[MyProfile] userData =", userInfo.profileImg);
    const renderContent = () => {
        switch (activeView) {
          case "comments":
            return <MyCommentsPage comments={myComments} />;
          default:
            return <MyCommentsPage comments={myComments} />;
        }
      };
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

    const handleViewChange = async (view) => {
        setActiveView(view);
      
        if (view === "comments") {
          try {
            const data = await getMyComments();
            console.log("[MyProfile] 내 댓글 목록 =", data);
            setMyComments(Array.isArray(data) ? data : data.data || []);
          } catch (err) {
            console.error("내 댓글 불러오기 실패:", err);
          }
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
