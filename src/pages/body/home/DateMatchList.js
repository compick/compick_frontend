import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import { getMatchesByMonth } from '../../../api/match/Matches';

export default function DateMatchList({ likedMatches, onLikeMatch, sport, league }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchesForTwoMonths = async () => {
            setLoading(true);
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();

            // 현재 월과 다음 월의 데이터를 병렬로 가져옵니다.
            const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                getMatchesByMonth(sport, league, year, month),
                getMatchesByMonth(sport, league, month === 11 ? year + 1 : year, (month + 1) % 12)
            ]);
            
            setMatches([...currentMonthMatches, ...nextMonthMatches]);
            setLoading(false);
        };

        fetchMatchesForTwoMonths();
    }, [sport, league]);


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

    if (loading) {
        return <p>경기 목록을 불러오는 중...</p>;
    }

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
