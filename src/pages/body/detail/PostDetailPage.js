import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { apiJson } from "../../../api/apiClient"; 
import { toggleLike, getPostDetail } from "../../../api/Board";
import { toast } from "react-toastify";
import { addComment, addReply, getComment, getReplies } from "../../../api/Comment";
import CommentComponent from "./CommentComponent";  

export default function PostDetailPage({ 
  boardId: propBoardId, 
  initialPost: propInitialPost, 
  currentUser, 
  onAddComment, 
  onLikeComment, 
  onAddReply, 
  onLikePost, 
  onReport, 
  isInSidebar = false 
}) {
  const { boardId: urlBoardId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const boardId = propBoardId || urlBoardId;
  const initialPostData = propInitialPost || location.state?.post || null;

  const [post, setPost] = useState(initialPostData || null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);

  // ✅ 게시글 상세 불러오기
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiJson(`/api/board/detail/${boardId}`, { method: "GET" });
        setPost(res.data || res);
      } catch (err) {
        console.error("게시글 상세 불러오기 실패:", err);
      }
    };
    if (boardId) fetchDetail();
  }, [boardId]);

  // ✅ 댓글과 대댓글 불러오기
  const fetchCommentsWithReplies = async () => {
    if (!boardId) return;
    try {
      const commentsData = await getComment(boardId);
      console.log("댓글 목록:", commentsData);
      
      // 각 댓글에 대한 대댓글 불러오기
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          try {
            const repliesData = await getReplies(comment.commentId);
            console.log(`댓글 ${comment.commentId}의 대댓글:`, repliesData);
            return {
              ...comment,
              replies: repliesData || []
            };
          } catch (err) {
            console.error(`댓글 ${comment.commentId}의 대댓글 불러오기 실패:`, err);
            return {
              ...comment,
              replies: []
            };
          }
        })
      );
      
      setComments(commentsWithReplies);
      console.log("댓글과 대댓글 연결 완료:", commentsWithReplies);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchCommentsWithReplies();
  }, [boardId]);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // ✅ 좋아요 기능
  const handleLikePost = async (boardId) => {
    try {
      const res = await toggleLike(boardId);
      const payload = res?.data ?? res;
      const liked = payload?.liked;
      const likeCount = payload?.likeCount;

      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likedByMe: liked ?? prev.likedByMe,
          likeCount: typeof likeCount === "number" ? likeCount : prev.likeCount,
        };
      });

      const fresh = await getPostDetail(boardId);
      setPost(fresh?.data ?? fresh);
    } catch (error) {
      console.error("[handleLikePost] 좋아요 실패:", error);
    }
  };

  // ✅ 댓글 추가
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      await addComment({ boardId: boardId, content: newComment });
      toast.success("댓글이 등록되었습니다!");
      setNewComment("");
      await fetchCommentsWithReplies(); // 댓글과 대댓글 전체 다시 불러오기
      onAddComment?.(boardId, newComment);
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  // ✅ 대댓글 추가
  const handleAddReply = async (postId, parentCommentId, replyText) => {
    try {
      await addReply({ boardId: postId, parentId: parentCommentId, content: replyText });
      toast.success("답글이 등록되었습니다!");
      await fetchCommentsWithReplies(); // 댓글과 대댓글 전체 다시 불러오기
      onAddReply?.(postId, parentCommentId, replyText);
    } catch (error) {
      console.error("답글 등록 실패:", error);
      toast.error("답글 등록에 실패했습니다.");
    }
  };

  // ✅ 댓글 좋아요
  const handleLikeComment = async (postId, commentId) => {
    try {
      console.log("댓글 좋아요:", postId, commentId);
      await fetchCommentsWithReplies(); // 댓글과 대댓글 전체 다시 불러오기
      onLikeComment?.(postId, commentId);
    } catch (error) {
      console.error("댓글 좋아요 실패:", error);
      toast.error("댓글 좋아요에 실패했습니다.");
    }
  };

  // ✅ 멘션
  const handleMention = (username) => {
    setNewComment((prev) => `${prev}@${username} `);
    commentInputRef.current?.focus();
  };

  // ✅ 공유
  const handleSharePost = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("📋 게시글 링크가 복사되었습니다!");
    } catch (err) {
      console.error("링크 복사 실패:", err);
      toast.error("❌ 링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className={`post-detail-container ${isInSidebar ? "sidebar-mode" : "fullpage-mode"}`}>
      {/* 게시글 */}
      <div className="post-detail-header">
        {!isInSidebar && <button onClick={() => navigate(-1)}>← 뒤로가기</button>}
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.userNickname || post.author}</span>
          <span>작성일: {new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
        </div>
        {post.fileData && <img src={post.fileData} alt={post.title} className="post-image" />}
        <p className="post-content">{post.content}</p>
        <div className="post-actions">
          <button onClick={() => handleLikePost(post.boardId)} className={post.likedByMe ? "liked" : ""}>
            ❤️ {post.likeCount ?? 0} 좋아요
          </button>
          <button>💬 댓글</button>
          <button onClick={handleSharePost}>🔗 공유</button>
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="comment-input-area">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          ref={commentInputRef}
        />
        <button onClick={handleAddComment}>등록</button>
      </div>

      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.commentId ?? comment.id}
            comment={comment}
            postId={post.boardId}
            onLikeComment={handleLikeComment}
            onAddReply={handleAddReply}
            onMention={handleMention}
            currentUser={currentUser}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}
