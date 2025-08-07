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
    </div>
  );
}
