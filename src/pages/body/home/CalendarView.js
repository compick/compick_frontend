import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getMatchesByMonth } from '../../../api/match/Matches';
import MatchCard from './MatchCard';
import GetLeagueLogo from '../../../utils/GetLeagueLogo';
import GetTeamLogo from '../../../utils/GetTeamLogo';

// 안전 문자열
const safeStr = (v) => (v == null ? "" : String(v));

// ISO or "YYYY.MM.DD" → Date (실패 시 null)
const parseAnyDate = (v) => {
  if (!v) return null;
  // ISO 시도
  const d1 = new Date(v);
  if (!isNaN(d1)) return d1;
  // "YYYY.MM.DD" 시도
  const dotted = safeStr(v).replace(/\./g, "-");
  const d2 = new Date(dotted);
  return isNaN(d2) ? null : d2;
};

// Date → "YYYY-MM-DD"
const toYMD = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return null;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Match 1건 정규화
const normalizeMatch = (m) => {
  // 우선순위: startTime → date("YYYY.MM.DD") → null
  const raw = m?.startTime ?? m?.date ?? null;
  const dt = parseAnyDate(raw);
  const ymd = dt ? toYMD(dt) : null;

  return {
    ...m,
    startTime: m?.startTime ?? null,
    date: m?.date ?? null, // 원본 유지하되 사용은 ymd 기준
    _dt: dt,               // 내부 비교용 Date
    _ymd: ymd,             // 비교/표시용 YYYY-MM-DD
  };
};

// 배열 정규화
const normalizeMatches = (arr) =>
  Array.isArray(arr) ? arr.map(normalizeMatch) : [];

// Date 객체를 'YYYY-MM-DD' 문자열로 변환하는 헬퍼 함수
const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function CalendarView({ likedMatches, onLikeMatch, sport, league }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const lastFetchKeyRef = React.useRef("");
  
    const fetchByYearMonth = useCallback(async (viewDate, s, l) => {
      if (!s || !l) return; // 둘 다 있어야 호출
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth() + 1;
  
      const key = `${s}|${l}|${year}|${month}`;
      if (lastFetchKeyRef.current === key) return; // 같은 요청이면 생략
      lastFetchKeyRef.current = key;
  
      try {
        setLoading(true);
        setError(null);
        const data = await getMatchesByMonth(s, l, year, month);
        setMatches(normalizeMatches(data));
      } catch (err) {
        console.error('Error fetching matches:', err);
        setMatches([]);
        if (err.code === 'ERR_NETWORK') setError('네트워크 연결을 확인해주세요. 백엔드 서버가 실행 중인지 확인하세요.');
        else if (err.response?.status === 404) setError('요청한 경기 정보를 찾을 수 없습니다.');
        else if (err.response?.status >= 500) setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        else setError('경기 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }, []);
  
    // sport/league 바뀌면 현재 캘린더의 날짜로 다시 호출해야 하므로,
    // 캘린더가 최초 mount된 다음 datesSet이 once 호출되도록 한 번 더 유도.
    const calendarDateRef = React.useRef(new Date());
    useEffect(() => {
      // sport/league 변경 시에도 현재 view로 refetch
      fetchByYearMonth(calendarDateRef.current, sport || 'all', league || 'all');
    }, [sport, league, fetchByYearMonth]);
  
    // 날짜 선택 유도 로직(그대로 유지)
    useEffect(() => {
      if (matches?.length) {
        const today = formatDate(new Date());
        const todayMatches = matches.filter((m) => m._ymd === today);
        if (todayMatches.length > 0) {
          setSelectedDate(today);
        } else {
          const dated = matches.filter((m) => m._dt instanceof Date && !isNaN(m._dt));
          if (dated.length > 0) {
            dated.sort((a, b) => a._dt - b._dt);
            setSelectedDate(dated[0]._ymd);
          }
        }
      }
    }, [matches]);

    // 날짜 클릭 핸들러
    const handleDateClick = (arg) => {
        setSelectedDate(formatDate(arg.date));
    };

    // 선택된 날짜의 경기 필터링
    const filteredMatches = matches.filter((m) => m._ymd === selectedDate);

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

    const groupedMatches = groupMatchesByLeague(filteredMatches);

    // 캘린더에 표시할 이벤트 데이터 생성 (리그 로고)
    const events = matches.reduce((acc, match) => {
        const date = match._ymd;
        if (!date) return acc; // _ymd가 없으면 건너뛰기
        
        // 백엔드에서 제공하는 leagueLogo URL을 우선 사용하고, 없으면 로컬 로고 사용
        const icon = match.leagueLogo || GetLeagueLogo(match.leagueNickname || match.leagueName || match.league);
        
        if (!acc[date]) {
            acc[date] = { 
                date, 
                icons: new Set(), // Set으로 변경하여 중복 제거 (각 리그당 하나씩만)
                leagueNames: new Set(),
                matchCount: 0 // 해당 날짜의 경기 수 카운트
            };
        }
        
        acc[date].matchCount++;
        
        // 아이콘이 있으면 Set에 추가 (중복 자동 제거)
        if (icon) {
            acc[date].icons.add(icon);
        }
        
        // 리그 이름도 저장 (툴팁용)
        const leagueName = match.leagueNickname || match.leagueName || match.league;
        if (leagueName) {
            acc[date].leagueNames.add(leagueName);
        }
        return acc;
    }, {});

    const calendarEvents = Object.values(events).map(event => {
        // Set을 배열로 변환하여 각 리그당 하나씩만 아이콘 표시
        const displayIcons = Array.from(event.icons);
        
        return {
            date: event.date,
            title: '',
            display: 'block', // 'background'에서 'block'으로 변경
            extendedProps: { 
                icons: displayIcons,
                leagueNames: Array.from(event.leagueNames),
                matchCount: event.matchCount
            }
        };
    });



    return (
        <div className="calendarViewContainer">
            <div className="calendarSection">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={(arg) => setSelectedDate(formatDate(arg.date))}
                    datesSet={(arg) => {
                      // FullCalendar가 알려주는 현재 뷰 시작일(해당 월의 시작 주의 월요일)
                      const viewStart = arg.view.currentStart;
                      calendarDateRef.current = viewStart; // sport/league 변화 시 재사용
                      fetchByYearMonth(viewStart, sport || 'all', league || 'all');
                    }}
                    events={calendarEvents}
                    eventContent={(arg) => {
                        const icons = arg.event.extendedProps.icons;
                        const leagueNames = arg.event.extendedProps.leagueNames;
                        const matchCount = arg.event.extendedProps.matchCount;
                        return (
                            <div className="calendar-event-icons" title={`${leagueNames?.join(', ')} (${matchCount}경기)`}>
                                {icons && icons.length > 0 ? (
                                    icons.map((icon, i) => (
                                        <img 
                                            key={i} 
                                            src={icon} 
                                            alt={leagueNames?.[i] || "리그"} 
                                            className="calLogo" 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))
                                ) : (
                                    <span style={{ fontSize: '10px', color: '#666' }}>경기 있음</span>
                                )}
                            </div>
                        );
                    }}
                    dayCellClassNames={(arg) => {
                        const classes = [];
                        if (formatDate(arg.date) === selectedDate) {
                            classes.push('selected-day');
                        }
                        // FullCalendar가 locale='ko' 설정으로 인해 공휴일에 적용하는 기본 스타일을 무시하기 위함
                        if (arg.isHoliday) {
                            classes.push('no-holiday-style');
                        }
                        return classes;
                    }}
                    locale="ko"
                    height="auto"
                />
            </div>
            <div className="listSection">
                <h3>{selectedDate || "날짜를 선택하세요"}</h3>
                {loading ? (
                    <p>경기 목록을 불러오는 중...</p>
                ) : error ? (
                    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                        <p>{error}</p>
                        <p style={{ fontSize: '14px', marginTop: '10px' }}>
                            백엔드 서버 설정이 완료되면 다시 시도해주세요.
                        </p>
                    </div>
                ) : selectedDate ? (
                    Object.keys(groupedMatches).length > 0 ? (
                        Object.entries(groupedMatches).map(([leagueKey, group]) => (
                            <div key={leagueKey} className="league-group">
                                <h4>
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
                                </h4>
                                {group.matches.map((match, index) => (
                                    <MatchCard key={index} match={match} likedMatches={likedMatches} onLike={onLikeMatch} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>해당 날짜에 경기가 없습니다.</p>
                    )
                ) : (
                    <p>캘린더에서 날짜를 선택하여 경기 목록을 확인하세요.</p>
                )}
            </div>
        </div>
    );
}


