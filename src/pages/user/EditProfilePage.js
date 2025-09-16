import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkPassword, updateUser ,deleteUser} from "../../api/User";
import { deleteCookie } from "../../utils/Cookie";

export default function EditProfilePage({ currentUser, onSave }) {
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [previewImg, setPreviewImg] = useState("/img/icon/defaultProfile.jpeg");
  const [imageDataUrl, setImageDataUrl] = useState(null); // Base64 저장

  const [password, setPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWithdrawalConfirmation, setShowWithdrawalConfirmation] = useState(false);
  const [userContent, setUserContent] = useState({ posts: [], comments: [] });

  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("[EditProfilePage] currentUser =", currentUser);
  console.log("[EditProfilePage] location.state =", location.state);
  
  // 초기값 세팅
  useEffect(() => {
    // MyProfile에서 전달받은 데이터 우선 사용
    const passedUserData = location.state?.userData;
    
    if (passedUserData) {
      setNickname(passedUserData.nickname || "");
      setIntroduction(passedUserData.introduction || "");
      setPreviewImg(passedUserData.profileImg || "/img/icon/defaultProfile.jpeg");
      setImageDataUrl(null);
    } else if (currentUser) {
      // 전달받은 데이터가 없으면 기존 currentUser 사용
      setNickname(currentUser.nickname || "");
      setIntroduction(currentUser.introduction || "");
      setPreviewImg(currentUser.profileImg || "/img/icon/defaultProfile.jpeg");
      setImageDataUrl(null);
    }
  }, [currentUser, location.state]);

  // 이미지 파일 선택
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 제한 (2MB 예시)
    if (file.size > 2 * 1024 * 1024) {
      alert("2MB 이하 이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreviewImg(dataUrl);     // 미리보기
      setImageDataUrl(dataUrl);   // 서버 전송용
    };
    reader.onerror = () => {
      alert("이미지 읽기 중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleNicknameCheck = () => {
    alert("사용 가능한 닉네임입니다.");
  };

  // 비밀번호 확인
  const handlePasswordCheck = async () => {
    setIsLoading(true);
    try {
      const response = await checkPassword(password);
      if (response.success) {
        setIsPasswordConfirmed(true);
        alert("비밀번호가 확인되었습니다. 이제 정보를 수정할 수 있습니다.");
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 저장
  const handleSave = async () => {
    const payload = {
      ...currentUser,
      nickname,
      introduction,
      profileImg: imageDataUrl ?? currentUser?.profileImg ?? "",
    };

    try {
      const result = await updateUser(payload);
      const ok = !!result && !result.message; 
      if (ok) {
        alert("회원 정보가 수정되었습니다.");
        onSave?.(result);
        navigate(-1);
      } else {
        alert("수정 실패: " + (result?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      alert("서버 오류: " + err.message);
    }
  };

  // 취소
  const handleCancel = () => {
    navigate(-1);
  };

  const handleShowWithdrawal = () => {
    setShowWithdrawalConfirmation(true);
  };

  const handleWithdrawal = async() => {
    if(window.confirm("정말로 회원탈퇴하시겠습니까?")) {
      try {
      const result = await deleteUser();
      alert("회원탈퇴가 처리되었습니다.");
      deleteCookie("jwt");
      window.location.href = "/";
      }
     catch(err) {
      alert("회원탈퇴 처리 중 오류가 발생했습니다."+err.message);
    }
  };
    navigate("/");
  };

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <h2>프로필 수정</h2>

        {/* 비밀번호 확인 */}
        <div className="password-check-section">
          <h4>비밀번호 확인</h4>
          <p>정보를 수정하려면 현재 비밀번호를 입력해주세요.</p>
          <div className="inputGroup">
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPasswordConfirmed}
            />
            <button onClick={handlePasswordCheck} disabled={isPasswordConfirmed || isLoading}>
              {isLoading ? "확인 중..." : "확인"}
            </button>
          </div>
        </div>

        {isPasswordConfirmed && (
          <>
            <fieldset className="profile-edit-fieldset">
              <legend>수정 정보</legend>

              <div className="profileEditImgContainer">
                <img src={previewImg} alt="프로필" className="profileEditImg" />
                <label htmlFor="profileImgInput" className="profileImgEditButton">
                  이미지 변경
                </label>
                <input
                  id="profileImgInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="inputGroup">
                <label htmlFor="nicknameInput">닉네임</label>
                <div className="nickname-input-group">
                  <input
                    id="nicknameInput"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <button onClick={handleNicknameCheck} className="check-duplicate-btn">
                    중복 확인
                  </button>
                </div>
              </div>

              <div className="inputGroup">
                <label htmlFor="introductionInput">소개글</label>
                <textarea
                  id="introductionInput"
                  rows="4"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                />
              </div>
            </fieldset>

            <div className="profile-edit-actions">
              <button onClick={handleSave} className="saveButton">저장</button>
              <button onClick={handleCancel} className="cancelButton">취소</button>
            </div>

            <div className="withdrawal-section">
              <button 
                onClick={handleShowWithdrawal} 
                className="withdrawal-btn" 
                disabled={isLoading}
              >
                회원탈퇴
              </button>
              {showWithdrawalConfirmation && (
                <div className="withdrawal-confirmation">
                  <h4>회원탈퇴 확인</h4>
                  <p>회원탈퇴 시 모든 정보가 영구적으로 삭제됩니다.</p>
                  <p>
                    정말로 탈퇴하시겠습니까?{" "}
                    <span className="confirm-text" onClick={handleWithdrawal}>
                      예, 탈퇴합니다.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
