import React, { useEffect, useState } from "react";

export default function ImagePicker({ onSelectImage }) {
  const [localImages, setLocalImages] = useState([]);

  // ✅ 초기 mount 시 localStorage에서 이미지 복원
  useEffect(() => {
    const saved = localStorage.getItem("savedImages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalImages(parsed);
      } catch (e) {
        console.error("이미지 복원 실패:", e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = [...localImages, ...newImages];
    setLocalImages(updatedImages);

    // ✅ 이미지 URL만 localStorage에 저장 (file은 저장 불가)
    localStorage.setItem(
      "savedImages",
      JSON.stringify(
        updatedImages.map((img) => ({ url: img.url })) // file 제외
      )
    );
  };

  return (
    <div>
      {/* 파일 선택 */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />

      <div className="imageGrid">
        {/* 사진 없음 */}
        <div className="thumbnailBox" onClick={() => onSelectImage(null)}>
          <div className="noImageIcon">🚫</div>
          <div className="label">사진 없음</div>
        </div>

        {/* 썸네일들 */}
        {localImages.map((img, idx) => (
          <div
            className="thumbnailBox"
            key={idx}
            onClick={() => onSelectImage(img.url)}
          >
            <img
              src={img.url}
              className="thumbnailImage"
              alt={`img-${idx}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
