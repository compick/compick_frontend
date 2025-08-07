import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
  const location = useLocation();
  const image = location.state?.image;

  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [toolPosition, setToolPosition] = useState({ top: 0, left: 0 });
  const textRefs = useRef({});

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
    setTexts((prev) => [...prev, newText]);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isToolbar = e.target.closest(".text-toolbar");
      const isText = Object.values(textRefs.current).some((ref) =>
        ref?.contains(e.target)
      );
      if (!isToolbar && !isText) {
        setSelectedId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
  if (selectedId && textRefs.current[selectedId]) {
    const rect = textRefs.current[selectedId].getBoundingClientRect();
    setToolPosition({
      top: rect.top + rect.height + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });
  }
}, [selectedId]);

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
              ref={(el) => (textRefs.current[t.id] = el)}
              onMouseDown={(e) => handleMouseDown(e, t.id)}
              onDoubleClick={() => handleDoubleClick(t.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(t.id);
                const rect = textRefs.current[t.id]?.getBoundingClientRect();
                if (rect) {
                  const offsetX = rect.left + window.scrollX;
                  const offsetY = rect.top + window.scrollY;
                  setToolPosition({ top: offsetY + rect.height + 5, left: offsetX });
                }
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

        {selectedText && (
          <div
            className="text-toolbar"
            style={{
              top: `${toolPosition.top}px`,
              left: `${toolPosition.left}px`,
              position: "absolute",
              zIndex: 1000,
            }}
          >
            <label>
              크기
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
              폰트
              <select
                value={selectedText.fontFamily}
                onChange={(e) =>
                  updateText(selectedText.id, { fontFamily: e.target.value })
                }
              >
                <option value="sans-serif">기본 Sans</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <button className="add-button" onClick={addText}>
        + 텍스트 추가하기
      </button>
    </div>
  );
}
