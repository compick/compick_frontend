import React from "react";
import { useNavigate } from "react-router-dom";
import GetLeagueLogo from "../../../../utils/GetLeagueLogo";
import GetTeamLogo from "../../../../utils/GetTeamLogo";
import { toSportSlug, toLeagueSlug } from "../../../../utils/mapper";

const pick = (...vals) => {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};

export default function MatchCard({ match, likedMatches = [], onLike }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const rawSport = pick(match.sport, match.sportCode, match.category);
    const rawLeague = pick(
      match.leagueNickname,
      match.league,
      match.leagueCode,
      match.leagueName
    );
    
    const rawId = pick(match.matchId, match.id);

    if (!rawSport || !rawLeague || !rawId) {
      console.error("경로 생성 실패", { rawSport, rawLeague, rawId, match });
      return;
    }

    const sport = toSportSlug(rawSport);
    const league = toLeagueSlug(rawLeague);
    const id = encodeURIComponent(String(rawId));
    console.log('[NAV]', {
      rawSport, rawLeague, rawId,
      sport: toSportSlug(rawSport),
      league: toLeagueSlug(rawLeague),
      id: String(rawId)
    });
    
    navigate(`/match/${sport}/${league}/${id}`);
  };

  const handleDoubleClick = () => onLike?.(match);

  const isLiked = likedMatches.some((likedMatch) => likedMatch.id === match.id);
  const cardClassName = `matchCard ${isLiked ? "liked" : ""}`;
  const isMma = match.league && String(match.league).toLowerCase() === "ufc";

  const leagueLogo =
    match.leagueLogo || GetLeagueLogo(match.leagueNickname || match.league);
  const homeTeamLogo =
    match.homeTeamLogo || GetTeamLogo(match.homeTeamName || match.home);
  const awayTeamLogo =
    match.awayTeamLogo || GetTeamLogo(match.awayTeamName || match.away);

  return (
    <div
      className={cardClassName}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {!isMma && (
        <>
          <img
            className="teamBg left"
            src={homeTeamLogo}
            alt={match.homeTeamName || match.home}
          />
          <img
            className="teamBg right"
            src={awayTeamLogo}
            alt={match.awayTeamName || match.away}
          />
        </>
      )}

      <div className="matchInfo">
        <div className="teamSection">
          <div className="teamName">{match.homeTeamName || match.home}</div>
        </div>

        <div className="scoreBox">
          <div className="scoreText">
            {match.homeScore} : {match.awayScore}
          </div>
          <div className="matchTime">{match.time}</div>
          {match.matchStatus && (
            <div className="matchStatus">{match.matchStatus}</div>
          )}
        </div>

        <div className="teamSection">
          <div className="teamName">{match.awayTeamName || match.away}</div>
        </div>
      </div>
    </div>
  );
}
