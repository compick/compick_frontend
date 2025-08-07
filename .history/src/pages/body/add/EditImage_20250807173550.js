import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
  const location = useLocation();
  const image = location.state?.image;

  const [text, setText] = useState("텍스트 입력");
  const [fontSize, setFontSize] = useState(24);
  const [bgColor, setBgColor] = useState("rgba(0,0,0,0.4)");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [drag, setDrag] = useState({ x: 40, y: 40 });

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = drag.x;
    const originY = drag.y;

    const move = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setDrag({ x: originX + dx, y: originY + dy });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        fontFamily: "system-ui",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "16px", fontWeight: 500 }}>✨ 이미지 꾸미기</h2>

      <div
        style={{
          position: "relative",
          width: "320px",
          height: "auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <img
          src={image}
          alt="preview"
          style={{
            width: "100%",
            display: "block",
          }}
        />

        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: drag.x,
            top: drag.y,
            fontSize: `${fontSize}px`,
            fontFamily,
            backgroundColor: bgColor,
            padding: "6px 10px",
            borderRadius: "12px",
            color: "#fff",
            cursor: "grab",
            userSelect: "none",
            transition: "background 0.2s",
          }}
        >
          {text}
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트 입력"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#222",
            color: "#fff",
            fontSize: "16px",
          }}
        />

        <label>
          글자 크기
          <input
            type="range"
            min={10}
            max={80}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          배경색
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{
              width: "100%",
              height: "36px",
              border: "none",
              borderRadius: "8px",
              background: "#222",
            }}
          />
        </label>

        <label>
          폰트 선택
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#222",
              color: "#fff",
            }}
          >
            <option value="sans-serif">기본 Sans</option>
            <option value="serif">우아한 Serif</option>
            <option value="monospace">타자기 느낌</option>
            <option value="cursive">손글씨 느낌</option>
          </select>
        </label>
      </div>
    </div>
  );
}
