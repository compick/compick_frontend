// WritePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBoard } from "../../../api/Board";
import { getCookie, setCookie } from "../../../utils/Cookie";

async function ensureAccessToken() {
  // 액세스 토큰이 없으면 refresh 호출해서 갱신
  let at = getCookie("jwt");
  if (at) return at;

  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",   // ★ rt(HttpOnly) 쿠키 전송
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.msg || `HTTP_${res.status}`);

  at = data?.data?.accessToken;
  if (!at) throw new Error("NO_ACCESS_TOKEN");
  // 프로젝트 규칙대로 저장(여기선 쿠키 'jwt')
  setCookie("jwt", at, 60 * 50); // 예: 50분
  return at;
}

export default function WritePost({ capturedImage }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShare = async (e) => {
    e?.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1) 토큰 확보
      const token = await ensureAccessToken();

      // 2) 이미지 준비
      const boardImages = [];
      if (capturedImage) {
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        const file = new File([blob], "capture.png", { type: "image/png" });
        boardImages.push(file);
      }

      // 3) 업로드
      // 핵심은 addBoard가 apiFetch + FormData를 사용하게 만드는 것뿐!
      const result = await addBoard({
        content,
        matchtagList: [],
        boardImages,
        token,   // ensureAccessToken() 반환값
      });
      if (result.code === 200) {
        alert("게시글이 성공적으로 등록되었습니다!");
        setContent("");
        navigate("/", { replace: true });
      } else {
        alert("게시글 등록 실패: " + (result.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("게시글 등록 중 오류:", err);
      alert(`게시글 등록 실패: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadContainer">
      <h2>새 게시물</h2>

      {capturedImage && (
        <img
          src={capturedImage}
          alt="post"
          style={{ width: "100%", maxWidth: 400, borderRadius: 8, marginBottom: 16 }}
        />
      )}

      <textarea
        placeholder="게시글 설명 작성"
        className="postText"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="button" className="postBtn" onClick={handleShare} disabled={loading}>
        {loading ? "업로드 중..." : "공유"}
      </button>
    </div>
  );
}
