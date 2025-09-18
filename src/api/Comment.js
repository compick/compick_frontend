import { apiJson, apiForm } from "./apiClient";

// ✅ 댓글 작성
export async function addComment({ boardId, content }) {
  const formData = new FormData();
  formData.append("content", content);

  // boardId는 URL 경로에 포함됨
  return await apiForm(`/api/comments/${boardId}`, formData);
}

// ✅ 대댓글 작성
export async function addReply({ boardId, parentId, content }) {
  const formData = new FormData();
  formData.append("content", content);

  return await apiForm(`/api/comments/${boardId}/reply/${parentId}`, formData);
}

// ✅ 게시글별 댓글 조회 (최상위 댓글만)
export async function getComment(boardId) {
  const url = `/api/comments/board/${encodeURIComponent(boardId)}`;
  return await apiJson(url, { method: "GET" });
}

// ✅ 특정 댓글의 대댓글 조회
export async function getReplies(parentId) {
  const url = `/api/comments/replies/${encodeURIComponent(parentId)}`;
  return await apiJson(url, { method: "GET" });
}

// ✅ 로그인된 사용자가 작성한 댓글 조회
export async function getMyComments() {
  return await apiJson("/api/comments/me", { method: "GET" });
}
