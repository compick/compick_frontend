import React from 'react';
import MatchCard from './MatchCard'; // MatchCard 재사용

export default function HeartPage({ likedMatches, onLikeMatch }) {
    return (
        <div className="homeContainer_new">
            <h2>❤️ 관심 경기로 등록한 경기</h2>
            {likedMatches.length > 0 ? (
                <div className="matchList">
                    {likedMatches.map(match => (
                        <MatchCard key={match.id} match={match} onLike={onLikeMatch} />
                    ))}
                </div>
            ) : (
                <p>관심 경기로 등록한 경기가 없습니다.</p>
            )}
        </div>
    );
}
