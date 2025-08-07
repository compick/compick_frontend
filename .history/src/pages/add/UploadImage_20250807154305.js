import React, { useState } from "react";
import ImagePicker from "./ImagePicker";
import defaultImage from "../assets/default-image.png";

export default function UploadImage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="uploadContainer">
      {/* 상단: 선택된 이미지 미리보기 */}
      <div className="previewBox">
        {selectedImage ? (
          <img src={selectedImage} alt="preview" className="previewImage" />
        ) : (
          <div className="noImageText">이미지를 선택해주세요</div>
        )}
      </div>

      {/* 하단: 이미지 선택 리스트 */}
      <div className="pickerBox">
        <ImagePicker onSelectImage={setSelectedImage} />
      </div>
      <div className="imageGrid">
  {/* 1. 카메라 버튼 */}
  <div className="thumbnailBox" onClick={handleCameraClick}>
    <div className="cameraIcon">📷</div>
    <div className="label">카메라</div>
  </div>

  {/* 2. 이미지 없음 (선택 시 상단 preview에 아무것도 안보임) */}
  <div className="thumbnailBox" onClick={() => onSelectImage(null)}>
    <div className="noImageIcon">🚫</div>
    <div className="label">사진 없음</div>
  </div>

  {/* 3. 갤러리 이미지 리스트 */}
  {imageList.map((src, idx) => (
    <div className="thumbnailBox" key={idx} onClick={() => onSelectImage(src)}>
      <img src={src} className="thumbnailImage" alt={`img-${idx}`} />
    </div>
  ))}
</div>
    </div>
  );
}
