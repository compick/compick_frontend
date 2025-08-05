import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // 기본 스타일

export default function CalendarBox() {
  const [value, setValue] = useState(new Date());

  return (
    <div className="calendarContainer">
      <Calendar
        onChange={setValue}
        value={value}
        locale="ko-KR"
      />
      <p className="selectedDate">📅 선택한 날짜: {value.toLocaleDateString()}</p>
    </div>
  );
}