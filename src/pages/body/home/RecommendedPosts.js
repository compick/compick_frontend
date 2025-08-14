import React from 'react';
import { Link } from 'react-router-dom';

// 추천 게시글을 보여주는 컴포넌트
export default function RecommendedPosts({ posts = [] }) {
    // 자체적인 임시 데이터 제거
    
    return (
        <div className="postList">
            {posts.map(post => (
                <Link to={`/post/${post.id}`} key={post.id} className="postItemLink">
                    <div className="postItem">
                        <span className="post-item-title">{post.title}</span>
                        <div className="post-item-meta">
                            {post.imageUrl && <span className="photo-icon">📸</span>}
                            {post.comments && post.comments.length > 0 && (
                                <span className="comment-count">[{post.comments.length}]</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
