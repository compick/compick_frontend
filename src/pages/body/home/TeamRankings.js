import React from 'react';

// 구단 순위를 보여주는 컴포넌트
export default function TeamRankings() {
    const rankings = [
        { rank: 1, team: '레알 마드리드', points: 95 },
        { rank: 2, team: '바르셀로나', points: 85 },
        { rank: 3, team: '지로나', points: 81 },
        { rank: 4, team: '아틀레티코 마드리드', points: 76 },
    ];

    return (
        <div className="rankingList">
            {rankings.map(item => (
                <div key={item.rank} className="rankingItem">
                    <span>{item.rank}</span>
                    <span>{item.team}</span>
                    <span>{item.points} P</span>
                </div>
            ))}
        </div>
    );
}
