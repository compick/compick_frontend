import React, { useState } from "react";
import CalendarView from "./home/CalendarView";
import DateMatchList from "./home/DateMatchList";
import FavoriteTeamMatchList from "./home/FavoriteTeamMatchList";
import RecommendedPosts from "./home/RecommendedPosts";
import TeamRankings from "./home/TeamRankings";
import { getCookie } from "../../utils/Cookie";
// 이미지 import 및 useEffect 로직 제거

export default function HomeBodyPage({ posts, likedMatches, onLikeMatch, onOpenChat, league, sport }) {
    const [activeView, setActiveView] = useState('calendar');
    // matches 상태 및 useEffect 제거

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

    return (
        <div className="homeContainer_new">
            <h2>{leagueTitle[league] || '전체 경기'}</h2>
            <div className="homeToggleBar">
                <button 
                    className={`toggleButton ${activeView === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveView('calendar')}
                >
                    캘린더+리스트
                </button>
                <button 
                    className={`toggleButton ${activeView === 'date' ? 'active' : ''}`}
                    onClick={() => setActiveView('date')}
                >
                    날짜별 리스트
                </button>
                <button 
                    className={`toggleButton ${activeView === 'favorite' ? 'active' : ''}`}
                    onClick={() => setActiveView('favorite')}
                >
                    관심 구단
                </button>
            </div>

            <div className="homeContentArea">
                {renderContent()}
            </div>

            <div className="homeBottomSection">
                <div className="recommendedPosts">
                    <h3>추천 게시글</h3>
                    <RecommendedPosts posts={posts} />
                </div>
                <div className="teamRankings">
                    <h3>구단 순위</h3>
                    <TeamRankings league={league} />
                </div>
            </div>
        </div>
    );
}
