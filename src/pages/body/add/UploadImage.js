import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImagePicker from "./ImagePicker";

export default function UploadImage({ selectedImage, setSelectedImage }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const previewRef = useRef(null);
  const imgRef = useRef(null);

  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);

  const navigate = useNavigate();

  // 이미지 로드되면 박스 크기에 맞춰 baseScale 계산 (cover)
  useEffect(() => {
    if (!selectedImage) return;
    const calc = () => {
      const box = previewRef.current?.getBoundingClientRect();
      const img = imgRef.current;
      if (!box || !img || !img.naturalWidth) return;
      const sCover = Math.max(
        box.width / img.naturalWidth,
        box.height / img.naturalHeight
      );
      setBaseScale(sCover);
    };
    const onLoad = () => calc();
    const onResize = () => calc();

    const el = imgRef.current;
    if (el) {
      if (el.complete) calc();
      else el.addEventListener("load", onLoad);
    }
    window.addEventListener("resize", onResize);
    return () => {
      if (el) el.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
    };
  }, [selectedImage]);

  // 🖱 마우스 드래그
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 좌클릭만
    e.preventDefault();
    e.stopPropagation();
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

  // 🔍 휠 줌
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    const newScale = scale - e.deltaY * scaleFactor * 0.01;
    setScale(Math.max(0.2, Math.min(5, newScale)));
  };

  // 🤏 터치
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      start.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      lastTouchDistance.current = getDistance(e.touches[0], e.touches[1]);
    }
  };
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
  const getDistance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 고정 해상도로 뽑고 싶으면 사용 (없애고 boxRect 그대로 써도 됨)
  const exportW = 1080;
  const exportH = 1080;

  const exportPreviewToImage = async () => {
    if (!previewRef.current || !imgRef.current || !selectedImage) return;

    const boxRect = previewRef.current.getBoundingClientRect();
    const imgEl = imgRef.current;

    // 1) 캔버스 크기 결정
    const useFixed = true; // 고정 1080x1080로 뽑기
    const canvas = document.createElement("canvas");
    canvas.width  = useFixed ? exportW : Math.round(boxRect.width);
    canvas.height = useFixed ? exportH : Math.round(boxRect.height);
    const ctx = canvas.getContext("2d");

    // 2) 배경 칠하기 (previewBox와 동일)
    const bg = getComputedStyle(previewRef.current).backgroundColor || "#111";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3) 화면 좌표 → 캔버스 좌표 스케일(고정 해상도일 때만 필요)
    const sx = canvas.width  / boxRect.width;
    const sy = canvas.height / boxRect.height;

    // 4) 이미지 실제 렌더 크기/위치 계산 (미리보기 로직 그대로)
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgEl.src;
    await new Promise(r => (img.complete ? r() : (img.onload = r)));

    const renderScale = (baseScale * scale); // 화면에서 쓰던 총 스케일
    const renderW = img.naturalWidth  * renderScale;  // 화면상의 픽셀 단위
    const renderH = img.naturalHeight * renderScale;

    const cx = boxRect.width / 2;
    const cy = boxRect.height / 2;

    // 화면에서 이미지 중심이 (cx + position.x, cy + position.y)
    // 이므로 좌상단은:
    const left = (cx + position.x) - (renderW / 2);
    const top  = (cy + position.y) - (renderH / 2);

    // 5) 변환 없이, 목적지 사각형으로 바로 그리기 (=> 화면과 동일 위치)
    ctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight, // 원본 소스 사각형
      Math.round(left   * sx),
      Math.round(top    * sy),
      Math.round(renderW * sx),
      Math.round(renderH * sy)
    );

    return {
      dataUrl: canvas.toDataURL("image/png"),
      box: {
        width:  canvas.width,
        height: canvas.height,
        background: bg,
      },
    };
  };


  const goEdit = async () => {
    const out = await exportPreviewToImage();
    if (!out) return;

    // --- 디버깅 단계 ---
    // 생성된 이미지가 올바른지 새 탭에서 확인합니다.
    const newWindow = window.open();
    newWindow.document.write(`<img src="${out.dataUrl}" alt="test image" />`);
    // --- 디버깅 끝 ---

    // 확인을 위해 기존 코드는 잠시 주석 처리합니다.
    /*
    const previewBoxStyle = getComputedStyle(previewRef.current);
  
    navigate("/edit", {
      state: {
        image: out.dataUrl,
        box: {
          ...out.box,
          // previewBox의 실제 스타일 정보 추가
          backgroundColor: previewBoxStyle.backgroundColor,
          borderRadius: previewBoxStyle.borderRadius,
          boxShadow: previewBoxStyle.boxShadow,
          padding: previewBoxStyle.padding,
          margin: previewBoxStyle.margin,
        },
        original: selectedImage,
        transform: { position, scale, baseScale },
      },
    });
    */
  };


  return (
    <>
      <div
        ref={previewRef}
        className="previewBox"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ touchAction: "none", position: "relative" }}
      >
        {selectedImage ? (
          <img
            ref={imgRef}
            src={selectedImage}
            alt="preview"
            className="draggableImage"
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${baseScale * scale})`,
              transformOrigin: "center center",
              position: "absolute",
              left: "50%",
              top: "50%",
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

      <button onClick={goEdit} disabled={!selectedImage}>
        다음(편집화면으로)
      </button>
    </>
  );
}
