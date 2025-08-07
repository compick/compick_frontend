import React, { useState, useRef } from "react";
import ImagePicker from "./ImagePicker";

export default function UploadImage({ selectedImage, setSelectedImage }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    dragging.current = true;
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const newX = e.clientX - start.current.x;
    const newY = e.clientY - start.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div className="previewBox">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="preview"
            className="draggableImage"
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          />
        ) : (
          <div className="noImageText">이미지를 선택해주세요</div>
        )}
      </div>

      <div className="pickerBox">
        <ImagePicker onSelectImage={(img) => {
          setSelectedImage(img);
          setPosition({ x: 0, y: 0 }); // 새 이미지 선택 시 위치 초기화
        }} />
      </div>
    </>
  );
}
