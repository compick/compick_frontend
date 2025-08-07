import React from "react";

export default function ImagePicker({ onSelectImage }) {
  const imageList = [
    "https://picsum.photos/id/1015/200", // 예시 이미지들
    "https://picsum.photos/id/1020/200",
    "https://picsum.photos/id/1030/200",
  ];

  const handleCameraClick = () => {
    alert("카메라 기능은 아직 구현되지 않았습니다.");
  };

  return (
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
        <div
          className="thumbnailBox"
          key={idx}
          onClick={() => onSelectImage(src)}
        >
          <img src={src} className="thumbnailImage" alt={`img-${idx}`} />
        </div>
      ))}
    </div>
  );
}
