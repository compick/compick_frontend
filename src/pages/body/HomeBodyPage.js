import React, { useState } from "react";
import CalendarView from "./home/match/CalendarView";
import DateMatchList from "./home/match/DateMatchList";
import FavoriteTeamMatchList from "./home/match/FavoriteTeamMatchList";
import RecommendedPosts from "./home/RecommendedPosts";
import TopBoard from "./board/TopBoard";
import TeamRankings from "./home/rank/TeamRankings";
import { getCookie } from "../../utils/Cookie";
// 이미지 import 및 useEffect 로직 제거

export default function HomeBodyPage({ posts, likedMatches, onLikeMatch, onOpenChat, league, sport, isLoggedIn }) {
    const [activeView, setActiveView] = useState('calendar');

    console.log('HomeBodyPage props:', { sport, league, activeView });

    const renderContent = () => {
        switch (activeView) {
            case 'calendar':
                return <CalendarView likedMatches={likedMatches} onLikeMatch={onLikeMatch} sport={sport} league={league} />;
            case 'date':
                return <DateMatchList likedMatches={likedMatches} onLikeMatch={onLikeMatch} sport={sport} league={league} />;
            case 'favorite':
                return <FavoriteTeamMatchList likedMatches={likedMatches} onLikeMatch={onLikeMatch} />;
            default:
                return <CalendarView likedMatches={likedMatches} onLikeMatch={onLikeMatch} sport={sport} league={league} />;
        }
    };

    const leagueTitle = {
        all: '전체 경기',
        soccer: '축구',
        baseball: '야구',
        mma: 'MMA',
        epl: 'EPL',
        laliga: '라리가',
        kbo: 'KBO',
        ufc: 'UFC'
    }

    // 홈 페이지인지 확인 (sport나 league가 'all'이거나 없을 때)
    const isHomePage = !sport || !league || sport === 'all' || league === 'all';

    return (
        <div className="homeContainer_new">
            <div className="homeContainer_inbox">
                <h2>{isHomePage ? '전체 경기' : (leagueTitle[league] || '전체 경기')}</h2>
                <div className="homeToggleBar">
                    <button 
                        className={`toggleButton ${activeView === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveView('calendar')}
                    >
                        캘린더
                    </button>
                    <button 
                        className={`toggleButton ${activeView === 'date' ? 'active' : ''}`}
                        onClick={() => setActiveView('date')}
                    >
                        날짜별
                    </button>
                    <button 
                        className={`toggleButton ${activeView === 'favorite' ? 'active' : ''}`}
                        onClick={() => setActiveView('favorite')}
                    >
                        관심구단
                    </button>
                </div>
            </div>

            <div className="homeContentArea">
                {renderContent()}
            </div>

            <div className="homeBottomSection">
                <div className="topPostsSection">
                    <TopBoard posts={posts}  />
                </div>
                <div className="recommendedPosts">
                    <h3>추천 게시글</h3>
                    <RecommendedPosts posts={posts} />
                </div>
                <div className="teamRankings">
                    <div className="teamRankingsHeader">
                        <h3>구단 순위</h3>
                        <button 
                            className="moreButton"
                            onClick={() => {
                                // 현재 선택된 리그에 따라 적절한 스포츠와 리그 정보 전달
                                let targetSport = sport || 'all';
                                let targetLeague = league || 'all';
                                
                                // 리그별 스포츠 매핑
                                if (targetLeague === 'epl' || targetLeague === 'laliga' || targetLeague === 'champions') {
                                    targetSport = 'soccer';
                                } else if (targetLeague === 'kbo') {
                                    targetSport = 'baseball';
                                } else if (targetLeague === 'ufc') {
                                    targetSport = 'mma';
                                }
                                
                                window.location.href = `/team-rankings/${targetSport}?league=${targetLeague}`;
                            }}
                            title="더보기"
                        >
                            +
                        </button>
                    </div>
                    <TeamRankings league={league} sport={sport} />
                </div>
            </div>
        </div>
    );
}
