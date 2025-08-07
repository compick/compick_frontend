import React, { useState } from "react";

export default function ImagePicker({ onSelectImage }) {
  const [localImages, setLocalImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const imagePreviews = files.map((file) => {
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });

    setLocalImages(imagePreviews);
  };

  return (
    <div>
      {/* 파일 선택 버튼 */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />

      <div className="imageGrid">
        {/* "사진 없음" 버튼 */}
        <div className="thumbnailBox" onClick={() => onSelectImage(null)}>
          <div className="noImageIcon">🚫</div>
          <div className="label">사진 없음</div>
        </div>

        {/* 선택한 이미지들 렌더링 */}
        {localImages.map((img, idx) => (
          <div
            className="thumbnailBox"
            key={idx}
            onClick={() => onSelectImage(img.url)}
          >
            <img src={img.url} className="thumbnailImage" alt={`img-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
