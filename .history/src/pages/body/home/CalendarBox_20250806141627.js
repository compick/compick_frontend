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
          locale="ko"
          height="auto"
          dayCellContent={(arg) => {
            const date = arg.date.toISOString().split("T")[0];
            const icons = groupedEvents[date] ? Array.from(groupedEvents[date]) : [];

            return (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                <div style={{ display: "flex", gap: "3px", pointerEvents: "none" }}>
                  {icons.map((icon, i) => (
                    <img
                      key={i}
                      src={icon}
                      alt="리그"
                      className="calLogo"
                      style={{ pointerEvents: "none" }}
                    />
                  ))}
                </div>
                <div style={{ position: "absolute", top: 2, left: 4, fontSize: "12px" }}>{arg.dayNumberText}</div>
              </div>
            );
          }}
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
