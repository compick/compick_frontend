import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Comment from "./Comment"; // 댓글 컴포넌트
import { apiJson } from "../../../api/apiClient"; // 상세 데이터 요청용
import { toggleLike,getPostDetail } from "../../../api/Board";
import { toast } from "react-toastify";
import { addComment } from "../../../api/Comment";


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
  const { boardId: urlBoardId } = useParams(); // URL에서 게시글 id 가져오기
  const location = useLocation();
  const navigate = useNavigate();

  // props로 받은 값이 있으면 우선 사용, 없으면 URL/location에서 가져오기
  const boardId = propBoardId || urlBoardId;
  const initialPost = propInitialPost || location.state?.post || null;
  const [post, setPost] = useState(initialPost || null);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null);

  // ✅ 상세 API 호출 (state가 없을 경우 대비)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiJson(`/api/board/detail/${boardId}`, { method: "GET" });
        setPost(res.data || res); // 서버 데이터로 갱신
      } catch (err) {
        console.error("게시글 상세 불러오기 실패:", err);
      }
    };

  
      fetchDetail();
   
  }, [boardId, initialPost]);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  // ✅ 좋아요 여부 판별
  const isPostLiked = post.likedBy?.includes(currentUser?.name);

    //좋아요 기능
  const handleLikePost = async (boardId) => {
    try {
      const res = await toggleLike(boardId);
      console.log("[handleLikePost] res =", res);

      const payload = res?.data ?? res;
      const liked = payload?.liked;
      const likeCount = payload?.likeCount;

      // ✅ 즉시 UI 반영
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likedByMe: liked ?? prev.likedByMe,
          likeCount: typeof likeCount === "number" ? likeCount : prev.likeCount,
        };
      });

      // ✅ 서버 최신 데이터 재조회 (동기화 보장)
      const fresh = await getPostDetail(boardId);  // 단일 게시글 조회 API
      setPost(fresh?.data ?? fresh);

    } catch (error) {
      console.error("[handleLikePost] 좋아요 실패:", error);
    }
};

  // ✅ 댓글 등록
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
  
    try {
      const savedComment = await addComment({
        boardId: post.boardId,
        content: newComment,
      });
  
      // 성공 시 부모 컴포넌트에 전달 (예: 목록 갱신)
      onAddComment(savedComment);
  
      setNewComment(""); // 입력창 초기화
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  // ✅ 댓글 멘션 기능
  const handleMention = (username) => {
    setNewComment((prev) => `${prev}@${username} `.trimStart());
    commentInputRef.current?.focus();
  };

  // ✅ 공유 버튼 핸들러
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
    <div className={`post-detail-container ${isInSidebar ? 'sidebar-mode' : 'fullpage-mode'}`}>
      {!isInSidebar && (
        <button onClick={() => navigate(-1)}>← 뒤로가기</button>
      )}

      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        <span>작성자: {post.userNickname || post.author}</span>
        <span>작성일: {new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
      </div>

      {post.fileData && (
        <img src={post.fileData} alt={post.title} className="post-image" />
      )}

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
      <button
        onClick={()=>handleLikePost(post.boardId)}
        className={post.likedByMe ? "liked" : ""}
      >
        ❤️ {post.likeCount??  0} 좋아요
      </button>
      <button>💬 댓글</button>
      <button onClick={handleSharePost}>🔗 공유</button>
    </div>

      {/* ✅ 댓글 영역 */}
      <div className="comment-section">
        <h3>댓글 ({post.comments?.length || 0})</h3>
        <div className="comment-input-area">
          <input
            ref={commentInputRef}
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>등록</button>
        </div>
        <div className="comment-list">
          {post.comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.boardId}
              onLikeComment={onLikeComment}
              onAddReply={onAddReply}
              onMention={handleMention}
              currentUser={currentUser}
              level={0}
            />
          ))}
        </div>
      </div>

      {/* <div className="post-footer">
        <button onClick={handleReportPost} className="report-btn">
          🚨 게시글 신고하기
        </button>
      </div> */}
    </div>
  );
}
