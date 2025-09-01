// src/api/soccer/laliga.js
import { getMatchesByRange, getMatchDetail } from "../Matches";

export const getLaligaMatch = (params) => {
  return getMatchesByRange("soccer", "스페인 라리가", params.startISO, params.endISO);
};

export const getLaligaMatchDetail = (matchId) => {
  return getMatchDetail("soccer", "스페인 라리가", matchId);
};
