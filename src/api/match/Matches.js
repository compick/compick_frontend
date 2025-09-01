// src/api/matches.js
import fetchInstance from "../FetchInstance";

/**
 * 공통 규칙:
 *  - 범위 조회:  GET /api/match/{sport}/{league}?start&end
 *  - 월별 조회:  GET /api/match/{sport}/{league}/monthly?year&month
 *  - 상세 조회:  GET /api/match/{sport}/{league}/{matchId}
 *
 * 전체보기는 sport='all', league='all' 로 그대로 넘겨서 호출하면 됩니다.
 * 특정 스포츠 전체 리그는 sport='{sport}', league='all'
 */

// [1] 범위 조회 [start, end)
export const getMatchesByRange = (sport, league, startISO, endISO) => {
  return fetchInstance(`/match/${sport}/${league}`, {
    method: "GET",
    params: { start: startISO, end: endISO },
  });
  // 반환: MatchCardDto[]
};

// [2] 월별 조회 (year/month)
export const getMatchesByMonth = (sport, league, year, month) => {
  return fetchInstance(`/match/${sport}/${league}/monthly`, {
    method: "GET",
    params: { year, month },
  });
  // 반환: MatchCardDto[]
};

// [3] 경기 상세
export const getMatchDetail = (sport, league, matchId) => {
  return fetchInstance(`/match/${sport}/${league}/${matchId}`, {
    method: "GET",
  });
  // 반환: MatchCardDto (or 상세 DTO)
};

// [4] 팀 순위
export const getTeamRankings = (
  leagueType,
  leagueId = "all",
  season = new Date().getFullYear()
) => {
  const path =
    leagueId === "all"
      ? `/${leagueType}/all/rank`
      : `/${leagueType}/${leagueId}/rank`;

  return fetchInstance(path, {
    method: "GET",
    params: { season },
  });
  // 반환: RankDto[]
};
