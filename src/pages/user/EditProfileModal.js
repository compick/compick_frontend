import { useState, useEffect } from "react";

export default function EditProfileModal({ onClose, currentUser, onSave }) {
    const [nickname, setNickname] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [newProfileImg, setNewProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState("");

    useEffect(() => {
        if (currentUser) {
            setNickname(currentUser.nickname);
            setIntroduction(currentUser.introduction || "");
            setPreviewImg(currentUser.profileImg);
        }
    }, [currentUser]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewProfileImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleNicknameCheck = () => {
        // 실제 중복 확인 로직은 여기에 구현 (e.g., API 호출)
        alert("사용 가능한 닉네임입니다.");
    };

    const handleSave = () => {
        const updatedUserInfo = {
            ...currentUser,
            nickname,
            introduction,
            profileImg: newProfileImg ? previewImg : currentUser.profileImg
        };
        onSave(updatedUserInfo);
        onClose();
    };

    return (
        <div className="modalBackdrop">
            <div className="modalContent">
                <h2>프로필 수정</h2>
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
                        <button onClick={handleNicknameCheck} className="check-duplicate-btn">중복 확인</button>
                    </div>
                </div>
                <div className="inputGroup">
                    <label htmlFor="introductionInput">소개글</label>
                    <textarea
                        id="introductionInput"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        rows="4"
                    />
                </div>
                <div className="modalActions">
                    <button onClick={handleSave} className="saveButton">저장</button>
                    <button onClick={onClose} className="cancelButton">취소</button>
                </div>
            </div>
        </div>
    );
}
