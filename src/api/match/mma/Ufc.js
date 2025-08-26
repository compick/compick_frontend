// src/api/mma/ufc.js
import { getMatchesByRange, getMatchDetail } from "../Matches";

export const getUfcMatch = (params) => {
  return getMatchesByRange("mma", "ufc", params.startISO, params.endISO);
};

export const getUfcMatchDetail = (matchId) => {
  return getMatchDetail("mma", "ufc", matchId);
};
