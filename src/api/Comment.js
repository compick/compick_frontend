import { apiJson ,apiForm} from "./apiClient";


export async function addComment({ boardId, content, parentCommentId, replyCommentId }) {
  const formData = new FormData();
  formData.append("content", content);

  if (parentCommentId) {
    formData.append("parentCommentId", parentCommentId);
  }

  if (replyCommentId) {
    formData.append("replyCommentId", replyCommentId);
  }

  // boardId는 URL 경로에 포함
  return await apiForm(`/api/comment/${boardId}`, formData);
}
export async function getComment({ boardId }) {
  return await apiJson(`/api/comments/list`, { method: "GET", params: { boardId } });
}
