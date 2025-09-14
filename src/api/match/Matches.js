// src/api/matches.js
import { apiFetch, apiJson } from "../apiClient";
import { useState } from "react";

// 공용 안전 추출기
const extractData = (res, fallback = []) =>
  (res && typeof res === "object" && "data" in res)
    ? res.data
    : (res ?? fallback);

// 공용 결과 빌더
const buildResult = (status, data, error, requestUrl, response = null, startedAt) => ({
  status,
  data,
  error,
  meta: {
    requestUrl,
    startedAt,
    finishedAt: Date.now(),
    response, // ← 원본 응답 저장
  },
});
// [1] 범위 조회 [start, end)
export const getMatchesByRange = async (sport, league, startISO, endISO) => {
  const params = new URLSearchParams({ start: startISO, end: endISO });
  const requestUrl = `/api/match/${sport}/${league}?${params}`;
  const startedAt = Date.now();

  try {
    const response = await apiJson(requestUrl);
    const payload = extractData(response, []);
    return buildResult('success', payload, null, requestUrl, response, startedAt);
  } catch (error) {
    return buildResult('error', [], error?.message ?? 'Request failed', requestUrl, null, startedAt);
  }
};

// [2] 월별 조회 (year/month)
export const getMatchesByMonth = async (sport, league, year, month) => {
  const params = new URLSearchParams({ year, month });
  const requestUrl = `/api/match/${sport}/${league}/monthly?${params}`;
  console.log('[API] monthly requestUrl =', requestUrl);  // ★
  const startedAt = Date.now();

  try {
    const response = await apiJson(requestUrl);
    const payload = extractData(response, []);
    return buildResult('success', payload, null, requestUrl, response, startedAt);
  } catch (error) {
    return buildResult('error', [], error?.message ?? 'Request failed', requestUrl, null, startedAt);
  }
};


// [3] 경기 상세
export const getMatchDetail = async (sport, league, matchId) => {
  const requestUrl = `/api/match/${sport}/${league}/${matchId}`;
  const startedAt = Date.now();
  try {
    
    const response = await apiJson(requestUrl);
     console.log("[API] match detail response =", response);
    const payload = extractData(response, null);
    return {
      status: 'success',
      data: payload,
      error: null,
      meta: { requestUrl, startedAt, finishedAt: Date.now() }
    };
  } catch (error) {
    return {
      status: 'error',
      data: null,
      error: error.message,
      meta: { requestUrl, startedAt, finishedAt: Date.now() }
    };
  }
};

// [4] 팀 순위
export const getTeamRankings = async (leagueType, leagueId = "all", season = new Date().getFullYear()) => {
  const path = leagueId === "all"
    ? `/api/${leagueType}/all/rank`
    : `/api/${leagueType}/${leagueId}/rank`;
  const params = new URLSearchParams({ season });
  const requestUrl = `${path}?${params}`;
  const startedAt = Date.now();
  try {
    const response = await apiJson(requestUrl);
    const payload = extractData(response, []);
    return {
      status: 'success',
      data: payload,
      error: null,
      meta: { requestUrl, startedAt, finishedAt: Date.now() }
    };
  } catch (error) {
    return {
      status: 'error',
      data: [],
      error: error.message,
      meta: { requestUrl, startedAt, finishedAt: Date.now() }
    };
  }
};

// [5] 매치경기 검색


// ===== 커스텀 훅 =====
export const useMatchesState = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequestUrl, setLastRequestUrl] = useState("");

  const fetchMatches = async (sport, league, year, month) => {
    setLoading(true);
    setError(null);
    const result = await getMatchesByMonth(sport, league, year, month);
    if (result.status === 'success') {
      setMatches(Array.isArray(result.data) ? result.data : []);
    } else {
      setError(result.error);
    }
    if (result.meta?.requestUrl) setLastRequestUrl(result.meta.requestUrl);
    setLoading(false);
    return result;
  };

  const fetchMatchesByRange = async (sport, league, startISO, endISO) => {
    setLoading(true);
    setError(null);
    const result = await getMatchesByRange(sport, league, startISO, endISO);
    if (result.status === 'success') {
      setMatches(Array.isArray(result.data) ? result.data : []);
    } else {
      setError(result.error);
    }
    if (result.meta?.requestUrl) setLastRequestUrl(result.meta.requestUrl);
    setLoading(false);
    return result;
  };

  return {
    matches,
    loading,
    error,
    lastRequestUrl,        // 👈 여기서 URL을 노출
    fetchMatches,
    fetchMatchesByRange,
    setMatches,
    setLoading,
    setError
  };
};
