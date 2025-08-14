import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import UploadImage from "./add/UploadImage";

const TITLE_MAP = {
  "/add": "이미지 업로드",
  "/editImage": "이미지 편집",
  "/writePost": "게시글 작성",
};
export default function AddBody() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // 🔑 자식 공개 메서드 호출용 ref
  const uploaderRef = useRef(null);

  const handleClose = () => navigate("/home");

  // ▶ 다음 버튼
  const handleNext = async () => {
    if (selectedImage) {
      // 🔑 자식이 내보내는 메서드 호출 (편집 상태 그대로 캡처)
      const out = await uploaderRef.current?.exportEdited?.();
      if (out?.dataUrl) {
        navigate("/editImage", {
          state: {
            image: out.dataUrl, // ✅ 편집된 결과(캔버스 PNG dataURL)
            meta: { width: out.width, height: out.height, background: out.bg },
            info: out.original, // 원본/편집 상태(옵션)
          },
        });
        return;
      }
      // fallback: 편집 캡처 실패 시, 원본이라도 넘김
      navigate("/editImage", { state: { image: selectedImage } });
    } else {
      navigate("/writePost");
    }
  };

  return (
    <div className="uploadContainer">
      <div className="container addpage">
        <button className="closeBtn" onClick={handleClose}>❌</button>
        <div className="pageTitle">게시글 작성</div>
        <button className="nextBtn" onClick={handleNext}>다음 ▶</button>
      </div>

      {/* 🔑 ref 전달 */}
      <UploadImage
        ref={uploaderRef}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
}