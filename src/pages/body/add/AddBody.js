// AddBody.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UploadImage from "./UploadImage";
import EditImage from "./EditImage";
import WritePost from "./WritePost";

const TITLE_MAP = {
  "/add": "이미지 업로드",
  "/editImage": "이미지 편집",
  "/writePost": "게시글 작성",
};

export default function AddBody({ capturedImage, setCapturedImage }) {
  const location = useLocation();
  const { pathname, state } = location;
  const navigate = useNavigate();
  const title = TITLE_MAP[pathname] ?? "게시글 작성";

  const [selectedImage, setSelectedImage] = useState(null);

  // 🔑 각 단계의 공개 메서드 호출용 ref
  const uploaderRef = useRef(null);
  const editorRef = useRef(null);

  const handleClose = () => navigate("/home");

  // 🚧 라우트 가드: /editImage에 이미지 없이 접근하면 /add로 돌려보내기
  useEffect(() => {
    if (pathname === "/editImage" && !state?.image && !selectedImage) {
      navigate("/add", { replace: true });
    }
  }, [pathname, state, selectedImage, navigate]);

  const handleNext = async () => {
    if (pathname === "/add") {
      // 업로드 단계 → 이미지 여부에 따라 이동
      if (selectedImage) {
        // UploadImage 쪽에서 '현재 프리뷰 상태' 그대로 PNG로 내보낼 수 있으면 우선 사용
        const out = await uploaderRef.current?.exportEdited?.();
        if (out?.dataUrl) {
          navigate("/editImage", {
            state: {
              image: out.dataUrl,
              meta: { width: out.width, height: out.height },
              // info, transform 정보 제거
            },
          });
          return;
        }
        // 실패 시 원본 전달
        navigate("/editImage", { state: { image: selectedImage } });
      } else {
        // 이미지 없으면 바로 작성 페이지
        navigate("/writePost");
      }
      return;
    }

    if (pathname === "/editImage") {
      // 편집 단계 → captureImage 호출
      const capturedDataUrl = await editorRef.current?.captureImage();
      if (capturedDataUrl) {
        setCapturedImage(capturedDataUrl); // App 상태 업데이트
        navigate("/writePost"); // WritePost로 이동
      } else {
        alert("이미지 캡처에 실패했습니다.");
      }
      return;
    }

    // /writePost 단계에선 Next를 안 쓰거나 '발행' 로직으로 교체 권장
  };

  return (
    <div className="uploadContainer">
      <div className="container addpage">
        <button className="closeBtn" onClick={handleClose}>❌</button>
        <div className="pageTitle">{title}</div>
        {(pathname === "/add" || pathname === "/editImage") && (
          <button className="nextBtn" onClick={handleNext}>다음 ▶</button>
        )}
      </div>

      {pathname === "/add" && (
        <UploadImage
          ref={uploaderRef}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}

      {pathname === "/editImage" && (
        <EditImage 
          ref={editorRef} 
          setCapturedImage={setCapturedImage}
        />
      )}

      {pathname === "/writePost" && (
        <WritePost 
          capturedImage={capturedImage}
        />
      )}
    </div>
  );
}
