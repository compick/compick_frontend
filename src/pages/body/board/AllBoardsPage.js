import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBoardList } from '../../../api/Board';

export default function AllBoardsPage({ isLoggedIn }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('views'); // views, date, likes
    const [filterBy, setFilterBy] = useState('all'); // all, week, month
    const [openCategory, setOpenCategory] = useState(null); // 드롭다운 상태 관리
    const postsPerPage = 10;
    const menuRef = useRef(null);

    // 카테고리 구조 정의 (SportHeader.js와 동일한 형식)
    const categories = {
        '전체': {
            basePath: '/boards/all',
            leagues: [
                { name: '전체보기', path: '/boards/all/all' }
            ]
        },
        '축구': {
            basePath: '/boards/soccer',
            leagues: [
                { name: '전체보기', path: '/boards/soccer/all' },
                { name: 'EPL', path: '/boards/soccer/epl' },
                { name: '라리가', path: '/boards/soccer/laliga' }
            ]
        },
        '야구': {
            basePath: '/boards/baseball',
            leagues: [
                { name: '전체보기', path: '/boards/baseball/all' },
                { name: 'KBO', path: '/boards/baseball/kbo' }
            ]
        },
        'MMA': {
            basePath: '/boards/mma',
            leagues: [
                { name: '전체보기', path: '/boards/mma/all' },
                { name: 'UFC', path: '/boards/mma/ufc' }
            ]
        }
    };

    // ✅ 컴포넌트가 마운트될 때 게시글 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getBoardList(); // 필요하면 props나 state로 sport/league 바꿀 수 있음
                console.log("[AllBoardsPage] boardList res =", res);
                setPosts(res.data || []);
            } catch (error) {
                console.error("[AllBoardsPage] 게시글 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // 메뉴 바깥 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenCategory(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 정렬 및 필터링 로직
    const filteredAndSortedPosts = useMemo(() => {
        let filtered = [...posts];

        // 날짜 필터링
        if (filterBy === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filtered = filtered.filter(post => {
                const postDate = new Date(post.createdAt);
                return postDate >= oneWeekAgo;
            });
        } else if (filterBy === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filtered = filtered.filter(post => {
                const postDate = new Date(post.createdAt);
                return postDate >= oneMonthAgo;
            });
        }

        // 정렬
        filtered.sort((a, b) => {
             switch (sortBy) {
                case 'views':
                    return (b.views || 0) - (a.views || 0);
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'likes':
                    return (b.likedBy?.length || 0) - (a.likedBy?.length || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [posts, sortBy, filterBy]);
    // 페이징 계산
    const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreatePost = () => {
        if (isLoggedIn) {
            navigate('/add');
        } else {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // 카테고리 클릭 핸들러
    const handleCategoryClick = (categoryName) => {
        setOpenCategory(prevOpenCategory => prevOpenCategory === categoryName ? null : categoryName);
    };

    // 리그 선택 핸들러
    const handleLeagueSelect = () => {
        setOpenCategory(null); // 리그 선택 후 메뉴 닫기
    };

    return (
        <div className="allPostsPage">
            <div className="allPostsHeader">
                <button className="backButton" onClick={handleBackToHome}>
                    ← 홈으로
                </button>
                <h1>모든 게시글</h1>
                <button className="createPostButton" onClick={handleCreatePost}>
                    + 게시글 작성
                </button>
            </div>

            {/* 카테고리 네비게이션 */}
            <div className="categoryNavigation" ref={menuRef}>
                {Object.entries(categories).map(([categoryName, categoryData]) => (
                    <div key={categoryName} className="categoryGroup">
                        <button 
                            className="categoryButton"
                            onClick={() => handleCategoryClick(categoryName)}
                        >
                            {categoryName}
                        </button>
                        {openCategory === categoryName && (
                            <div className="leagueDropdown">
                                {categoryData.leagues.map((league) => (
                                    <Link 
                                        key={league.path} 
                                        to={league.path}
                                        className="leagueLink"
                                        onClick={handleLeagueSelect}
                                    >
                                        {league.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="postsControls">
                <label>기간:</label>
                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="week">일주일</option>
                    <option value="month">한 달</option>
                </select>

                <label>정렬:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="views">조회수</option>
                    <option value="date">최신순</option>
                    <option value="likes">좋아요</option>
                </select>
            </div>

            <div className="postsStats">
                <span>총 {filteredAndSortedPosts.length}개의 게시글</span>
            </div>

            <div className="postsList">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
                        <Link to={`/post/${post.id}`} key={post.id}>
                            <div className="postItem">
                                {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
                                <h3>{post.title}</h3>
                                <p>{post.author} · {post.createdAt}</p>
                                <div>
                                    👁️ {post.views || 0} · ❤️ {post.likedBy?.length || 0} · 💬 {post.comments?.length || 0}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>게시글이 없습니다.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => handlePageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}