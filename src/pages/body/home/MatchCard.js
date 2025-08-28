import React from 'react';
import { useNavigate } from 'react-router-dom';
import GetLeagueLogo from '../../../utils/GetLeagueLogo';
import GetTeamLogo from '../../../utils/GetTeamLogo';

export default function MatchCard({ match, likedMatches = [], onLike }) {
    const navigate = useNavigate();

    const handleDoubleClick = () => {
        onLike(match);
    };
    
    const handleClick = () => {
        navigate(`/match/${match.id}`);
    };

    const isLiked = likedMatches.some(likedMatch => likedMatch.id === match.id);
    const cardClassName = `matchCard ${isLiked ? 'liked' : ''}`;
    const isMma = match.league && match.league.toLowerCase() === 'ufc';

    // 리그 로고 가져오기 - 백엔드 leagueLogo 우선, 없으면 로컬 이미지 사용
    const leagueLogo = match.leagueLogo || GetLeagueLogo(match.leagueNickname || match.league);
    
    // 팀 로고 가져오기 - 백엔드 팀 로고 우선, 없으면 로컬 이미지 사용
    const homeTeamLogo = match.homeTeamLogo || GetTeamLogo(match.homeTeamName || match.home);
    const awayTeamLogo = match.awayTeamLogo || GetTeamLogo(match.awayTeamName || match.away);

    return (
        <div className={cardClassName} onClick={handleClick} onDoubleClick={handleDoubleClick}>            
            {!isMma && (
                <>
                    <img className="teamBg left" src={homeTeamLogo} alt={match.homeTeamName || match.home} />
                    <img className="teamBg right" src={awayTeamLogo} alt={match.awayTeamName || match.away} />
                </>
            )}
            
            <div className="matchInfo">
                <div className="teamSection">
                   
                    <div className="teamName">{match.homeTeamName || match.home}</div>
                </div>
                
                <div className="scoreBox">
                    <div className="scoreText">{match.homeScore} : {match.awayScore}</div>
                    <div className="matchTime">{match.time}</div>
                    {match.matchStatus && (
                        <div className="matchStatus">{match.matchStatus}</div>
                    )}
                </div>
                
                <div className="teamSection">
                    
                    <div className="teamName">{match.awayTeamName || match.away}</div>
                </div>
            </div>
        </div>
    );
}
