import { useState } from "react";

import arsenal from "../../img/soccerTeam/epl/arsenal.png";
import astonVilla from "../../img/soccerTeam/epl/astonVilla.png";
import brentford from "../../img/soccerTeam/epl/brentford.png";
import brightonHove from "../../img/soccerTeam/epl/brightonHove.png";
import burnley from "../../img/soccerTeam/epl/burnley.png";
import chelsea from "../../img/soccerTeam/epl/chelsea.png";
import crystalPalace from "../../img/soccerTeam/epl/crystalPalace.png";
import everton from "../../img/soccerTeam/epl/everton.png";
import leedsUnited from "../../img/soccerTeam/epl/leedsUnited.png";
import liverpool from "../../img/soccerTeam/epl/liverpool.png";
import manchesterCity from "../../img/soccerTeam/epl/manchesterCity.png";
import manchesterUnited from "../../img/soccerTeam/epl/manchesterUnited.png";
import newCastle from "../../img/soccerTeam/epl/newCastle.png";
import nottingham from "../../img/soccerTeam/epl/nottingham.png";
import sunderland from "../../img/soccerTeam/epl/sunderland.png";
import tottenhamHotspur from "../../img/soccerTeam/epl/tottenhamHotspur.png";
import wolves from "../../img/soccerTeam/epl/wolves.png";

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
      homeLogo: liverpool,
      awayLogo: tottenhamHotspur,
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
        style={{ backgroundImage: `url(${match.homeLogo})` }}
      ></div>
      <div
        className="teamBg right"
        style={{ backgroundImage: `url(${match.awayLogo})` }}
      ></div>

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
