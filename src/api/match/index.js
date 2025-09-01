// src/api/match/index.js
import fetchInstance from "../FetchInstance";

/**
 * 규칙
 * - 범위:   GET /api/match/{sport}/{league}?start&end
 * - 월별:   GET /api/match/{sport}/{league}/monthly?year&month
 * - 상세:   GET /api/match/{sport}/{league}/{matchId}
 */

// [1] 범위 조회
export const getMatchesByRange = async (sport, league, startISO, endISO) => {
  return await fetchInstance(`/match/${sport}/${league}`, {
    method: 'GET',
    params: { start: startISO, end: endISO },
  });
};

// [2] 월별 조회
export const getMatchesByMonth = async (sport, league, year, month) => {
  return await fetchInstance(`/match/${sport}/${league}/monthly`, {
    method: 'GET',
    params: { year, month },
  });
};

// [3] 상세
export const getMatchDetail = async (sport, league, matchId) => {
  return await fetchInstance(`/match/${sport}/${league}/${matchId}`, {
    method: 'GET',
  });
};

// [4] 팀 순위
export const getTeamRankings = async (leagueType, leagueId = "all", season = new Date().getFullYear()) => {
  const path = leagueId === "all"
    ? `/${leagueType}/all/rank`
    : `/${leagueType}/${leagueId}/rank`;
  return await fetchInstance(path, {
    method: 'GET',
    params: { season },
  });
};
