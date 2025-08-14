import React from 'react';
import MatchCard from './MatchCard';

export default function DateMatchList({ matches, likedMatches, onLikeMatch }) {
    // 오늘 날짜와 14일 후 날짜 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 0으로 설정하여 날짜 기준으로 비교
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    // 2주 내의 경기만 필터링
    const filteredMatches = matches.filter(match => {
        if (!match.date) return false;
        const matchDate = new Date(match.date.replace(/\./g, "-"));
        return matchDate >= today && matchDate < twoWeeksLater;
    });

    // 날짜별로 경기 그룹화
    const groupByDate = (matches) => {
        return matches.reduce((acc, cur) => {
            if (!acc[cur.date]) acc[cur.date] = [];
            acc[cur.date].push(cur);
            return acc;
        }, {});
    };

    const groupedByDate = groupByDate(filteredMatches);
    const sortedDates = Object.keys(groupedByDate).sort();

    return (
        <div className="dateMatchListContainer">
            {sortedDates.length > 0 ? (
                sortedDates.map((date) => (
                    <div key={date}>
                        <h4 className="dateHeader">📅 {date}</h4>
                        {groupedByDate[date].map((match, idx) => (
                            <MatchCard key={idx} match={match} likedMatches={likedMatches} onLike={onLikeMatch} />
                        ))}
                    </div>
                ))
            ) : (
                <p>앞으로 2주간 예정된 경기가 없습니다.</p>
            )}
        </div>
    );
}
