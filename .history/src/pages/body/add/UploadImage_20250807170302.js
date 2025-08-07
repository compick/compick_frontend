import React, { useRef, useState } from "react";
import ImagePicker from "./ImagePicker";
import "./UploadImage.css";

export default function UploadImage({ selectedImage, setSelectedImage }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);

  // 🖱 마우스 드래그
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
    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // 🔍 마우스 휠 확대/축소
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    const newScale = scale - e.deltaY * scaleFactor * 0.01;
    setScale(Math.max(0.2, Math.min(5, newScale)));
  };

  // 🤏 터치 시작
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      start.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      lastTouchDistance.current = dist;
    }
  };

  // 📱 터치 이동
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - start.current.x,
        y: e.touches[0].clientY - start.current.y,
      });
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const delta = dist - lastTouchDistance.current;
      const scaleFactor = 0.005;
      const newScale = scale + delta * scaleFactor;
      setScale(Math.max(0.2, Math.min(5, newScale)));
      lastTouchDistance.current = dist;
    }
  };

  // 거리 계산
  const getDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <>
      <div
        className="previewBox"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="preview"
            className="draggableImage"
            onMouseDown={handleMouseDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <div className="noImageText">이미지를 선택해주세요</div>
        )}
      </div>

      <div className="pickerBox">
        <ImagePicker
          onSelectImage={(img) => {
            setSelectedImage(img);
            setPosition({ x: 0, y: 0 });
            setScale(1);
          }}
        />
      </div>
    </>
  );
}
