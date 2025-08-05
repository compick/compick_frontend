import React, { useState } from "react";
import CalendarBox from './home/CalendarBox';

import arsenal from "../../img/soccerTeam/epl/아스날 FC 로고.svg";
import astonVilla from "../../img/soccerTeam/epl/아스톤 빌라 FC 로고.svg";
import brentford from "../../img/soccerTeam/epl/브렌트포드 FC 로고.svg";
import brightonHove from "../../img/soccerTeam/epl/브라이튼 앤 호브 알비온 FC....svg";
import burnley from "../../img/soccerTeam/epl/번리 FC 로고.svg";
import chelsea from "../../img/soccerTeam/epl/첼시 FC 로고.svg";
import crystalPalace from "../../img/soccerTeam/epl/크리스탈 팰리스 FC 로고.svg";
import everton from "../../img/soccerTeam/epl/에버튼 FC 로고.svg";
import leedsUnited from "../../img/soccerTeam/epl/리즈 유나이티드 FC 로고.svg";
import liverpool from "../../img/soccerTeam/epl/리버풀 FC 로고.svg";
import manchesterCity from "../../img/soccerTeam/epl/맨체스터 시티 FC 로고.svg";
import manchesterUnited from "../../img/soccerTeam/epl/맨체스터 유나이티드 FC 로고.svg";
import newCastle from "../../img/soccerTeam/epl/뉴캐슬 유나이티드 FC 로고.svg";
import nottingham from "../../img/soccerTeam/epl/노팅엄 포레스트 FC 로고.svg";
import sunderland from "../../img/soccerTeam/epl/선덜랜드 AFC 로고.svg";
import tottenhamHotspur from "../../img/soccerTeam/epl/토트넘 홋스퍼 FC 로고.svg";
import wolves from "../../img/soccerTeam/epl/울버햄튼 원더러스 FC 로고.svg";

// 라리가 
import granada from "../../img/soccerTeam/laligaSpain/그라나다 CF 로고.svg";
import alaves from "../../img/soccerTeam/laligaSpain/데포르티보 알라베스 로고.svg";
import rayoVallecano from "../../img/soccerTeam/laligaSpain/라요 바예카노 로고.svg";
import levante from "../../img/soccerTeam/laligaSpain/레반테 UD 로고.svg";
import realMadrid from "../../img/soccerTeam/laligaSpain/레알 마드리드 CF 로고.svg";
import realValladolid from "../../img/soccerTeam/laligaSpain/레알 바야돌리드 CF 로고.svg";
import realBetis from "../../img/soccerTeam/laligaSpain/레알 베티스 발롬피에 로고.svg";
import realSociedad from "../../img/soccerTeam/laligaSpain/레알 소시에다드 로고.svg";
import realOviedo from "../../img/soccerTeam/laligaSpain/레알 오비에도 로고.svg";
import manCity from "../../img/soccerTeam/laligaSpain/맨체스터 시티 FC 로고.svg";
import valencia from "../../img/soccerTeam/laligaSpain/발렌시아 CF 로고.svg";
import villarreal from "../../img/soccerTeam/laligaSpain/비야레알 CF 로고.svg";
import sevilla from "../../img/soccerTeam/laligaSpain/세비야 FC 로고.svg";
import athleticBilbao from "../../img/soccerTeam/laligaSpain/아틀레틱 클루브 로고.svg";
import atleticoMadrid2020 from "../../img/soccerTeam/laligaSpain/아틀레티코 마드리드 로고.svg";
import elche from "../../img/soccerTeam/laligaSpain/엘체 CF 로고.svg";
import girona from "../../img/soccerTeam/laligaSpain/지로나 FC 로고.svg";
import cadiz from "../../img/soccerTeam/laligaSpain/카디스 CF 로고.svg";
import cfrFemenino from "../../img/soccerTeam/laligaSpain/코파 델 레이 로고 레드.svg";
import copaDelRey from "../../img/soccerTeam/laligaSpain/코파 델 레이 로고.svg";
import copaDelReyWhite from "../../img/soccerTeam/laligaSpain/코파 델 레이 화이트 로고.svg";
import getafe from "../../img/soccerTeam/laligaSpain/헤타페 CF 로고.svg";
import osasuna from "../../img/soccerTeam/laligaSpain/CA 오사수나 로고.svg";
import leganes from "../../img/soccerTeam/laligaSpain/CD 레가네스 로고.svg";
import barcelona from "../../img/soccerTeam/laligaSpain/FC 바르셀로나 로고.svg";
import celtaVigo from "../../img/soccerTeam/laligaSpain/RC 셀타 데 비고 로고.svg";
import mallorca from "../../img/soccerTeam/laligaSpain/RCD 마요르카 로고.svg";



export default function HomeBodyPage() {
 const [selectedTab, setSelectedTab] = useState("전체");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const matches = [
    {
      league: "England Premium League",
      home: "리버플",
      away: "첼시",
      date: "2025.08.02",
      time: "04:10",
      homeLogo: liverpool,
      awayLogo: chelsea,
      homeScore: 0,
      awayScore: 0,
    },
    {
      league: "England Premium League",
      home: "리버플",
      away: "토트넘",
      time: "09:10",
      date: "2025.07.31",
      homeLogo: liverpool,
      awayLogo: tottenhamHotspur,
      homeScore: 3,
      awayScore: 0,
    },
    {
      league: "LA LIGA EA SPORTS",
      home: "지로나",
      away: "라요 바예카노",
      date: "2025.08.15",
      time: "09:10",
      homeLogo: girona,
      awayLogo: rayoVallecano,
      homeScore: 3,
      awayScore: 0,
    },
  ];

  const headerMenu = ["전체", "리그별", "즐겨찾기"];
  //리그별 분류 (epl, 챔스, 라리가)
  const groupByLeague = matches.reduce((acc, cur) => {
    if (!acc[cur.league]) acc[cur.league] = [];
    acc[cur.league].push(cur);
    return acc;
  }, {});
  //날짜 기준으로 정렬 
  const sortedMatches = [...matches].sort((a, b) => {
    const dateA = a.date?.replace(/\./g, "-") || "";
    const dateB = b.date?.replace(/\./g, "-") || "";
    return dateA.localeCompare(dateB);
  });

  return (
    <div className="HomeContainer">
      <h1 className="pageTitle">해외축구 커뮤니티</h1>

      <div className="widgetBtns">
        <button className="widgetBtn" onClick={() => setShowCalendar(!showCalendar)}>📅 캘린더</button>
        <button className="widgetBtn" onClick={() => setShowSchedule(!showSchedule)}>🕒 경기일정</button>
      </div>

      {showCalendar && (
        <div className="widgetBox">
          <button className="closeBtn" onClick={() => setShowCalendar(false)}>X</button>
          <div className="calendarBox">
               <CalendarBox matches={matches} />
          </div>
        </div>
      )}

      {showSchedule && (
        <div className="widgetBox">
          <button className="closeBtn" onClick={() => setShowSchedule(false)}>X</button>
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
            {selectedTab === "전체" &&
              Object.entries(groupByLeague).map(([leagueName, matches]) => {
                const sortedMatches = [...matches].sort((a, b) => {
                  const dateA = a.date?.replace(/\./g, "-") || "";
                  const dateB = b.date?.replace(/\./g, "-") || "";
                  return dateA.localeCompare(dateB);
                });

                let prevDate = null;

                return (
                  <div key={leagueName}>
                    {sortedMatches.map((match, idx) => {
                      const showDateHeader = match.date !== prevDate;
                      prevDate = match.date;

                      return (
                        <React.Fragment key={idx}>
                          {showDateHeader && (
                            <span className="dateHeader"> {match.date}</span>
                          )}
                          <MatchCard match={match} />
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })}
            {selectedTab === "리그별" &&
              Object.entries(groupByLeague).map(([leagueName, matches]) => {
                const sortedMatches = [...matches].sort((a, b) => {
                  const dateA = a.date?.replace(/\./g, "-") || "";
                  const dateB = b.date?.replace(/\./g, "-") || "";
                  return dateA.localeCompare(dateB);
                });

                let prevDate = null;

                return (
                  <div key={leagueName}>
                    <h3 className="leagueTitle">{leagueName}</h3>
                    {sortedMatches.map((match, idx) => {
                      const showDateHeader = match.date !== prevDate;
                      prevDate = match.date;

                      return (
                        <React.Fragment key={idx}>
                          {showDateHeader && (
                            <span className="dateHeader">📅 {match.date}</span>
                          )}
                          <MatchCard match={match} />
                        </React.Fragment>
                      );
                    })}
      </div>
    );
  })}

            {selectedTab === "즐겨찾기" && (
              <div className="empty">즐겨찾기 팀이 없습니다.</div>
            )}
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

export function MatchCard({ match }) {
  return (
    <div className="matchCard">
      <img className="teamBg left" src={match.homeLogo} alt={match.home} />
      <img className="teamBg right" src={match.awayLogo} alt={match.away} />

      <div className="matchInfo">
        <div className="teamName">{match.home}</div>
        <div className="teamName">{match.away}</div>
        <div className="matchTime">{match.time}</div>
        <div className="scoreBox">
          {match.homeScore} : {match.awayScore}
        </div>
      </div>
    </div>
  );
}