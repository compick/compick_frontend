// src/api/soccer/epl.js
import { getMatchesByRange, getMatchDetail } from "../Matches";

export const getEplMatch = (params) => {
  return getMatchesByRange("soccer", "epl", params.startISO, params.endISO);
};

export const getEplMatchDetail = (matchId) => {
  return getMatchDetail("soccer", "epl", matchId);
};