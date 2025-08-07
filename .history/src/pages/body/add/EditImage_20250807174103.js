import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
  const location = useLocation();
  const image = location.state?.image;

  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [toolPosition, setToolPosition] = useState({ top: 0, left: 0 });
const textRefs = useRef({}); // 텍스트 DOM 저장용
  const addText = () => {
    const newText = {
      id: Date.now(),
      text: "더블클릭하여 수정",
      x: 40,
      y: 40,
      fontSize: 24,
      fontFamily: "sans-serif",
      bgColor: "rgba(0,0,0,0.4)",
      color: "#ffffff",
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
      updateText(id, { x: origin.x + dx, y: origin.y + dy });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const updateText = (id, changes) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const handleDoubleClick = (id) => updateText(id, { editing: true });

  const handleTextChange = (e, id) => updateText(id, { text: e.target.value });

  const handleTextBlur = (id) => updateText(id, { editing: false });

  const selectedText = texts.find((t) => t.id === selectedId);

  return (
    <div className="editor-container">
      <h2 className="title">✨ 이미지 꾸미기</h2>

      <div className="image-area" onClick={() => setSelectedId(null)}>
        <img src={image} alt="preview" className="preview-image" />

        {texts.map((t) =>
          t.editing ? (
            <input
              key={t.id}
              autoFocus
              value={t.text}
              onChange={(e) => handleTextChange(e, t.id)}
              onBlur={() => handleTextBlur(t.id)}
              className="text-input"
              style={{
                left: t.x,
                top: t.y,
                fontSize: t.fontSize,
                fontFamily: t.fontFamily,
                backgroundColor: t.bgColor,
                color: t.color,
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
              className="text-label"
              style={{
                left: t.x,
                top: t.y,
                fontSize: t.fontSize,
                fontFamily: t.fontFamily,
                backgroundColor: t.bgColor,
                color: t.color,
              }}
            >
              {t.text}
            </div>
          )
        )}
      </div>

      <button className="add-button" onClick={addText}>
        + 텍스트 추가하기
      </button>

      {selectedText && (
        <div className="text-controls">
          <label>
            글자 크기
            <input
              type="range"
              min={10}
              max={80}
              value={selectedText.fontSize}
              onChange={(e) =>
                updateText(selectedText.id, { fontSize: Number(e.target.value) })
              }
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
            />
          </label>

          <label>
            글자색
            <input
              type="color"
              value={selectedText.color}
              onChange={(e) =>
                updateText(selectedText.id, { color: e.target.value })
              }
            />
          </label>

          <label>
            폰트 선택
            <select
              value={selectedText.fontFamily}
              onChange={(e) =>
                updateText(selectedText.id, { fontFamily: e.target.value })
              }
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
