// src/api/matches.js
import api from "../FetchInstance";

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
export const getMatchesByRange = async (sport, league, startISO, endISO) => {
  const { data } = await api.get(`/match/${sport}/${league}`, {
    params: { start: startISO, end: endISO },
  });
  return data; // MatchCardDto[]
};

// [2] 월별 조회 (year/month)
export const getMatchesByMonth = async (sport, league, year, month) => {
  const { data } = await api.get(`/match/${sport}/${league}/monthly`, {
    params: { year, month },
  });
  return data; // MatchCardDto[]
};

// [3] 경기 상세
export const getMatchDetail = async (sport, league, matchId) => {
  const { data } = await api.get(`/match/${sport}/${league}/${matchId}`);
  return data; // MatchCardDto (or 상세 DTO)
};


export const getTeamRankings = async (leagueType, leagueId = "all", season = new Date().getFullYear()) => {
  const path = leagueId === "all"
    ? `/${leagueType}/all/rank`
    : `/${leagueType}/${leagueId}/rank`;
  const { data } = await api.get(path, { params: { season } });
  return data;




// /** FullCalendar 뷰 범위 기반 조회: [start, end) */
// export const getMatchesByRange = async (sport, league, startISO, endISO) => {
//   console.log('Calling getMatchesByRange with:', { sport, league, startISO, endISO });
//   const { data } = await api.get(`/matches/${sport}/${league}`, {
//     params: { start: startISO, end: endISO },
//   });
//   return data; // MatchCardDto[]
// };

// /** (옵션) 월 그리드 조회: year/month */
// export const getMatchesByMonth = async (sport, league, year, month) => {
//   console.log('Calling getMatchesByMonth with:', { sport, league, year, month });
//   const { data } = await api.get(`/matches/${sport}/${league}`, {
//     params: { year, month }, // 컨트롤러에서 params = {"year","month"}로 매핑
//   });
//   return data; // MatchCardDto[]
// };

// /** 경기 상세 */
// export const getMatchDetail = async (sport, league, matchId) => {
//   const { data } = await api.get(`/matches/${sport}/${league}/${matchId}`);
//   return data; // MatchCardDto (or 상세 DTO)
// };

// /** 팀 순위 조회 */
// export const getTeamRankings = async (leagueType, leagueId = "all", season = new Date().getFullYear()) => {
//   // 새로운 API 경로 사용: /api/soccer/epl/rank 형태
//   const path = leagueId === "all"
//     ? `/${leagueType}/all/rank`
//     : `/${leagueType}/${leagueId}/rank`;

//   const { data } = await api.get(path, {
//     params: { season },
//   });

//   return data; // 서버에서 반환되는 RankDto[] (예: { teamName, wins, losses, rank, ... })
// };

// // 홈 API 함수들
// /** 홈 - 모든 경기 조회 (기본: 이번 주 월~일) */
// export const getHomeMatches = async (startISO, endISO) => {
//   console.log('Calling getHomeMatches with:', { startISO, endISO });
//   const { data } = await api.get('/home/matches', {
//     params: { start: startISO, end: endISO },
//   });
//   return data;
// };

// /** 홈 - 오늘 경기만 조회 */
// export const getHomeMatchesToday = async () => {
//   console.log('Calling getHomeMatchesToday');
//   const { data } = await api.get('/home/matches/today');
//   return data;
// };

// /** 홈 - 이번 주 경기 조회 */
// export const getHomeMatchesThisWeek = async () => {
//   console.log('Calling getHomeMatchesThisWeek');
//   const { data } = await api.get('/home/matches/this-week');
//   return data;
// };

// /** 홈 - 캘린더 월별 조회 */
// export const getHomeMatchesMonthly = async (year, month) => {
//   console.log('Calling getHomeMatchesMonthly with:', { year, month });
//   const { data } = await api.get('/home/matches/monthly', {
//     params: { year, month },
//   });
//   return data;
// };

// /** 홈 - 특정 날짜의 경기 조회 */
// export const getHomeMatchesByDate = async (date) => {
//   console.log('Calling getHomeMatchesByDate with:', { date });
//   const { data } = await api.get('/home/matches/date', {
//     params: { date },
//   });
//   return data;
// };

// // All API 함수들
// /** All - 모든 스포츠의 모든 리그 경기 조회 */
// export const getAllMatches = async (startISO, endISO) => {
//   console.log('Calling getAllMatches with:', { startISO, endISO });
//   const { data } = await api.get('/all/matches', {
//     params: { start: startISO, end: endISO },
//   });
//   return data;
// };

// /** All - 오늘 경기만 조회 */
// export const getAllMatchesToday = async () => {
//   console.log('Calling getAllMatchesToday');
//   const { data } = await api.get('/all/matches/today');
//   return data;
// };

// /** All - 이번 주 경기 조회 */
// export const getAllMatchesThisWeek = async () => {
//   console.log('Calling getAllMatchesThisWeek');
//   const { data } = await api.get('/all/matches/this-week');
//   return data;
// };

// /** All - 캘린더 월별 조회 */
// export const getAllMatchesMonthly = async (year, month) => {
//   console.log('Calling getAllMatchesMonthly with:', { year, month });
//   const { data } = await api.get('/all/matches/monthly', {
//     params: { year, month },
//   });
//   return data;
// };

// /** All - 특정 날짜의 경기 조회 */
// export const getAllMatchesByDate = async (date) => {
//   console.log('Calling getAllMatchesByDate with:', { date });
//   const { data } = await api.get('/all/match/date', {
//     params: { date },
//   });
//   return data;
// };

// /** All - 특정 스포츠의 모든 리그 경기 조회 */
// export const getAllMatchesBySport = async (sport, startISO, endISO) => {
//   console.log('Calling getAllMatchesBySport with:', { sport, startISO, endISO });
//   const { data } = await api.get(`/all/match/${sport}`, {
//     params: { start: startISO, end: endISO },
//   });
//   return data;
// };

// // 새로운 API 접근 경로 함수들
// /** 특정 스포츠/리그의 경기 조회 - /api/soccer/epl/match 형태 */
// export const getMatchesBySportLeague = async (sport, league, startISO, endISO) => {
//   console.log('Calling getMatchesBySportLeague with:', { sport, league, startISO, endISO });
//   const { data } = await api.get(`/match/${sport}/${league}`, {
//     params: { start: startISO, end: endISO },
//   });
//   return data;
// };

// /** 특정 스포츠/리그의 월별 경기 조회 - /api/soccer/epl/match/monthly 형태 */
// export const getMatchesBySportLeagueMonthly = async (sport, league, year, month) => {
//   const { data } = await api.get(`/match/${sport}/${league}/monthly`, {
//     params: { year, month },
//   });
//   return data;
}; 