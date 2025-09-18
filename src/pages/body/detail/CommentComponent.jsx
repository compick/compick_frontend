import React, { useState, useEffect } from "react";
import { getReplies } from "../../../api/Comment";


export default function CommentComponent({
  comment,
  postId,
  onLikeComment,
  onAddReply,
  onMention,
  currentUser,
  level,
  ...props
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies ||[]);

  useEffect(() => {
    if (!comment?.commentId) return;
    const fetchReplies = async () => {
      try {
        const data = await getReplies(comment.commentId); // ✅ parentId = commentId
        console.log("대댓글 목록:", data);
        setReplies(data);
      } catch (err) {
        console.error("대댓글 불러오기 실패:", err);
      }
    };
    fetchReplies();
  }, [comment?.commentId]);

  // 대댓글 등록 이벤트
  const handleReplySubmit = () => {
    if (replyText.trim() === "") return;
    onAddReply(postId, comment.commentId ?? comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  // ✅ likedBy 방어 처리
  const likedBy = comment.likedBy ?? [];
  const isLiked = likedBy.includes(currentUser?.name ?? "");

  return (
    <div className="comment-container">
      <div
        className="comment-main"
        onDoubleClick={() => onMention?.(comment.userNickname ?? comment.user)}
      >
        <div className="comment-author">
          
        </div>
        <div className="comment-text">{comment.content ?? comment.text}</div>
        <div className="comment-actions">
        <span className="comment-created-at">
          {new Date(comment.createdAt).toLocaleString("ko-KR")} | {" "}작성자 : { " "}
          {comment.userNickname ?? comment.user}
        </span>
        
          {level === 0 && (
            <button onClick={() => setIsReplying((prev) => !prev)}>
              답글 달기
            </button>
          )}
        </div>
      </div>

      {/* 답글 입력 */}
      {isReplying && (
        <div className="reply-input-area">
          <input
            type="text"
            placeholder="답글을 입력하세요..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={handleReplySubmit}>등록</button>
        </div>
      )}

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {console.log(`댓글 ${comment.commentId}의 대댓글 렌더링:`, comment.replies)}
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.commentId ?? reply.id}
              comment={reply}
              postId={postId}
              onLikeComment={onLikeComment}
              onAddReply={onAddReply}
              onMention={onMention}
              currentUser={currentUser}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
