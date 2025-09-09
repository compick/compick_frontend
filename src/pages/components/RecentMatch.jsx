import React from "react";
import TeamLogo from "./TeamLogo";

export default function RecentMatch({ match, navigate }) {
  const getStatusText = (status) => {
    switch (status) {
      case "scheduled": return "예정";
      case "live": return "진행중";
      case "finished": return "종료";
      case "Ended": return "경기종료";
      default: return status || "";
    }
  };

  return (
    <div
      className="recent-match-item"
      onClick={() =>
        navigate(`/match/${match.sport}/${match.leagueName}/${match.matchId}`)
      }
    >
      <div className="match-info">
        <span>{match.leagueNickname}</span>
        <div
          className={`match-league ${
            !match.matchStatus || match.matchStatus === "" ? "no-border" : ""
          }`}
        >
          {getStatusText(match.matchStatus)}
        </div>

        {/* 홈팀 */}
        <div className="match-row">
          {match.homeTeamLogo && (
            <img
              src={match.homeTeamLogo}
              alt={match.homeTeamName}
              className="team-logo"
            />
          )}
          <span className="team-name">{match.homeTeamName || ""}</span>
          <span className="team-score">{match.homeScore ?? ""}</span>
        </div>

        {/* 원정팀 */}
        <div className="match-row">
          {match.awayTeamLogo && (
            <img
              src={match.awayTeamLogo}
              alt={match.awayTeamName}
              className="team-logo"
            />
          )}
          <span className="team-name">{match.awayTeamName || ""}</span>
          <span className="team-score">{match.awayScore ?? ""}</span>
        </div>
      </div>
    </div>
  );
}
