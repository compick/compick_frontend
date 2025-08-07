import React, { useState } from "react";
import CalendarBox from './home/CalendarBox';
import GetLeagueLogo from "../../utils/GetLeagueLogo.js";

// 이미지 import 생략 (기존 그대로 유지)

// 컴포넌트 시작
export default function HomeBodyPage() {
  const [selectedTab, setSelectedTab] = useState("전체");
  const [activeWidget, setActiveWidget] = useState(null); // 'calendar' | 'schedule' | null

  const matches = [/* 그대로 생략 */];
  const headerMenu = ["전체", "리그별", "즐겨찾기"];

  const groupByDate = (matches) => {
    return matches.reduce((acc, cur) => {
      if (!acc[cur.date]) acc[cur.date] = [];
      acc[cur.date].push(cur);
      return acc;
    }, {});
  };

  let filteredMatches = matches;
  if (selectedTab === "즐겨찾기") {
    filteredMatches = matches.filter(
      (m) => m.home === "리버플" || m.away === "리버플"
    );
  }

  const groupedByDate = groupByDate(filteredMatches);
  const sortedDates = Object.keys(groupedByDate).sort();

  const toggleWidget = (widgetName) => {
    setActiveWidget((prev) => (prev === widgetName ? null : widgetName));
  };

  return (
    <div className="HomeContainer">
      <h1 className="pageTitle">해외축구 커뮤니티</h1>

      <div className="widgetBtns">
        <button
          className={`widgetBtn ${activeWidget === "calendar" ? "active" : ""}`}
          onClick={() => toggleWidget("calendar")}
        >
          📅 캘린더
        </button>
        <button
          className={`widgetBtn ${activeWidget === "schedule" ? "active" : ""}`}
          onClick={() => toggleWidget("schedule")}
        >
          🕒 경기일정
        </button>
      </div>

      {activeWidget === "calendar" && (
        <div className="widgetBox">
          <button className="closeBtn" onClick={() => setActiveWidget(null)}>X</button>
          <div className="calendarBox">
            <CalendarBox matches={matches} />
          </div>
        </div>
      )}

      {activeWidget === "schedule" && (
        <div className="widgetBox">
          <button className="closeBtn" onClick={() => setActiveWidget(null)}>X</button>
          <div className="scheduleTab">
            {headerMenu.map((menu, index) => (
              <div
                className={`menuTab ${selectedTab === menu ? "active" : ""}`}
                key={index}
                onClick={() => setSelectedTab(menu)}
              >
                {menu}
              </div>
            ))}
          </div>

          <div className="matchList">
            {sortedDates.map((date) => (
              <div key={date}>
                <span className="dateHeader">📅 {date}</span>
                {groupedByDate[date].map((match, idx) => (
                  <MatchCard key={idx} match={match} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="sectionTitle">커뮤니티</h2>
      <div className="feedContainer">
        <div className="feedCard">[X] 오늘 EPL 경기 흥미진진🔥</div>
        <div className="feedCard">[X] 라리가 전술 분석 by 팬</div>
        <div className="feedCard">[X] 토트넘은 이번 시즌 우승?</div>
      </div>
    </div>
  );
}
