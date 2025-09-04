import { API_BASE } from "../config";
import { getCookie, setCookie } from "../utils/Cookie";

// apiClient.js v 
const toAbs = (u) => /^https?:\/\//i.test(u) ? u : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(toAbs("/api/auth/refresh"), {
        method: "POST",
        credentials: "include" // RT 쿠키 전송(크로스도메인이면 CORS+SameSite=None 필요)
      });

      if (!res.ok) throw new Error("REFRESH_FAILED");
      const data = await res.json();
      const at = data?.data?.accessToken;

      if (!at) throw new Error("NO_ACCESS_TOKEN");
      setCookie("jwt", at);
      return at;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiFetch(input, init = {}) {
  const url = typeof input === "string" ? toAbs(input) : toAbs(input.url);
  const headers = new Headers(init.headers || {});
  const at = getCookie("jwt");
  if (at) headers.set("Authorization", `Bearer ${at}`);

  const reqInit = { credentials: 'include', ...init, headers };

  let res = await fetch(new Request(url, reqInit));

  if (res.status === 401) {
    let body; try { body = await res.clone().json(); } catch { }
    if (body?.msg === "ACCESS_TOKEN_EXPIRED") {
      try {
        const newAt = await refreshAccessToken();
        const h2 = new Headers(init.headers || {});
        h2.set("Authorization", `Bearer ${newAt}`);
        res = await fetch(new Request(url, { ...init, headers: h2, credentials: 'include' }));
      } catch { }
    }
  }
  return res;
}

export async function apiJson(input, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  const res = await apiFetch(input, { ...init, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.msg || `HTTP_${res.status}`);
  return data;
}
 
