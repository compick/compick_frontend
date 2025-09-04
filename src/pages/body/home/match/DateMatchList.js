// src/pages/body/home/DateMatchList.js
import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';
import { getMatchesByMonth } from '../../../../api/match/Matches';
import GetLeagueLogo from '../../../../utils/GetLeagueLogo';

// 안전 문자열
const safeStr = (v) => (v == null ? "" : String(v));

// ISO or "YYYY.MM.DD" → Date (실패 시 null)
const parseAnyDate = (v) => {
  if (!v) return null;
  const d1 = new Date(v);
  if (!isNaN(d1)) return d1;
  const dotted = safeStr(v).replace(/\./g, "-");
  const d2 = new Date(dotted);
  return isNaN(d2) ? null : d2;
};

// YYYY-MM-DD
const toYMD = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return null;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 매치 1건 정규화: startTime 우선, 없으면 date("YYYY.MM.DD")
const normalizeMatch = (m) => {
  const raw = m?.startTime ?? m?.date ?? null;
  const dt = parseAnyDate(raw);
  const ymd = dt ? toYMD(dt) : null;
  return {
    ...m,
    _dt: dt,            // Date 객체
    _ymd: ymd,          // "YYYY-MM-DD"
    _displayDate: ymd ? ymd.replace(/-/g, ".") : (m?.date ?? ""), // 화면 표기용
  };
};

const normalizeMatches = (arr) => (Array.isArray(arr) ? arr.map(normalizeMatch) : []);

export default function DateMatchList({ likedMatches, onLikeMatch, sport, league }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonth = month === 12 ? 1 : month + 1;

        const s = sport || 'all';
        const l = league || 'all';

        // 현재월 + 다음월 동시 호출 → 향후 2주 커버
        const [currResult, nextResult] = await Promise.all([
          getMatchesByMonth(s, l, year, month),
          getMatchesByMonth(s, l, nextYear, nextMonth),
        ]);

        const curr = currResult.status === 'success' ? currResult.data : [];
        const next = nextResult.status === 'success' ? nextResult.data : [];

        setMatches(normalizeMatches([...(curr || []), ...(next || [])]));
      } catch (err) {
        console.error('Error fetching matches:', err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [sport, league]);

  // 오늘 ~ 14일 후
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);

  // 2주 내 필터
  const filteredMatches = matches.filter((m) => {
    if (!(m._dt instanceof Date) || isNaN(m._dt)) return false;
    return m._dt >= today && m._dt < twoWeeksLater;
  });

  // 날짜별 그룹
  const groupByDate = (arr) =>
    arr.reduce((acc, cur) => {
      const key = cur._displayDate || 'unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(cur);
      return acc;
    }, {});

  // 리그별 그룹
  const groupMatchesByLeague = (arr) =>
    arr.reduce((groups, match) => {
      const leagueKey = match.leagueNickname || match.leagueName || match.league || 'unknown';
      const leagueName = match.leagueName || match.leagueNickname || match.league || '기타';
      if (!groups[leagueKey]) {
        groups[leagueKey] = { leagueName, leagueNickname: leagueKey, matches: [] };
      }
      groups[leagueKey].matches.push(match);
      return groups;
    }, {});

  const groupedByDate = groupByDate(filteredMatches);
  const sortedDates = Object.keys(groupedByDate).sort();

  if (loading) return <p>경기 목록을 불러오는 중...</p>;

  return (
    <div className="dateMatchListContainer">
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => {
          const dateMatches = groupedByDate[date];
          const grouped = groupMatchesByLeague(dateMatches);
          return (
            <div key={date}>
              <h4 className="dateHeader">📅 {date}</h4>
              {Object.values(grouped).map((group, idx) => (
                <div key={idx} className="league-group">
                  <h5>
                    {(() => {
                      const first = group.matches[0];
                      const leagueLogo =
                        first?.leagueLogo ||
                        GetLeagueLogo(first?.leagueNickname || first?.leagueName || first?.league);
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
                  {group.matches.map((match, i) => (
                    <MatchCard key={i} match={match} likedMatches={likedMatches} onLike={onLikeMatch} />
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
