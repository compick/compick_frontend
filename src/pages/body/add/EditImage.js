import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from 'html2canvas';

const EditImage = forwardRef(({ setCapturedImage, imageFromProps }, ref) => {
  const location = useLocation();
  const imageFromState = imageFromProps || location.state?.image || null;
  // transformFromState 및 boxFromState 관련 로직 제거

  // scale, pos 상태 제거

  useEffect(() => {
    if (imageFromState) sessionStorage.setItem("edit.image", imageFromState);
    // transform, box 저장 로직 제거
  }, [imageFromState]);


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
      bgHex: "#000000",   // ✅ 순수 색상 (HEX)
      bgOpacity: 0.4,     // ✅ 투명도(0~1)
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
    if (!target) return;
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

  const handleTouchDragStart = (e, id) => {
      const startX = e.touches[0].clientX;
      const startY = e.touches[0].clientY;
      const target = texts.find((t) => t.id === id);
      if (!target) return;
      const origin = { x: target.x, y: target.y };

      const move = (e) => {
          const dx = e.touches[0].clientX - startX;
          const dy = e.touches[0].clientY - startY;
          updateText(id, { x: origin.x + dx, y: origin.y + dy });
      };

      const up = () => {
          window.removeEventListener("touchmove", move);
          window.removeEventListener("touchend", up);
      };

      window.addEventListener("touchmove", move);
      window.addEventListener("touchend", up);
  };
  //텍스트 배경이미지 투명도 조절
  const hexToRgb = (hex) => {
    let h = hex.replace('#','');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const num = parseInt(h, 16);
    return { r: (num>>16)&255, g: (num>>8)&255, b: num&255 };
  };
  const rgbaString = (hex, a) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  };

  const updateText = (id, changes) => {
      console.log('updateText 호출:', { id, changes });
      setTexts((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, ...changes } : t));
        console.log('텍스트 업데이트 후:', updated);
        return updated;
      });
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
    if (!imageFromState) {
      return <div>이미지 정보가 없습니다. 이전 단계에서 다시 시도해주세요.</div>;
    }
  }, [texts, imageFromState]);

  const captureRef = useRef(); // 캡처할 영역을 위한 ref

  useImperativeHandle(ref, () => ({
    async captureImage() {
      if (!captureRef.current) return null;
      try {
        const canvas = await html2canvas(captureRef.current, {
          useCORS: true, // 외부 이미지가 있다면 필요
          backgroundColor: null, // 배경을 투명하게
        });
        return canvas.toDataURL("image/png");
      } catch (error) {
        console.error("이미지 캡처 실패:", error);
        return null;
      }
    }
  }));

  return (
    <div className="editor-container">
      <div
        ref={captureRef}
        className="image-area"
        // width, height, background 스타일 제거 (이미지에 포함됨)
      >
        <img
          src={imageFromState}
          alt="편집할 이미지"
          className="previewImage"
          // transform 스타일 제거
        />

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
                  transform: `translate(${t.x}px, ${t.y}px)`,
                  fontSize: t.fontSize,
                  fontFamily: t.fontFamily,
                  backgroundColor: rgbaString(t.bgHex, t.bgOpacity), 
                  color: t.color,
                  borderRadius: 6,
                  cursor: "move",
                  userSelect: "none",
                  touchAction: "none",
                }}
              />
            ) : (
              <div
                key={t.id}
                ref={(el) => (textRefs.current[t.id] = el)}
                onWheel={(e) => handleWheel(e, t.id)}
                onTouchStart={(e) => {
                    if (e.touches.length === 1) { // 한 손가락: 드래그
                        handleTouchDragStart(e, t.id);
                    } else if (e.touches.length === 2) { // 두 손가락: 핀치 줌
                        handleTouchStart(e, t.id);
                    }
                }}
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
                className="text-label custom"
                style={{
                  transform: `translate(${t.x}px, ${t.y}px)`,
                  fontSize: t.fontSize,
                  fontFamily: t.fontFamily,
                  backgroundColor: rgbaString(t.bgHex, t.bgOpacity),  
                  "--text-color": t.color,
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
            background: "var(--card-bg) !important",
            border: "1px solid var(--card-border) !important",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
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
                updateText(selectedText.id, { fontSize: Number(e.target.value) })
              }
            />
          </label>
           <label>
            글자색
            <input
              type="color"
              value={selectedText.color}
              onChange={(e) => {
                console.log('글자색 변경:', e.target.value);
                updateText(selectedText.id, { color: e.target.value });
              }}
            />
          </label>

          <label>
            배경색
            <input
              type="color"
              value={selectedText.bgHex}
              onChange={(e) => {
                console.log('배경색 변경:', e.target.value);
                updateText(selectedText.id, { bgHex: e.target.value });
              }}
            />
          </label>
          
          <label style={{ display: "flex", gap: 6 }}>
            배경 투명도
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={selectedText.bgOpacity}
              onChange={(e) => {
                const value = Number(e.target.value);
                console.log('투명도 변경:', value);
                updateText(selectedText.id, { bgOpacity: value });
              }}
              style={{ width: 120 }}
            />
            <span style={{ width: 34, textAlign: "right" }}>
              {Math.round(selectedText.bgOpacity * 100)}%
            </span>
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
});

export default EditImage;