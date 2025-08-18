import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import MatchCard from './MatchCard';
import GetLeagueLogo from '../../../utils/GetLeagueLogo';
import GetTeamLogo from '../../../utils/GetTeamLogo';

// Date 객체를 'YYYY-MM-DD' 문자열로 변환하는 헬퍼 함수
const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export default function CalendarView({ matches, likedMatches, onLikeMatch }) {
    const getInitialDate = () => {
        if (matches && matches.length > 0) {
            // YYYY.MM.DD 형식의 문자열은 직접 정렬해도 안전합니다.
            const sortedMatches = [...matches].sort((a, b) => a.date.localeCompare(b.date));
            return sortedMatches[0].date.replace(/\./g, "-");
        }
        // 경기가 없으면 오늘 날짜 반환
        return formatDate(new Date());
    };

    const [selectedDate, setSelectedDate] = useState(getInitialDate());

    useEffect(() => {
        setSelectedDate(getInitialDate());
    }, [matches]);

    // 날짜 클릭 핸들러
    const handleDateClick = (arg) => {
        setSelectedDate(formatDate(arg.date));
    };

    // 선택된 날짜의 경기 필터링 및 로고 추가
    const filteredMatches = matches
        .filter((match) => {
            if (!match.date) return false;
            const matchDate = match.date.replace(/\./g, "-");
            return matchDate === selectedDate;
        })
        .map(match => {
            if (match.league.toLowerCase() === 'kbo') {
                return {
                    ...match,
                    homeLogo: GetTeamLogo(match.league, match.home),
                    awayLogo: GetTeamLogo(match.league, match.away)
                };
            }
            return match;
        });

    // 캘린더에 표시할 이벤트 데이터 생성 (리그 로고)
    const events = matches.reduce((acc, match) => {
        if (!match.date) return acc;
        const date = match.date.replace(/\./g, "-");
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
                {selectedDate ? (
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
