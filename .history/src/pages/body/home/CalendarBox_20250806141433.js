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
    const groupedEvents = {};

    matches.forEach((match) => {
    if (!match.date) return;
    const date = match.date.replace(/\./g, "-");
    const icon = getLeagueLogo(match.league);

    if (!groupedEvents[date]) {
        groupedEvents[date] = new Set(); // 중복 방지
    }

    if (icon) {
        groupedEvents[date].add(icon);
    }
    });

    const events = Object.entries(groupedEvents).map(([date, iconsSet]) => ({
    date, 
    title: "", // ✅ 텍스트 제거
    display: "auto",
    icons: Array.from(iconsSet),
    }));

  return (
    <div className="calendarLayout">
      <div className="calendarLeft">
        <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  dateClick={handleDateClick}
  events={events}
  eventContent={(arg) => {
    const icons = arg.event.extendedProps.icons;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px", pointerEvents: "none", }}>
        {icons && icons.map((icon, i) => (
            <img
              key={i}
              src={icon}
              alt="리그"
              className="calLogo"
              style={{ pointerEvents: "none" }} // ✅ img 태그에도 확실하게
            />
          ))}
      </div>
    );
  }}
  locale="ko"
  height="auto"
  eventDisplay="background" // ✅ 이벤트를 배경 처리 (겹침 방지)
  eventOverlap={false}
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
