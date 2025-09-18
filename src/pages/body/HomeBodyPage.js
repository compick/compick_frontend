import React, { useState } from "react";
import CalendarView from "./home/match/CalendarView";
import RecommendedPosts from "./home/RecommendedPosts";
import TeamRankings from "./home/rank/TeamRankings";
import { useNavigate } from "react-router-dom";
import AllBoardsPage from "./board/AllBoardsPage";

export default function HomeBodyPage({ posts, likedMatches, onLikeMatch, sport, league }) {
    const [activeView, setActiveView] = useState("calendar");
    const [activeBoardId, setActiveBoardId] = useState(null);
    const navigate = useNavigate();

    const renderContent = () => {
        switch (activeView) { 
            case 'calendar': 
            return <CalendarView likedMatches={likedMatches} onLikeMatch={onLikeMatch} sport={sport} league={league} />; 
            case 'board': 
            return <AllBoardsPage  posts={posts} onSelectBoard={(boardId) => setActiveBoardId(boardId)}/>
            default:
                return (
                  <CalendarView
                    likedMatches={likedMatches}
                    onLikeMatch={onLikeMatch}
                    sport={sport}
                    league={league}
                  />
                );
        }
    };

    const handleViewAllPosts = () => {
        navigate("/board/all/all");
    };

    const leagueTitle = {
        all: "전체 경기",
        soccer: "축구",
        baseball: "야구",
        mma: "MMA",
        epl: "EPL",
        laliga: "라리가",
        kbo: "KBO",
        ufc: "UFC",
    };

    // 홈 페이지인지 확인
    const isHomePage = !sport || !league || sport === "all" || league === "all";

    return (
        <div className="homeContainer_new">
            <div className="homeContainer_inbox">
                <h2>{isHomePage ? "전체 경기" : leagueTitle[league] || "전체 경기"}</h2>
                <div className="homeToggleBar">
                    <button
                        className={`toggleButton ${activeView === "calendar" ? "active" : ""}`}
                        onClick={() => setActiveView("calendar")}
                    >
                        캘린더
                    </button>
                    <button
                        className={`toggleButton ${activeView === "board" ? "active" : ""}`}
                        onClick={() => setActiveView("board")}
                        title="모든 게시글 보기"
                    >
                        모든 게시글 보기
                    </button>
                </div>
            </div>

            <div className="homeContentArea">{renderContent()}</div>

            {/* <div className="homeBottomSection">
                <div className="topPostsSection">
                    <AllBoardsPage posts={posts} />
                </div> */}
                {/* <div className="recommendedPosts">
                    <h3>추천 게시글</h3>
                    <RecommendedPosts posts={posts} />
                </div> */}
                {/* <div className="teamRankings">
                    <div className="teamRankingsHeader">
                        <h3>구단 순위</h3>
                        <button
                            className="moreButton"
                            onClick={() => {
                                let targetSport = sport || "all";
                                let targetLeague = league || "all";

                                if (["epl", "laliga", "champions"].includes(targetLeague)) {
                                    targetSport = "soccer";
                                } else if (targetLeague === "kbo") {
                                    targetSport = "baseball";
                                } else if (targetLeague === "ufc") {
                                    targetSport = "mma";
                                }

                                window.location.href = `/team-rankings/${targetSport}?league=${targetLeague}`;
                            }}
                            title="더보기"
                        >
                            +
                        </button>
                    </div>
                    <TeamRankings league={league} sport={sport} />
                </div> */}
            {/* </div> */}
        </div>
    );
}
