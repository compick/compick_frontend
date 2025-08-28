import api from "../../axiosInstance";

/** MMA - UFC 경기 조회 */
export const getUfcMatches = async (startISO, endISO) => {
  console.log('Calling getUfcMatches with:', { startISO, endISO });
  const { data } = await api.get('/mma/ufc/match', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** MMA - UFC 월별 경기 조회 */
export const getUfcMatchesMonthly = async (year, month) => {
  console.log('Calling getUfcMatchesMonthly with:', { year, month });
  const { data } = await api.get('/mma/ufc/match/monthly', {
    params: { year, month },
  });
  return data;
};

/** MMA - 전체 리그 경기 조회 */
export const getAllMmaMatches = async (startISO, endISO) => {
  console.log('Calling getAllMmaMatches with:', { startISO, endISO });
  const { data } = await api.get('/mma/all/match', {
    params: { start: startISO, end: endISO },
  });
  return data;
};

/** MMA - 전체 리그 월별 경기 조회 */
export const getAllMmaMatchesMonthly = async (year, month) => {
  console.log('Calling getAllMmaMatchesMonthly with:', { year, month });
  const { data } = await api.get('/mma/all/match/monthly', {
    params: { year, month },
  });
  return data;
};

/** MMA - UFC 순위 조회 */
export const getUfcRankings = async (season = new Date().getFullYear()) => {
  console.log('Calling getUfcRankings with:', { season });
  const { data } = await api.get('/mma/ufc/rank', {
    params: { season },
  });
  return data;
};
