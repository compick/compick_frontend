import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getMatchesByRange } from '../../../api/match/Matches';
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
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date()); // 현재 캘린더의 월을 관리

    useEffect(() => {
        const fetchMatches = async () => {
            // sport와 league가 없으면 API 호출하지 않음
            if (!sport || !league) {
                console.log('Sport or league not provided:', { sport, league });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0);
                console.log('Fetching matches for:', { sport, league, startDate, endDate });
                const data = await getMatchesByRange(sport, league, startDate.toISOString(), endDate.toISOString());
                setMatches(normalizeMatches(data));
            } catch (error) {
                console.error('Error fetching matches:', error);
                setError('백엔드 서버에 연결할 수 없습니다. 관리자에게 문의해주세요.');
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [currentDate, sport, league]);

    const getInitialDate = () => {
        if (matches && matches.length > 0) {
            // YYYY.MM.DD 형식의 문자열은 직접 정렬해도 안전합니다.
            const dated = matches.filter((m) => m._dt instanceof Date && !isNaN(m._dt));
            if (dated.length > 0) {
                dated.sort((a, b) => a._dt - b._dt);
                return dated[0]._ymd ?? formatDate(new Date());
            }
        }
        // 경기가 없으면 오늘 날짜 반환
        return formatDate(new Date());
    };

    const [selectedDate, setSelectedDate] = useState(() => getInitialDate());

    useEffect(() => {
        setSelectedDate(getInitialDate());
    }, [matches]);

    // 날짜 클릭 핸들러
    const handleDateClick = (arg) => {
        setSelectedDate(formatDate(arg.date));
    };

    // 선택된 날짜의 경기 필터링
    const filteredMatches = matches.filter((m) => m._ymd === selectedDate);

    // 캘린더에 표시할 이벤트 데이터 생성 (리그 로고)
    const events = matches.reduce((acc, match) => {
        const date = match._ymd;
        if (!match.date) return acc;
        const icon = GetLeagueLogo(match.league);
        
        if (!acc[date]) {
            acc[date] = { date, icons: new Set() };
        }
        if (icon) {
            acc[date].icons.add(icon);
        }
        return acc;
    }, {});

    const calendarEvents = Object.values(events).map(event => ({
        date: event.date,
        title: '',
        display: 'block', // 'background'에서 'block'으로 변경
        extendedProps: { icons: Array.from(event.icons) }
    }));

    return (
        <div className="calendarViewContainer">
            <div className="calendarSection">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    datesSet={(arg) => {
                        // 뷰가 변경되면 (예: 월 이동) currentDate를 업데이트하여 API 재호출
                        setCurrentDate(arg.view.currentStart);
                    }}
                    events={calendarEvents}
                    eventContent={(arg) => {
                        const icons = arg.event.extendedProps.icons;
                        return (
                            <div className="calendar-event-icons">
                                {icons && icons.map((icon, i) => (
                                    <img key={i} src={icon} alt="리그" className="calLogo" />
                                ))}
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
                    filteredMatches.length > 0 ? (
                        filteredMatches.map((match, index) => (
                            <MatchCard key={index} match={match} likedMatches={likedMatches} onLike={onLikeMatch} />
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
