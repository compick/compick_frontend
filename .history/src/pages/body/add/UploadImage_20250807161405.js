import React, { useState } from "react";
import ImagePicker from "./ImagePicker";

export default function UploadImage({ selectedImage, setSelectedImage }) {
  return (
    <>
      {/* 상단 이미지 미리보기 */}
      <div className="previewBox">
        {selectedImage ? (
          <img src={selectedImage} alt="preview" className="previewImage" />
        ) : (
          <div className="noImageText">이미지를 선택해주세요</div>
        )}
      </div>

      {/* 하단 선택기 */}
      <div className="pickerBox">
        <ImagePicker onSelectImage={setSelectedImage} />
      </div>
    </>
  );
}
