import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import MatchCard from './MatchCard';
import GetLeagueLogo from '../../../utils/GetLeagueLogo';

export default function CalendarView({ matches, likedMatches, onLikeMatch }) {
    // 오늘 날짜를 yyyy-mm-dd 형식의 문자열로 변환하는 함수
    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    };

    const [selectedDate, setSelectedDate] = useState(getTodayString());

    // 날짜 클릭 핸들러
    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
    };

    // 선택된 날짜의 경기 필터링
    const filteredMatches = matches.filter((match) => {
        if (!match.date) return false;
        const matchDate = match.date.replace(/\./g, "-");
        return matchDate === selectedDate;
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
