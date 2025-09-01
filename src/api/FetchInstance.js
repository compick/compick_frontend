// src/api/FetchInstance.js
const BASE_URL = 'http://localhost:8080/api';
const TIMEOUT = 3000;

// 쿼리스트링 빌드
function buildUrl(endpoint, params) {
  let url = `${BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  return url;
}

// 204 대응 + JSON 파싱 안전 처리
async function safeParseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

// 실제 요청
export default async function fetchInstance(
  endpoint,
  { method = 'GET', params, body, headers } = {}
) {
  const url = buildUrl(endpoint, params);

  const token = localStorage.getItem('token');
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  // 요청 로그
  console.log('=== REQUEST DEBUG ===');
  console.log('Full URL:', url);
  console.log('Method:', method);
  console.log('Headers:', finalHeaders);
  console.log('Params:', params);
  console.log('Data:', body);
  console.log('====================');

  // timeout 래핑
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);

    const payload = await safeParseJson(res);

    if (!res.ok) {
      // 에러 로그
      console.error('=== ERROR DEBUG ===');
      console.error('Status:', res.status);
      console.error('Status Text:', res.statusText);
      console.error('Data:', payload);
      console.error('===================');

      const err = new Error(res.statusText || 'HTTP Error');
      err.status = res.status;
      err.data = payload;
      throw err;
    }

    // 응답 로그
    console.log('=== RESPONSE DEBUG ===');
    console.log('Status:', res.status);
    console.log('Data:', payload);
    console.log('=====================');

    return payload; // ← axios처럼 {data}가 아니라 "바로 데이터" 반환
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') {
      const err = new Error('Request timed out');
      err.code = 'TIMEOUT';
      throw err;
    }
    throw e;
  }
}
