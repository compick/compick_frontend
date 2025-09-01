import api from "../../FetchInstance";

/** 야구 - KBO 경기 조회 */
export const getKboMatches = async (startISO, endISO) => {
  console.log('Calling getKboMatches with:', { startISO, endISO });
  const { data } = await api.get('/baseball/kbo/match', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** 야구 - KBO 월별 경기 조회 */
export const getKboMatchesMonthly = async (year, month) => {
  console.log('Calling getKboMatchesMonthly with:', { year, month });
  const { data } = await api.get('/baseball/kbo/match/monthly', {
    params: { year, month },
  });
  return data;
};

/** 야구 - 전체 리그 경기 조회 */
export const getAllBaseballMatches = async (startISO, endISO) => {
  console.log('Calling getAllBaseballMatches with:', { startISO, endISO });
  const { data } = await api.get('/baseball/all/match', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** 야구 - 전체 리그 월별 경기 조회 */
export const getAllBaseballMatchesMonthly = async (year, month) => {
  console.log('Calling getAllBaseballMatchesMonthly with:', { year, month });
  const { data } = await api.get('/baseball/all/match/monthly', {
    params: { year, month },
  });
  return data;
};

/** 야구 - KBO 순위 조회 */
export const getKboRankings = async (season = new Date().getFullYear()) => {
  console.log('Calling getKboRankings with:', { season });
  const { data } = await api.get('/baseball/kbo/rank', {
    params: { season },
  });
  return data;
};
