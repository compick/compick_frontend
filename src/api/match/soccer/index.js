import api from "../../FetchInstance";

/** 축구 - EPL 경기 조회 */
export const getEplMatches = async (startISO, endISO) => {
  console.log('Calling getEplMatches with:', { startISO, endISO });
  const { data } = await api.get('/match/soccer/epl', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** 축구 - EPL 월별 경기 조회 */
export const getEplMatchesMonthly = async (year, month) => {
  console.log('Calling getEplMatchesMonthly with:', { year, month });
  const { data } = await api.get('/match/soccer/epl/monthly', {
    params: { year, month },
  });
  return data;
};

/** 축구 - 라리가 경기 조회 */
export const getLaligaMatches = async (startISO, endISO) => {
  console.log('Calling getLaligaMatches with:', { startISO, endISO });
  const { data } = await api.get('/soccer/laliga/match', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** 축구 - 라리가 월별 경기 조회 */
export const getLaligaMatchesMonthly = async (year, month) => {
  console.log('Calling getLaligaMatchesMonthly with:', { year, month });
  const { data } = await api.get('/match/soccer/laliga/monthly', {
    params: { year, month },
  });
  return data;
};


/** 축구 - 전체 리그 월별 경기 조회 */
export const getAllSoccerMatchesMonthly = async (year, month) => {
  console.log('Calling getAllSoccerMatchesMonthly with:', { year, month });
  const { data } = await api.get('/match/soccer/all/monthly', {
    params: { year, month },
  });
  return data;
};

/** 축구 - EPL 순위 조회 */
export const getEplRankings = async (season = new Date().getFullYear()) => {
  console.log('Calling getEplRankings with:', { season });
  const { data } = await api.get('/rank/soccer/epl', {
    params: { season },
  });
  return data;
};

/** 축구 - 라리가 순위 조회 */
export const getLaligaRankings = async (season = new Date().getFullYear()) => {
  console.log('Calling getLaligaRankings with:', { season });
  const { data } = await api.get('/rank/soccer/laliga', {
    params: { season },
  });
  return data;
};
