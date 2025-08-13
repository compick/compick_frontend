import React from "react";

export default function WritePost({ capturedImage }) {
  // const location = useLocation();
  // const image = location.state?.image;

  return (
    <div className="uploadContainer">
      <h2>새 게시물</h2>
      {capturedImage && (
        <img
          src={capturedImage}
          alt="post"
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      )}

      <textarea placeholder="게시글 설명 작성" className="postText"/>

      <div style={{ marginTop: "16px" }}>
        <button className="tagBtn">
          사람 태그
        </button>
        <button className="tagBtn">
          캡션 추가
        </button>
      </div>

      <div style={{ marginTop: "16px", fontSize: "14px", opacity: 0.7 }}>
        AI 레이블, 공개 범위 등은 커스텀 구현 가능
      </div>

      <button className="postBtn">
        공유
      </button>
    </div>
  );
}
