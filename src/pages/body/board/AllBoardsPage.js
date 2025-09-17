// AllBoardsPage.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBoardList } from '../../../api/Board';
import PostDetailPage from '../detail/PostDetailPage';

export default function AllBoardsPage({ isLoggedIn, currentUser, onAddComment, onLikeComment, onAddReply, onLikePost, onReport }) {
  const navigate = useNavigate();
  const { sport, league } = useParams(); // ✅ URL에서 sport/league 받음
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("views");
  const [filterBy, setFilterBy] = useState("all");
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // 웹에서 선택된 게시글
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 체크
  const postsPerPage = 10;
  const menuRef = useRef(null);
  
  // 화면 크기 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  console.log("[AllBoardPage] isLoggedIn =", isLoggedIn);
  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getBoardList(sport, league);
        console.log("[AllBoardPage] boardList res =", res.data);
        setPosts(Array.isArray(res) ? res : res.data || []);
      } catch (error) {
        console.error("[AllBoardPage] 게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sport, league]);

  // 정렬 및 필터링
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    if (filterBy === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(post => new Date(post.createdAt) >= oneWeekAgo);
    } else if (filterBy === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(post => new Date(post.createdAt) >= oneMonthAgo);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "views": return (b.views || 0) - (a.views || 0);
        case "date": return new Date(b.createdAt) - new Date(a.createdAt);
        case "likes": return (b.likeCount || 0) - (a.likeCount || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [posts, sortBy, filterBy]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreatePost = () => {
    if (isLoggedIn) {
      navigate("/add");
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // ✅ 게시글 클릭 처리 (반응형)
  const handlePostClick = (post) => {
    if (isMobile) {
      // 모바일: 페이지 이동
      navigate(`/board/detail/${post.boardId}`, { state: { post } });
    } else {
      // 웹: 사이드바에 표시
      setSelectedPost(post);
    }
  };

  return (
    <div className={`allPostsPage ${!isMobile ? 'desktop-layout' : 'mobile-layout'}`}>
      <div className="postsListSection">
        <div className="allPostsHeader">
          <button className="backButton" onClick={handleBackToHome}>← 홈으로</button>
          <h1>모든 게시글</h1>
          <button className="createPostButton" onClick={handleCreatePost}>+ 게시글 작성</button>
        </div>

        <div className="postsControls">
          <div className="controlGroup">
            <label>기간:</label>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">전체</option>
              <option value="week">일주일</option>
              <option value="month">한 달</option>
            </select>
          </div>
          <div className="controlGroup">
            <label>정렬:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="views">조회수</option>
              <option value="date">최신순</option>
              <option value="likes">좋아요</option>
            </select>
          </div>
        </div>

        <div className="postsStats">
          <span>총 {filteredAndSortedPosts.length}개의 게시글</span>
        </div>

        <div className="postsList">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div 
                className={`postItem ${selectedPost?.boardId === post.boardId ? 'selected' : ''}`}
                key={post.boardId} 
                onClick={() => handlePostClick(post)}
              >
                <div className="postImageContainer">
                  {post.fileData ? (
                    <img src={post.fileData} alt="게시글 이미지" className="postImage" />
                  ) : (
                    <div className="postImagePlaceholder">📷</div>
                  )}
                </div>
                <div className="postMainContent">
                  {post.title && <h3 className="postTitle">제목 : {post.title}</h3>}
                  <p className="postContentText">{post.content}</p>
                  <div className="postFooter">
                    <div className="authorInfo">
                      {post.profileImage ? (
                        <img src={post.profileImage} alt="프로필" className="authorProfile" />
                      ) : <div className="authorProfilePlaceholder">👤</div>}
                      <div className="authorDetails">
                        <span className="authorName">{post.userNickname}</span>
                      </div>
                    </div>
                    <div className="postStats">
                        <span className="postDate">{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                      <span className="statItem">👁 {post.views || 0}</span>
                      <span className="statItem">❤️ {post.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="noPostsMessage">게시글이 없습니다.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                className={currentPage === page ? 'active' : ''}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 웹에서만 표시되는 상세 영역 */}
      {!isMobile && (
        <div className="postDetailSection">
          {selectedPost ? (
            <div className="postDetailContainer">
              <PostDetailPage
                key={selectedPost.boardId}
                boardId={selectedPost.boardId}
                initialPost={selectedPost}
                currentUser={currentUser}
                onAddComment={onAddComment}
                onLikeComment={onLikeComment}
                onAddReply={onAddReply}
                onLikePost={onLikePost}
                onReport={onReport}
                isInSidebar={true}
              />
            </div>
          ) : (
            <div className="postDetailPlaceholder">
              <div className="placeholderContent">
                <h3>게시글을 선택해주세요</h3>
                <p>왼쪽 목록에서 게시글을 클릭하면 여기에 상세 내용이 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
