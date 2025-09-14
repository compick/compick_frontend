import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 일주일간 조회수 top 5 게시글을 보여주는 컴포넌트
export default function TopBoard({ posts = [] }) {
    const navigate = useNavigate();
    
    // 일주일 전 날짜 계산
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // 일주일간 게시글 필터링 및 조회수 기준으로 상위 5개 정렬
    const topPosts = posts
        .filter(post => {
            const postDate = new Date(post.createdAt);
            return postDate >= oneWeekAgo;
        })
        .sort((a, b) => {
            const aViews = a.views || a.likedBy?.length || 0;
            const bViews = b.views || b.likedBy?.length || 0;
            return bViews - aViews;
        })
        .slice(0, 5);

    const handleViewAllPosts = () => {
        navigate('/boards/all/all');
    };

    return (
        <div className="topPosts">
            <div className="topPostsHeader">
                <h3>일주일간 인기 게시글</h3>
                <button 
                    className="viewAllButton"
                    onClick={handleViewAllPosts}
                    title="모든 게시글 보기"
                >
                    +
                </button>
            </div>
            <div className="topPostsList">
                {topPosts.length > 0 ? (
                    topPosts.map((post, index) => (
                        <Link to={`/post/${post.id}`} key={post.id} className="topPostItemLink">
                            <div className="topPostItem">
                                <div className="postRank">#{index + 1}</div>
                                <div className="postContent">
                                    <span className="post-title">{post.title}</span>
                                    <div className="post-meta">
                                        <span className="post-author">{post.author}</span>
                                        <span className="post-views">
                                            👁️ {post.views || post.likedBy?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="noPosts">아직 게시글이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
