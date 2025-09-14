import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ImagePicker from "./ImagePicker";
import html2canvas from 'html2canvas';

// ❗ html2canvas/ useNavigate 불필요하므로 제거
// import html2canvas from "html2canvas";

const UploadImage = forwardRef(function UploadImage(
  { selectedImage, setSelectedImage },
  ref
) {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 중앙 기준 오프셋(px)
  const [scale, setScale] = useState(1);                    // 사용자 스케일
  const [baseScale, setBaseScale] = useState(1);            // 프레임 커버 스케일
  const previewRef = useRef(null);
  const imgRef = useRef(null);

  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef(null);

  // 1) 이미지 로드되면 프레임을 가득 채우는 baseScale 계산 (cover)
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
    const el = imgRef.current;
    if (el) {
      if (el.complete) calc();
      else el.addEventListener("load", calc);
    }
    window.addEventListener("resize", calc);
    return () => {
      if (el) el.removeEventListener("load", calc);
      window.removeEventListener("resize", calc);
    };
  }, [selectedImage]);

  // 2) 드래그(마우스)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
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

  // 3) 휠 줌 (passive:false로 preventDefault 허용)
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      const scaleFactor = 0.1;
      const newScale = scale - e.deltaY * scaleFactor * 0.01;
      setScale(Math.max(0.2, Math.min(5, newScale)));
    };
    preview.addEventListener("wheel", wheelHandler, { passive: false });
    return () => preview.removeEventListener("wheel", wheelHandler);
  }, [scale]);

  // 4) 터치(드래그/핀치)
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
    return Math.hypot(dx, dy);
  };

  // 5) 고정 해상도 (필요 시 조정 가능)
  const EXPORT_W = 1080;
  const EXPORT_H = 1080;

  // 6) “보이는 그대로” 내보내기: 중앙 앵커 기준(화면과 동일 수식)
  const exportPreviewToImage = async () => {
    if (!previewRef.current || !imgRef.current) return null;

    const frame = previewRef.current;
    const img = imgRef.current;

    if (!img.complete) {
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
    }
    if (!img.naturalWidth || !img.naturalHeight) return null;

    const rect = frame.getBoundingClientRect();
    const bg = getComputedStyle(frame).backgroundColor || "#111";

    // 프레임 → 캔버스 매핑
    const sx = EXPORT_W / rect.width;
    const sy = EXPORT_H / rect.height;

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_W;
    canvas.height = EXPORT_H;
    const ctx = canvas.getContext("2d");

    // 배경
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, EXPORT_W, EXPORT_H);

    // 화면과 동일한 배율(= baseScale * scale)
    const appliedScale = baseScale * scale;
    const renderW = img.naturalWidth * appliedScale;
    const renderH = img.naturalHeight * appliedScale;

    // 프레임 중앙
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 화면 수식과 동일: 중앙 기준 오프셋 → 좌상단
    const left = (cx + position.x) - renderW / 2;
    const top  = (cy + position.y) - renderH / 2;

    // 좌표계 매핑 후 그리기
    ctx.setTransform(sx, 0, 0, sy, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, left, top, renderW, renderH);

    const dataUrl = canvas.toDataURL("image/png");

    return {
      dataUrl,
      bg,
      width: EXPORT_W,
      height: EXPORT_H,
      original: {
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        baseScale,
        userScale: scale,
        appliedScale,
        position: { x: position.x, y: position.y },
        anchor: "center",
      },
    };
  };

  // 7) 부모에서 호출할 수 있게 메서드 노출
  useImperativeHandle(ref, () => ({
    async exportEdited() {
      if (!previewRef.current || !selectedImage) {
        console.error("Preview element or image not found for capture.");
        return null;
      }
      try {
        const canvas = await html2canvas(previewRef.current, {
          useCORS: true,
          backgroundColor: null, // 배경 투명하게
        });
        const dataUrl = canvas.toDataURL("image/png");
        return {
          dataUrl: dataUrl,
          width: canvas.width,
          height: canvas.height,
          // transform 정보는 이제 전달하지 않음
        };
      } catch (error) {
        console.error("Image capture failed:", error);
        return null;
      }
    },
  }));

  return (
    <>
    <div className="container">
      <div
        ref={previewRef}
        className="previewBox"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ touchAction: "none", position: "relative", overflow: "hidden" }}
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
              position: "absolute",
              left: "50%",
              top: "50%",
              // ✅ 중앙 앵커 방식으로 통일 (화면 = 내보내기)
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${baseScale * scale})`,
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
    </div>  
    </>
  );
});

export default UploadImage;
