// apiJson 말고 apiFetch 사용!
import { apiFetch } from "./apiClient";

export async function addBoard({ content, matchtagList, boardImages, token, extra = {} }) {
  const fd = new FormData();
  fd.append("content", content ?? "");
  (matchtagList || []).forEach(t => fd.append("matchtagName", t));
  (boardImages  || []).forEach(f => fd.append("images", f));
  Object.entries(extra).forEach(([k, v]) => v != null && fd.append(k, v));


  const res = await apiFetch("/api/board/regist", {
    method: "POST",
    body: fd,
    headers: {
    Authorization: `Bearer ${token}` // ← 백틱 템플릿 문자열 사용해도 OK
  }
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.msg || `HTTP_${res.status}`);
  return data;
}
