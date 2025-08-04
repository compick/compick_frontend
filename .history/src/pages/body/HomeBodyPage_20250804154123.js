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

export default function HomeBodyPage(){

    const data=[{
                league : "England Premium League",
                home : "리버플",
                away : "첼시",
                tiem : "2025.08.02 KST 04:10",
                homeLogo : liverpool,
                awayLogo : chelsea,
                homeScore : 0,
                awayScore : 0,
            },
            {
                league : "England Premium League",
                home : "리버플",
                away : "토트넘",
                tiem : "2025.07.31 KST 09:10",
                homeLogo : liverpool,
                awayLogo : tottenhamHotspur,
                homeScore : 3,
                awayScore : 0,
            },
            {
                league : "LA LIGA EA SPORTS",
                home : "지로나",
                away : " 라요 바예카노",
                tiem : "2025.08.15 KST 09:10",
                homeLogo : liverpool,
                awayLogo : tottenhamHotspur,
                homeScore : 3,
                awayScore : 0,
            },
        ]
        const headerMenu = [
          "전체",
          "리그별",
          "즐겨찾기"
        ];

   return (
    <div className="bodyContainer">
      <div className="header schedule">
        <div className="container" >
          {headerMenu.map((menu,index)=>{
            <div className ="menuTab" key={index}>
              {menu}
            </div>
          })}
        </div>
      </div>
      <div className="content">
        <div className="contentBox">
          {data.map((match, index) => (
            <div className="matchCard" key={index}>
              <div
                className="teamBg left"
                style={{ backgroundImage: `url(${match.homeLogo})` }}
              ></div>
              <div
                className="teamBg right"
                style={{ backgroundImage: `url(${match.awayLogo})` }}
              ></div>

              <div className="matchInfo">
                <div className="teamName ">{match.home}</div>
                <div className="teamName ">{match.away}</div>
              </div>
                  <div className="matchTime">{match.tiem}</div>
                <div className="scoreBox ">
                  <div className="scoreText">
                    {match.homeScore} : {match.awayScore}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}