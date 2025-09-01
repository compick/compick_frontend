// src/api/match/soccer.js
import fetchInstance from "../../FetchInstance";
import { getTeamRankings } from "../Matches"; // 순위는 공통 함수 재사용

/** 축구 - EPL 경기 조회 */
export const getEplMatches = (startISO, endISO) => {
  console.log("Calling getEplMatches with:", { startISO, endISO });
  return fetchInstance(`/match/soccer/epl`, {
    method: "GET",
    params: { start: startISO, end: endISO },
  });
};

/** 축구 - EPL 월별 경기 조회 */
export const getEplMatchesMonthly = (year, month) => {
  console.log("Calling getEplMatchesMonthly with:", { year, month });
  return fetchInstance(`/match/soccer/epl/monthly`, {
    method: "GET",
    params: { year, month },
  });
};

/** 축구 - 라리가 경기 조회 */
export const getLaligaMatches = (startISO, endISO) => {
  console.log("Calling getLaligaMatches with:", { startISO, endISO });
  // 엔드포인트 규칙에 맞춰 /match/soccer/laliga 로 통일
  return fetchInstance(`/match/soccer/laliga`, {
    method: "GET",
    params: { start: startISO, end: endISO },
  });
};

/** 축구 - 라리가 월별 경기 조회 */
export const getLaligaMatchesMonthly = (year, month) => {
  console.log("Calling getLaligaMatchesMonthly with:", { year, month });
  return fetchInstance(`/match/soccer/laliga/monthly`, {
    method: "GET",
    params: { year, month },
  });
};

/** 축구 - 전체 리그 월별 경기 조회 */
export const getAllSoccerMatchesMonthly = (year, month) => {
  console.log("Calling getAllSoccerMatchesMonthly with:", { year, month });
  return fetchInstance(`/match/soccer/all/monthly`, {
    method: "GET",
    params: { year, month },
  });
};

/** 축구 - EPL 순위 조회 (공통 함수 사용) */
export const getEplRankings = (season = new Date().getFullYear()) =>
  getTeamRankings("soccer", "epl", season);

/** 축구 - 라리가 순위 조회 (공통 함수 사용) */
export const getLaligaRankings = (season = new Date().getFullYear()) =>
  getTeamRankings("soccer", "laliga", season);
