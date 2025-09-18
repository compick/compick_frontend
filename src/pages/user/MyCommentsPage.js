export default function MyCommentsPage({ comments = [] }) {
    return (
      <div className="my-comments-page">
        <h2>작성한 댓글</h2>
  
        {comments.length === 0 ? (
          <p>아직 작성한 댓글이 없습니다.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.commentId} className="comment-item">
                <div className="comment-meta">
                  <strong>{comment.userNickname}</strong> ·{" "}
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-board">
                  게시글:{" "}
                  <a href={`/board/detail/${comment.boardId}`} className="comment-board-link">
                    {comment.boardTitle}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  