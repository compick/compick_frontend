import React from "react";
import { useLocation } from "react-router-dom";

export default function WritePost() {
  const location = useLocation();
  const image = location.state?.image;

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "16px" }}>
      <h2>새 게시물</h2>
      {image && (
        <img
          src={image}
          alt="post"
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      )}

      <textarea
        placeholder="캡션 추가..."
        style={{
          width: "100%",
          height: "80px",
          padding: "8px",
          borderRadius: "8px",
          resize: "none",
        }}
      />

      <div style={{ marginTop: "16px" }}>
        <button style={{ background: "#333", color: "#fff", padding: "10px", margin: "5px" }}>
          📍 위치 추가
        </button>
        <button style={{ background: "#333", color: "#fff", padding: "10px", margin: "5px" }}>
          🎵 음악 추가
        </button>
      </div>

      <div style={{ marginTop: "16px", fontSize: "14px", opacity: 0.7 }}>
        AI 레이블, 공개 범위 등은 커스텀 구현 가능
      </div>

      <button
        style={{
          marginTop: "20px",
          width: "100%",
          background: "#4e54c8",
          padding: "12px",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
        }}
      >
        공유
      </button>
    </div>
  );
}
