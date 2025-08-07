import React, { useState } from "react";

export default function ImagePicker({ onSelectImage }) {
  const [localImages, setLocalImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // 새로 추가된 파일들을 기존 상태에 누적
    setLocalImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
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
