import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Comment from './Comment'; // Comment 컴포넌트 import

export default function PostDetailPage({ posts, currentUser, onAddComment, onLikeComment, onAddReply, onLikePost, onReport }) {
    const { postId } = useParams();
    const post = posts.find(p => p.id === parseInt(postId));
    const [newComment, setNewComment] = useState('');
    const commentInputRef = useRef(null); // 입력창 참조

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    const isPostLiked = post.likedBy.includes(currentUser.name);

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') return;
        onAddComment(post.id, newComment);
        setNewComment('');
    };

    const handleMention = (username) => {
        setNewComment(prev => `${prev}@${username} `.trimStart());
        commentInputRef.current?.focus(); // 입력창에 포커스
    };

    const handleReportPost = () => {
        const reason = prompt('신고 사유를 입력해주세요:');
        if (reason) {
            onReport('post', post.id, reason);
        }
    };

    return (
        <div className="post-detail-container">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
                <span>작성자: {post.author}</span>
                <span>작성일: {post.createdAt}</span>
            </div>
            <img src={post.imageUrl} alt={post.title} className="post-image" />

            <div className="post-actions">
                <button onClick={() => onLikePost(post.id)} className={isPostLiked ? 'liked' : ''}>
                    ❤️ {post.likedBy.length} 좋아요
                </button>
                <button>💬 댓글</button>
                <button>🔗 공유</button>
            </div>

            <div className="comment-section">
                <h3>댓글 ({post.comments.length})</h3>
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
                    {post.comments.map(comment => (
                        <Comment 
                            key={comment.id}
                            comment={comment}
                            postId={post.id}
                            onLikeComment={onLikeComment}
                            onAddReply={onAddReply}
                            onMention={handleMention}
                            currentUser={currentUser}
                            level={0} // 최상위 댓글 레벨은 0
                        />
                    ))}
                </div>
            </div>

            <div className="post-footer">
                <button onClick={handleReportPost} className="report-btn">게시글 신고하기</button>
            </div>
        </div>
    );
}
