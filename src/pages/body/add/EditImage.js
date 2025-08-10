import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function EditImage() {
    const location = useLocation();
    const imageFromState = location.state?.image || null;
    const boxFromState = location.state?.box || null;
    const image = imageFromState ?? sessionStorage.getItem("edit.image");
    const box = boxFromState ?? JSON.parse(sessionStorage.getItem("edit.box") || "null");

    useEffect(() => {
      if (imageFromState) sessionStorage.setItem("edit.image", imageFromState);
      if (boxFromState) sessionStorage.setItem("edit.box", JSON.stringify(boxFromState));
    }, [imageFromState, boxFromState]);


    const [texts, setTexts] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [toolPosition, setToolPosition] = useState({ top: 0, left: 0 });
    const textRefs = useRef({});
    
    //화면 핀치 확대축소 변수
    const pinchStartDistance = useRef(null);
    const initialFontSize = useRef(null);

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

    // 핀치 이벤트 추가
    const handleTouchStart = (e, id) => {
        if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          pinchStartDistance.current = Math.sqrt(dx * dx + dy * dy);

          const target = texts.find((t) => t.id === id);
          if (target) { initialFontSize.current = target.fontSize;}
        }
      };
    // 텍스트 이동 기능
    const handleTouchMove = (e, id) => {
      if (e.touches.length === 2 && pinchStartDistance.current && initialFontSize.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        const scale = currentDistance / pinchStartDistance.current;
        const newFontSize = Math.max(10, Math.min(100, initialFontSize.current * scale));
        updateText(id, { fontSize: newFontSize });
      }
    };
    // 바깥 클릭 시 선택 해제
    useEffect(() => {
        const handleClickOutside = (e) => {
          const isToolbar = e.target.closest(".text-toolbar");
          const isText = Object.values(textRefs.current).some((ref) =>ref?.contains(e.target));
          if (!isToolbar && !isText) {setSelectedId(null);}
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // 툴바 위치 지정 (선택 / 텍스트 변경 반응)
    useEffect(() => {
    if (selectedId && textRefs.current[selectedId]) {
        const rect = textRefs.current[selectedId].getBoundingClientRect();
        setToolPosition({
        top: rect.top + rect.height + window.scrollY + 5,
        left: rect.left + window.scrollX,
        });
    }
    }, [selectedId, texts]);

    // 글자크기 휠로 조정기능
    const handleWheel = (e, id) => {
        e.preventDefault();
        const delta = e.deltaY;
        const change = delta > 0 ? -1 : 1; // 휠 위로 → 확대, 아래로 → 축소
        const target = texts.find((t) => t.id === id);
        if (!target) return;
        const newSize = Math.max(10, Math.min(100, target.fontSize + change));
        updateText(id, { fontSize: newSize });
    };

    //배열 안전 가드(디버그)
    useEffect(() => {
      if (!Array.isArray(texts)) {
        console.warn("texts is not array", { texts });
      }
      if (!image) {
        return <div>이미지 정보가 없습니다. 이전 단계에서 다시 시도해주세요.</div>;
      }
    }, [texts]);

  return (
    <div className="editor-container">
      <h2 className="title">✨ 이미지 꾸미기</h2>
      <div
        className="previewBox"
        style={{
          width: box?.width || 742,
          height: box?.height || 742,
          backgroundColor: box?.backgroundColor ?? box?.background ?? "#111",

          // --- 수정된 부분 ---
          // UploadImage에서 넘어온, 이미 잘려진 이미지를 배경으로 사용합니다.
          backgroundImage: `url(${image})`,
          // 'cover'나 'center' 대신, 컨테이너를 100% 꽉 채우도록 설정합니다.
          // 이렇게 하면 원본 dataURL 이미지가 왜곡이나 추가적인 잘림 없이 그대로 표시됩니다.
          
          backgroundRepeat: "no-repeat",
          // --- 수정 끝 ---
          
          borderRadius: box?.borderRadius || "16px",
          boxShadow: box?.boxShadow || "0 8px 24px rgba(0, 0, 0, 0.4)",
          padding: box?.padding || "0",
          margin: box?.margin || "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* <img> 태그는 더 이상 필요 없으므로 비워둡니다. */}

        {/* ✅ 진짜 렌더를 넣어야 함 + 배열 가드 */}
        {Array.isArray(texts) &&
          texts.map((t) =>
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
                onWheel={(e) => handleWheel(e, t.id)}
                onTouchStart={(e) => handleTouchStart(e, t.id)}
                onTouchMove={(e) => handleTouchMove(e, t.id)}
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
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  fontSize: t.fontSize,
                  fontFamily: t.fontFamily,
                  backgroundColor: t.bgColor,
                  color: t.color,
                  padding: "6px 8px",
                  borderRadius: 6,
                  cursor: "move",
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                {t.text}
              </div>
            )
          )}
      </div>

      {/* 툴바 */}
      {selectedText && (
        <div
          className="text-toolbar"
          style={{
            top: `${toolPosition.top}px`,
            left: `${toolPosition.left}px`,
            position: "absolute",
            zIndex: 1000,
            display: "flex",
            gap: 8,
            padding: 8,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
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
                updateText(selectedText.id, { fontSize: Number(e.target.value) })
              }
            />
          </label>

          <label>
            배경색
            <input
              type="color"
              // NOTE: rgba를 바로 color input에 넣으면 안 됨
              // 간단히: rgba면 기본값 대체
              value={
                /^#/.test(selectedText.bgColor) ? selectedText.bgColor : "#000000"
              }
              onChange={(e) => updateText(selectedText.id, { bgColor: e.target.value })}
            />
          </label>

          <label>
            글자색
            <input
              type="color"
              value={selectedText.color}
              onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
            />
          </label>

          <label>
            폰트
            <select
              value={selectedText.fontFamily}
              onChange={(e) => updateText(selectedText.id, { fontFamily: e.target.value })}
            >
              <option value="sans-serif">기본 Sans</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
            </select>
          </label>
        </div>
      )}

      <button className="add-button" onClick={addText}>
        + 텍스트 추가하기
      </button>
    </div>
  );
}