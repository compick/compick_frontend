// src/api/baseball/kbo.js
import { getMatchesByRange, getMatchDetail } from "../Matches";

export const getKboMatch = (params) => {
  return getMatchesByRange("baseball", "kbo", params.startISO, params.endISO);
};

export const getKboMatchDetail = (matchId) => {
  return getMatchDetail("baseball", "kbo", matchId);
};
