// FullCalendarBox.js
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {MatchCard, getLeagueLogo} from "../HomeBodyPage"; 

export default function FullCalendarBox({ matches =[]}) {
    console.log("📦 matches", matches);
    const [selectedDate, setSelectedDate] = useState(null);
    
    //날짜 조회 
    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
    };
    // 날짜데이터 포맷
    const filteredMatches = matches.filter((match) => {
        if (!match.date) return false;
        const matchDate = match.date.replace(/\./g, "-");
        return matchDate === selectedDate;
    });

    // 캘린더 로고 추가
    const events = matches
    .filter(match => match.date)
    .map(match => ({
        date: match.date.replace(/\./g, "-"),
        icon: getLeagueLogo(match.league),
    }));

  return (
    <div className="calendarLayout">
      <div className="calendarLeft">
        <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  dateClick={handleDateClick}
  events={events} // ✅ 여기 추가
  eventContent={(arg) => {
    const icon = arg.event.extendedProps.icon;
    return icon ? (
      <img src={icon} alt="리그 아이콘" style={{ width: 18, height: 18 }} />
    ) : (
      <span>⚽</span>
    );
  }} // ✅ 여기 추가
  locale="ko"
  height="auto"
/>
      </div>
      <div className="calendarRight">
        <h3>📆 {selectedDate || "날짜를 선택하세요"}</h3>
        {filteredMatches.length > 0 ? (
          <div className="matchList">
            {filteredMatches.map((match, index) => (
                <MatchCard key={index} match={match} />
            ))}
            </div>
        ) : (
          <p>경기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
