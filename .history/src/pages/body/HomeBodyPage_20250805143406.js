import { useState } from "react";

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

  const data = [
    {
      league: "England Premium League",
      home: "리버플",
      away: "첼시",
      tiem: "2025.08.02 KST 04:10",
      homeLogo: liverpool,
      awayLogo: chelsea,
      homeScore: 0,
      awayScore: 0,
    },
    {
      league: "England Premium League",
      home: "리버플",
      away: "토트넘",
      tiem: "2025.07.31 KST 09:10",
      homeLogo: liverpool,
      awayLogo: tottenhamHotspur,
      homeScore: 3,
      awayScore: 0,
    },
    {
      league: "LA LIGA EA SPORTS",
      home: "지로나",
      away: " 라요 바예카노",
      tiem: "2025.08.15 KST 09:10",
      homeLogo: girona,
      awayLogo: rayoVallecano,
      homeScore: 3,
      awayScore: 0,
    },
  ];

  const headerMenu = ["전체", "리그별", "즐겨찾기"];

  // 리그별 그룹핑
  const groupByLeague = data.reduce((acc, cur) => {
    if (!acc[cur.league]) acc[cur.league] = [];
    acc[cur.league].push(cur);
    return acc;
  }, {});

  return (
    <div className="bodyContainer">
      <div className="header schedule">
        <div className="container">
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
      </div>

      <div className="content">
        <div className="contentBox">
          {selectedTab === "전체" &&
            data.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}

          {selectedTab === "리그별" &&
            Object.entries(groupByLeague).map(([leagueName, matches]) => (
              <div key={leagueName}>
                <h3 className="leagueTitle">{leagueName}</h3>
                {matches.map((match, index) => (
                  <MatchCard key={index} match={match} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match }) {
  return (
    <div className="matchCard">
      <div
        className="teamBg left"
        style={{   backgroundImage: `url("/img/soccerTeam/epl/리버풀 FC 로고.svg")`, // ⛔ import 아님
        backgroundSize: "80%", // 임시 확대
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%", // 강제 높이
        border: "1px solid red", // 디버깅용 
        }}
      />
      <div
        className="teamBg right"
        style={{ backgroundImage: `url(${match.awayLogo})` }}
      />

      <div className="matchInfo">
        <div className="teamName">{match.home}</div>
        <div className="teamName">{match.away}</div>
      </div>
      <div className="matchTime">{match.tiem}</div>
      <div className="scoreBox">
        <div className="scoreText">
          {match.homeScore} : {match.awayScore}
        </div>
      </div>
    </div>
  );
}
