import { useState } from "react";

import arsenal from "../../img/soccerTeam/arsenal.png";
import astonVilla from "../../img/soccerTeam/astonVilla.png";
import brentford from "../../img/soccerTeam/brentford.png";
import brightonHove from "../../img/soccerTeam/brightonHove.png";
import burnley from "../../img/soccerTeam/burnley.png";
import chelsea from "../../img/soccerTeam/chelsea.png";
import crystalPalace from "../../img/soccerTeam/crystalPalace.png";
import everton from "../../img/soccerTeam/everton.png";
import leedsUnited from "../../img/soccerTeam/leedsUnited.png";
import liverpool from "../../img/soccerTeam/liverpool.png";
import manchesterCity from "../../img/soccerTeam/manchesterCity.png";
import manchesterUnited from "../../img/soccerTeam/manchesterUnited.png";
import newCastle from "../../img/soccerTeam/newCastle.png";
import nottingham from "../../img/soccerTeam/nottingham.png";
import sunderland from "../../img/soccerTeam/sunderland.png";
import tottenhamHotspur from "../../img/soccerTeam/tottenhamHotspur.png";
import wolves from "../../img/soccerTeam/wolves.png";

export default function HomeBodyPage(){

    const data=[{
                home : "리버플",
                away : "첼시",
                tiem : "2025.08.02 KST 04:10",
                homeLogo : liverpool,
                awayLogo : chelsea,
                homeScore : 0,
                awayScore : 0,
            },
            {
                home : "리버플",
                away : "토트넘",
                tiem : "2025.07.31 KST 04:10",
                homeLogo : liverpool,
                awayLogo : tottenhamHotspur,
                homeScore : 3,
                awayScore : 0,
            },
        ]

    return(
        <div className="bodyContainer">
            <div className="content">
                <div className="contentBox">
                {data.map((match, index) => (
                    <div className="matchCard" key={index}>
                    <div className="matchInfo">
                        <div className="team">
                        <img src={match.homeLogo} alt={match.home} className="team-logo" />
                        <span className="team-name">{match.home}</span>
                    </div>
                    <div className="score">
                        {match.homeScore} : {match.awayScore}
                    </div>
                    <div className="matchTime">{match.tiem}</div>
                    <div className="team">
                        <span className="team-name">{match.away}</span>
                        <img src={match.awayLogo} alt={match.away} className="team-logo" />
                    </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
    
}