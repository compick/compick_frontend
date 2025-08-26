import React from 'react';
// import { useParams } from 'react-router-dom';
import MatchCard from './home/MatchCard';
import liverpool from '../../img/soccerTeam/epl/리버풀 FC 로고.svg';
import chelsea from '../../img/soccerTeam/epl/첼시 FC 로고.svg';

// 상세한 임시 데이터
const recentMatchData = {
    '리버풀': [
        { home: '리버풀', away: '첼시', score: '3 : 1', result: 'W' },
        { home: '리버풀', away: '아스날', score: '2 : 0', result: 'W' },
        { home: '맨시티', away: '리버풀', score: '2 : 1', result: 'L' },
        { home: '리버풀', away: '토트넘', score: '1 : 1', result: 'D' },
        { home: '에버튼', away: '리버풀', score: '0 : 2', result: 'W' },
    ],
    '첼시': [
        { home: '리버풀', away: '첼시', score: '3 : 1', result: 'L' },
        { home: '첼시', away: '토트넘', score: '2 : 2', result: 'D' },
        { home: '첼시', away: '에버튼', score: '1 : 0', result: 'W' },
    ],
    // ... 다른 팀 데이터 추가 가능
};

const RecentMatches = ({ teamName }) => {
    const teamMatches = recentMatchData[teamName]?.slice(0, 5) || []; // 최대 5경기
    if (teamMatches.length === 0) return null;

    return (
        <div className="recent-matches">
            <h4>{teamName} 최근경기</h4>
            <div className="recent-results">
                {teamMatches.map((match, i) => <span key={i} className={`result-icon ${match.result}`}></span>)}
            </div>
            <ul className="recent-match-list">
                {teamMatches.map((match, i) => (
                    <li key={i}>
                        <span>{match.home}</span>
                        <span>{match.score}</span>
                        <span>{match.away}</span>
                        <span className={`result-tag ${match.result}`}>{match.result}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HeadToHead = ({ team1, team2, likedMatches, onLikeMatch, onChatOpen }) => {
    // MatchCard에 필요한 모든 속성을 포함하도록 임시 데이터 수정
    const history = [
        { id: 101, home: team1, away: team2, homeScore: 2, awayScore: 1, date: '2024.08.10', time: '21:00', homeLogo: liverpool, awayLogo: chelsea },
        { id: 102, home: team2, away: team1, homeScore: 1, awayScore: 1, date: '2024.02.05', time: '21:00', homeLogo: chelsea, awayLogo: liverpool },
        { id: 103, home: team1, away: team2, homeScore: 3, awayScore: 0, date: '2023.09.20', time: '21:00', homeLogo: liverpool, awayLogo: chelsea },
    ].slice(0, 5);

    return (
        <div className="head-to-head">
            <div className="section-header">
                <h4>{team1} vs {team2} 역대 전적</h4>
                <button onClick={onChatOpen} className="chat-open-btn">토론방 입장</button>
            </div>
            <div className="h2h-match-list">
                {history.map((game) => (
                    <MatchCard key={game.id} match={game} likedMatches={likedMatches} onLike={onLikeMatch} />
                ))}
            </div>
        </div>
    );
};

export default function MatchDetailPage({ matches, likedMatches, onLikeMatch, onOpenChat }) {
    // const { matchId } = useParams();
    // const match = matches.find(m => m.id === parseInt(matchId));

    // 예시용 더미 데이터
    const match = {
        id: 1,
        home: '리버풀',
        away: '첼시',
        homeScore: 3,
        awayScore: 1,
        date: '2024.08.18',
        time: '22:30',
        homeLogo: liverpool,
        awayLogo: chelsea
    };

    if (!match) return <div>경기를 찾을 수 없습니다.</div>;

    return (
        <div className="match-detail-container">
            <h2>경기 상세 정보</h2>
            <MatchCard match={match} likedMatches={likedMatches} onLike={onLikeMatch} />

            <main className="match-detail-main">
                <HeadToHead 
                    team1={match.home} 
                    team2={match.away} 
                    likedMatches={likedMatches} 
                    onLikeMatch={onLikeMatch} 
                    onChatOpen={() => onOpenChat(match)} 
                />

                <div className="team-stats-grid">
                    <RecentMatches teamName={match.home} />
                    <RecentMatches teamName={match.away} />
                </div>
                
                <section className="vote-system">
                    <h3>투표 시스템 (예정)</h3>
                </section>
            </main>

            {/* 채팅방 렌더링 로직 제거 */}
        </div>
    );
}
