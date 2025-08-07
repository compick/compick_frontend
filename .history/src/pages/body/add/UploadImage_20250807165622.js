import React, { useRef, useState } from "react";
import ImagePicker from "./ImagePicker";

export default function UploadImage({ selectedImage, setSelectedImage }) {
  const boxRef = useRef(null);
  const [boxSize, setBoxSize] = useState({ width: 300, height: 300 });
  const resizing = useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    resizing.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: boxSize.width,
      startHeight: boxSize.height,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizing.current) return;

    const dx = e.clientX - resizing.current.startX;
    const dy = e.clientY - resizing.current.startY;

    setBoxSize({
      width: Math.max(150, resizing.current.startWidth + dx),
      height: Math.max(150, resizing.current.startHeight + dy),
    });
  };

  const handleMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* 상단 미리보기 영역 */}
      <div
        ref={boxRef}
        className="previewBox"
        style={{ width: boxSize.width, height: boxSize.height }}
      >
        {selectedImage ? (
          <img src={selectedImage} alt="preview" className="previewImage" />
        ) : (
          <div className="noImageText">이미지를 선택해주세요</div>
        )}

        {/* 우측 하단 리사이즈 핸들 */}
        <div className="resizeHandle" onMouseDown={handleMouseDown} />
      </div>

      {/* 하단 이미지 선택기 */}
      <div className="pickerBox">
        <ImagePicker onSelectImage={setSelectedImage} />
      </div>
    </>
  );
}
