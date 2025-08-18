import React from 'react';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div className={cardClassName} onClick={handleClick} onDoubleClick={handleDoubleClick}>
            <div className="like-icon">
                {isLiked ? '❤️' : '♡'}
            </div>
            <img className="teamBg left" src={match.homeLogo} alt={match.home} />
            <img className="teamBg right" src={match.awayLogo} alt={match.away} />
            <div className="matchInfo">
                <div className="teamName">{match.home}</div>
                <div className="scoreBox">
                    <div className="scoreText">{match.homeScore} : {match.awayScore}</div>
                    <div className="matchTime">{match.time}</div>
                </div>
                <div className="teamName">{match.away}</div>
            </div>
        </div>
    );
}
