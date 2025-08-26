// src/api/soccer/laliga.js
import { getMatchesByRange, getMatchDetail } from "../Matches";

export const getLaligaMatch = (params) => {
  return getMatchesByRange("soccer", "laliga", params.startISO, params.endISO);
};

export const getLaligaMatchDetail = (matchId) => {
  return getMatchDetail("soccer", "laliga", matchId);
};
