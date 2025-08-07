import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadImage from "./add/UploadImage";

export default function AddBody() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // 이미지 상태 저장

  // ❌ 닫기 버튼
  const handleClose = () => {
    navigate("/home");
  };

  // ▶ 다음 버튼
  const handleNext = () => {
    if (selectedImage) {
      navigate("/edit-image", { state: { image: selectedImage } }); // 이미지 편집 페이지로 이동
    } else {
      navigate("/write-post");
    }
  };

  return (
    <div className="uploadContainer">
      {/* 상단 툴바 */}
      <div className="container">
        <button className="closeBtn" onClick={handleClose}>❌</button>
        <h2 className="pageTitle">게시글 작성</h2>
        <button className="nextBtn" onClick={handleNext}>다음 ▶</button>
      </div>

      {/* 이미지 업로드 미리보기 */}
      <UploadImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </div>
  );
}
