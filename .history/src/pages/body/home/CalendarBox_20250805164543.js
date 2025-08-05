// FullCalendarBox.js
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function FullCalendarBox({ matches =[]}) {
    console.log("📦 matches", matches);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
  };

  const filteredMatches = matches.filter((match) => {
    if (!match.date) return false;
    const matchDate = match.date.replace(/\./g, "-");
    return matchDate === selectedDate;
    });

  return (
    <div className="calendarLayout">
      <div className="calendarLeft">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          locale="ko"
          height="auto"
        />
      </div>
      <div className="calendarRight">
        <h3>📆 {selectedDate || "날짜를 선택하세요"}</h3>
        {filteredMatches.length > 0 ? (
          <ul className="matchList">
            {filteredMatches.map((match, index) => (
              <li key={index}>
                <span className="matchTitle">{match.title}</span>
                <span className="matchTime"> ({match.time})</span>
                <div className="matchScore">점수: <strong>{match.score}</strong></div>
                <div className="matchInfo">
                  결과: {match.result} / 승점: {match.point}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>경기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
