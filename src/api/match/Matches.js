// src/api/matches.js
import api from "../axiosInstance";

/** FullCalendar 뷰 범위 기반 조회: [start, end) */
export const getMatchesByRange = async (sport, league, startISO, endISO) => {
  console.log('Calling getMatchesByRange with:', { sport, league, startISO, endISO });
  const { data } = await api.get(`/${sport}/${league}/matches`, {
    params: { start: startISO, end: endISO },
  });
  return data; // MatchCardDto[]
};

/** (옵션) 월 그리드 조회: year/month */
export const getMatchesByMonth = async (sport, league, year, month) => {
  console.log('Calling getMatchesByMonth with:', { sport, league, year, month });
  const { data } = await api.get(`/${sport}/${league}/matches`, {
    params: { year, month }, // 컨트롤러에서 params = {"year","month"}로 매핑
  });
  return data; // MatchCardDto[]
};

/** 경기 상세 */
export const getMatchDetail = async (sport, league, matchId) => {
  const { data } = await api.get(`/${sport}/${league}/matches/${matchId}`);
  return data; // MatchCardDto (or 상세 DTO)
};

/** 팀 순위 조회 */
export const getTeamRankings = async (leagueType, leagueId = "all", season = new Date().getFullYear()) => {
  console.log("Calling getTeamRankings with:", { leagueType, leagueId, season });

  // 전체 리그(all)일 경우 경로: /api/rank/{leagueType}/all
  // 개별 리그일 경우 경로: /api/rank/{leagueType}/{leagueId}
  const path = leagueId === "all"
    ? `/api/rank/${leagueType}/all`
    : `/api/rank/${leagueType}/${leagueId}`;

  const { data } = await api.get(path, {
    params: { season },
  });

  return data; // 서버에서 반환되는 RankDto[] (예: { teamName, wins, losses, rank, ... })
};
