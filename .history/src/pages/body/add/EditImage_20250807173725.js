import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
  const location = useLocation();
  const image = location.state?.image;

  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: "더블클릭하여 수정",
      x: 40,
      y: 40,
      fontSize: 24,
      fontFamily: "sans-serif",
      bgColor: "rgba(0,0,0,0.4)",
      editing: false,
    };
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
  };

  const handleMouseDown = (e, id) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const target = texts.find((t) => t.id === id);
    const origin = { x: target.x, y: target.y };

    const move = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      updateText(id, {
        x: origin.x + dx,
        y: origin.y + dy,
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const updateText = (id, changes) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  };

  const handleDoubleClick = (id) => {
    updateText(id, { editing: true });
  };

  const handleTextChange = (e, id) => {
    updateText(id, { text: e.target.value });
  };

  const handleTextBlur = (id) => {
    updateText(id, { editing: false });
  };

  const selectedText = texts.find((t) => t.id === selectedId);

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
        onClick={() => setSelectedId(null)} // 영역 클릭 시 선택 해제
      >
        <img
          src={image}
          alt="preview"
          style={{ width: "100%", display: "block" }}
        />

        {texts.map((t) =>
          t.editing ? (
            <input
              key={t.id}
              autoFocus
              value={t.text}
              onChange={(e) => handleTextChange(e, t.id)}
              onBlur={() => handleTextBlur(t.id)}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                fontSize: t.fontSize,
                fontFamily: t.fontFamily,
                backgroundColor: t.bgColor,
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div
              key={t.id}
              onMouseDown={(e) => handleMouseDown(e, t.id)}
              onDoubleClick={() => handleDoubleClick(t.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(t.id);
              }}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                fontSize: `${t.fontSize}px`,
                fontFamily: t.fontFamily,
                backgroundColor: t.bgColor,
                padding: "6px 10px",
                borderRadius: "12px",
                color: "#fff",
                cursor: "grab",
                userSelect: "none",
              }}
            >
              {t.text}
            </div>
          )
        )}
      </div>

      <button
        onClick={addText}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#4e54c8",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      >
        + 텍스트 추가하기
      </button>

      {selectedText && (
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
          <label>
            글자 크기
            <input
              type="range"
              min={10}
              max={80}
              value={selectedText.fontSize}
              onChange={(e) =>
                updateText(selectedText.id, {
                  fontSize: Number(e.target.value),
                })
              }
              style={{ width: "100%" }}
            />
          </label>

          <label>
            배경색
            <input
              type="color"
              value={selectedText.bgColor}
              onChange={(e) =>
                updateText(selectedText.id, { bgColor: e.target.value })
              }
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
              value={selectedText.fontFamily}
              onChange={(e) =>
                updateText(selectedText.id, { fontFamily: e.target.value })
              }
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
      )}
    </div>
  );
}
