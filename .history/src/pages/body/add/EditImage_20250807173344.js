import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
  const location = useLocation();
  const [text, setText] = useState("텍스트 입력");
  const [fontSize, setFontSize] = useState(20);
  const [bgColor, setBgColor] = useState("transparent");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [drag, setDrag] = useState({ x: 50, y: 50 });

  const image = location.state?.image;

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>이미지 편집</h2>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={image} alt="preview" style={{ width: "300px" }} />

        <div
          style={{
            position: "absolute",
            left: drag.x,
            top: drag.y,
            fontSize: `${fontSize}px`,
            fontFamily,
            backgroundColor: bgColor,
            padding: "4px",
            cursor: "move",
          }}
          onMouseDown={handleMouseDown}
        >
          {text}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트 입력"
        />
        <br />
        <label>크기: </label>
        <input
          type="range"
          min={10}
          max={80}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <br />
        <label>배경색: </label>
        <input type="color" onChange={(e) => setBgColor(e.target.value)} />
        <br />
        <label>폰트: </label>
        <select onChange={(e) => setFontFamily(e.target.value)}>
          <option value="sans-serif">기본</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>
      </div>
    </div>
  );
}
