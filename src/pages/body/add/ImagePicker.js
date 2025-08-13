import React, { useEffect, useState } from "react";

export default function ImagePicker({ onSelectImage }) {
  const [localImages, setLocalImages] = useState([]);

  // 🔄 Base64 → 복원
  useEffect(() => {
    const saved = localStorage.getItem("savedImagesBase64");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalImages(parsed); // { url: base64 } 배열
      } catch (e) {
        console.error("Base64 이미지 복원 실패", e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // 📦 FileReader로 비동기 Base64 인코딩
    Promise.all( //을 통해서 불러오
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: reader.result }); // 파일 읽기
          reader.onerror = reject; //실패 시 
          reader.readAsDataURL(file);
        });
      })
    ).then((base64Images) => {
      const updated = [...localImages, ...base64Images];
      setLocalImages(updated);
      localStorage.setItem("savedImagesBase64", JSON.stringify(updated));
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />

      <div className="imageGrid">
        <div className="thumbnailBox" onClick={() => onSelectImage(null)}>
          <div className="noImageIcon">🚫</div>
          <div className="label">사진 없음</div>
        </div>

        {localImages.map((img, idx) => (
          <div
            className="thumbnailBox"
            key={idx}
            onClick={() => onSelectImage(img.url)}
          >
            <img src={img.url} className="thumbnailImage" alt={`img-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
