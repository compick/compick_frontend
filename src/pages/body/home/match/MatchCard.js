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
 const getStatusText = (status) => {
  switch (status) {
    case 'Not Started':        // 0
      return '경기예정';       // notstarted

    case 'First Half':         // 1
    case 'Second Half':        // 12
      return '진행중';         // inprogress

    case 'Halftime':           // 11
      return '하프타임';       // halftime

    case 'Break Time':         // 13
      return '휴식시간';       // break

    case 'Extra Time First Half':   // 20
    case 'Extra Time Halftime':     // 21
    case 'Extra Time Second Half':  // 22
      return '연장전';              // extra

    case 'Penalty Shootout':        // 30
    case 'Penalty Shootout Halftime': // 31
    case 'Penalty Shootout End':    // 32
      return '승부차기';            // penalty

    case 'Ended':              // 100
      return '경기종료';       // finished

    case 'Awarded':            // 110
      return '몰수승';         // awarded

    case 'Abandoned':          // 120
      return '중단됨';         // abandoned

    case 'Postponed':          // 130
      return '연기됨';         // postponed

    case 'Cancelled':          // 140
      return '취소됨';         // cancelled

    case 'Suspended':          // 150
      return '일시중단';       // suspended

    case 'Interrupted':        // 160
      return '중단됨';         // interrupted

    default:
      return status || '경기 상태';
  }
};
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
          <div className={`matchStatus ${
              !match.matchStatus || match.matchStatus === "" ? "no-border" : ""
            }`}>
            {getStatusText(match.matchStatus)}
          </div>
        )}
        </div>

        <div className="teamSection">
          <div className="teamName">{match.awayTeamName || match.away}</div>
        </div>
      </div>
    </div>
  );
}
