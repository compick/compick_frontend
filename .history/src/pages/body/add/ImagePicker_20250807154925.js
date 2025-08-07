import React from "react";

export default function ImagePicker({ onSelectImage }) {
  const imageList = [
    {
      type: "camera",
      label: "카메라",
    },
    {
      type: "default",
      label: "기본",
      src: defaultImage,
    },
    {
      type: "gallery",
      src: "https://picsum.photos/id/1/200/200", // 실제 이미지 경로 또는 URL
    },
    {
      type: "gallery",
      src: "https://picsum.photos/id/2/200/200",
    },
    {
      type: "gallery",
      src: "https://picsum.photos/id/3/200/200",
    },
  ];

  const handleSelect = (item) => {
    if (item.type === "camera") {
      alert("카메라 기능은 아직 구현되지 않았어요.");
    } else if (item.type === "default") {
      onSelectImage(null);
    } else if (item.type === "gallery") {
      onSelectImage(item.src);
    }
  };

  return (
    <div className="imageGrid">
      {imageList.map((item, index) => (
        <div
          key={index}
          className="thumbnailBox"
          onClick={() => handleSelect(item)}
        >
          {item.type === "camera" ? (
            <div className="cameraIcon">📷</div>
          ) : (
            <img src={item.src} alt="thumbnail" className="thumbnailImage" />
          )}
        </div>
      ))}
    </div>
  );
}
