import React from "react";
import TeamLogo from "./TeamLogo";

export default function H2HMatch({ match }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <div className="h2h-match">
      <div style={{ flex: 1 }}>
        <div className="match-date">{formatDate(match.startTime)}</div>
        <div className="match-league">{match.leagueName}</div>
      </div>
      <div className="match-teams">
        <div className="team">
          <TeamLogo teamName={match.homeTeamName} logoUrl={match.homeTeamLogo} />
          <span className="team-name">{match.homeTeamName}</span>
        </div>
        <div className="score">
          {match.homeScore || 0} : {match.awayScore || 0}
        </div>
        <div className="team">
          <span className="team-name">{match.awayTeamName}</span>
          <TeamLogo teamName={match.awayTeamName} logoUrl={match.awayTeamLogo} />
        </div>
      </div>
    </div>
  );
}
