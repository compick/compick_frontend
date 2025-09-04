import React, { useState } from 'react';

export default function Comment({ comment, postId, onLikeComment, onAddReply, onMention, currentUser, level }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
        if (replyText.trim() === '') return;
        onAddReply(postId, comment.id, replyText);
        setReplyText('');
        setIsReplying(false);
    };

    const isLiked = comment.likedBy.includes(currentUser.name);

    return (
        <div className="comment-container">
            <div className="comment-main" onDoubleClick={() => onMention(comment.user)}>
                <div className="comment-author">{comment.user}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-actions">
                    <button 
                        onClick={() => onLikeComment(postId, comment.id)}
                        className={isLiked ? 'liked' : ''}
                    >
                        ❤️ {comment.likedBy.length}
                    </button>
                    {/* level이 0일 때만 (최상위 댓글일 때만) 답글 달기 버튼 표시 */}
                    {level === 0 && (
                        <button onClick={() => setIsReplying(!isReplying)}>답글 달기</button>
                    )}
                </div>
            </div>

            {/* isReplying 상태는 level === 0일 때만 true가 될 수 있음 */}
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

            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                    {comment.replies.map(reply => (
                        <Comment 
                            key={reply.id} 
                            comment={reply}
                            postId={postId}
                            onLikeComment={onLikeComment} 
                            onAddReply={onAddReply}
                            onMention={onMention}
                            currentUser={currentUser}
                            level={level + 1} // 다음 레벨로 전달
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

