import { apiJson } from "./apiClient";

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

  // 홈과 어웨이 전용 매칭 조회
  export const getHomeAndAwayMatches = async (sport, league, homeTeam, awayTeam) => {
    const requestUrl =  `/api/match/${encodeURIComponent(sport)}/${encodeURIComponent(league)}/h2h?home=${homeTeam}&away=${awayTeam}`;
    const startedAt = Date.now();
    console.log("[H2H] requestUrl =", requestUrl);
    try {
      const response = await apiJson(requestUrl);
      console.log("[H2H] raw response =", response);
      const payload = extractData(response, []);
      return buildResult('success', payload, null, requestUrl, response, startedAt);
    } catch (error) {
        console.error("[H2H] 요청 실패:", {
            url: requestUrl,
            message: error?.message,
            stack: error?.stack,
          });
      return buildResult('error', [], error?.message ?? 'Request failed', requestUrl, null, startedAt);
    }

}    
  // ★ 팀 최근 5경기 API (백엔드에 /recent 엔드포인트가 있다고 가정)
  // GET /api/match/{sport}/{league}/recent/home?team={id}
  export const getRecentMatchesByHome = async (sport, league, homeTeamId) => {
    const requestUrl = `/api/match/${encodeURIComponent(sport)}/${encodeURIComponent(league)}/recent/home?teamId=${homeTeamId}`;
    const startedAt = Date.now();
    console.log("[RECENTHOME] requestUrl =", requestUrl);
    try {
      const res = await apiJson(requestUrl);
      console.log("[RECENTHOME] raw response =", res, "data =", res?.data ?? res);
      const payload = extractData(res, []);
      return buildResult("success", payload, null, requestUrl, res, startedAt);
    } catch (error) {
      console.error("[RECENTHOME] 요청 실패:", { url: requestUrl, message: error?.message, stack: error?.stack });
      return buildResult("error", [], error?.message ?? "Request failed", requestUrl, null, startedAt);
    }
    };
    
    // GET /api/match/{sport}/{league}/recent/away?team={id}
  export const getRecentMatchesByAway = async (sport, league, awayTeamId) => {
    const requestUrl = `/api/match/${encodeURIComponent(sport)}/${encodeURIComponent(league)}/recent/away?teamId=${awayTeamId}`;
    const startedAt = Date.now();
    console.log("[RECENTAWAY] requestUrl =", requestUrl);
    try {
      const res = await apiJson(requestUrl);
      console.log("[RECENTAWAY] raw response =", res, "data =", res?.data ?? res);
      const payload = extractData(res, []);
      return buildResult("success", payload, null, requestUrl, res, startedAt);
    } catch (error) {
      console.error("[RECENTAWAY] 요청 실패:", { url: requestUrl, message: error?.message, stack: error?.stack });
      return buildResult("error", [], error?.message ?? "Request failed", requestUrl, null, startedAt);
    }
 
  };