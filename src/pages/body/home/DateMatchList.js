import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import { getAllMatchesMonthly } from '../../../api/match/Matches';
import { getAllSoccerMatchesMonthly, getEplMatchesMonthly, getLaligaMatchesMonthly } from '../../../api/match/soccer';
import { getAllBaseballMatchesMonthly, getKboMatchesMonthly } from '../../../api/match/baseball';
import { getAllMmaMatchesMonthly, getUfcMatchesMonthly } from '../../../api/match/mma';
import GetLeagueLogo from '../../../utils/GetLeagueLogo';

export default function DateMatchList({ likedMatches, onLikeMatch, sport, league }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            
            try {
                console.log('📅 DateMatchList API 호출:', { sport, league });
                let data;
                
                // 홈 페이지 (전체 경기)인 경우
                if (sport === 'all' && league === 'all') {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;
                    data = await getAllMatchesMonthly(year, month);
                }
                // 축구 관련 API 호출
                else if (sport === 'soccer') {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;
                    
                    if (league === 'all') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getAllSoccerMatchesMonthly(year, month),
                            getAllSoccerMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    } else if (league === 'epl') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getEplMatchesMonthly(year, month),
                            getEplMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    } else if (league === 'laliga') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getLaligaMatchesMonthly(year, month),
                            getLaligaMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    }
                }
                // 야구 관련 API 호출
                else if (sport === 'baseball') {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;
                    
                    if (league === 'all') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getAllBaseballMatchesMonthly(year, month),
                            getAllBaseballMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    } else if (league === 'kbo') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getKboMatchesMonthly(year, month),
                            getKboMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    }
                }
                // MMA 관련 API 호출
                else if (sport === 'mma') {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;
                    
                    if (league === 'all') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getAllMmaMatchesMonthly(year, month),
                            getAllMmaMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    } else if (league === 'ufc') {
                        const [currentMonthMatches, nextMonthMatches] = await Promise.all([
                            getUfcMatchesMonthly(year, month),
                            getUfcMatchesMonthly(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1)
                        ]);
                        data = [...currentMonthMatches, ...nextMonthMatches];
                    }
                }
                
                setMatches(data);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
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

    // 리그별로 경기 그룹화
    const groupMatchesByLeague = (matches) => {
        return matches.reduce((groups, match) => {
            // leagueNickname을 우선 사용하고, 없으면 leagueName 사용
            const leagueKey = match.leagueNickname || match.leagueName || match.league || 'unknown';
            const leagueName = match.leagueName || match.leagueNickname || match.league || '기타';
            
            if (!groups[leagueKey]) {
                groups[leagueKey] = {
                    leagueName: leagueName,
                    leagueNickname: leagueKey,
                    matches: []
                };
            }
            groups[leagueKey].matches.push(match);
            return groups;
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
                sortedDates.map((date) => {
                    const dateMatches = groupedByDate[date];
                    const groupedMatches = groupMatchesByLeague(dateMatches);
                    
                    return (
                        <div key={date}>
                            <h4 className="dateHeader">📅 {date}</h4>
                            {Object.values(groupedMatches).map((group, groupIndex) => (
                                <div key={groupIndex} className="league-group">
                                    <h5>
                                        {(() => {
                                            // 첫 번째 매치에서 리그 로고 가져오기
                                            const firstMatch = group.matches[0];
                                            const leagueLogo = firstMatch?.leagueLogo || GetLeagueLogo(firstMatch?.leagueNickname || firstMatch?.leagueName || firstMatch?.league);
                                            return leagueLogo ? (
                                                <>
                                                    <img src={leagueLogo} alt={group.leagueNickname} className="league-group-logo" />
                                                    {group.leagueNickname}
                                                </>
                                            ) : (
                                                group.leagueNickname
                                            );
                                        })()}
                                    </h5>
                                    {group.matches.map((match, idx) => (
                                        <MatchCard key={idx} match={match} likedMatches={likedMatches} onLike={onLikeMatch} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })
            ) : (
                <p>앞으로 2주간 예정된 경기가 없습니다.</p>
            )}
        </div>
    );
}
