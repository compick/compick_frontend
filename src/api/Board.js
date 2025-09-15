// apiJson 말고 apiFetch 사용!
import { apiJson } from "./apiClient";

export async function addBoard({ title,content, matchtagList, image,sport,league}) {
  const payload = {
    title,
    content,
    matchtagName: matchtagList,
    sport,
    league,
    image
  };
  console.log("[addBoard payload]", payload);
  // ✅ apiJson 사용 → 자동으로 Content-Type: application/json 붙고 JSON.stringify 해줌
  return await apiJson("/api/board/regist", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  
}

export async function uploadCapturedImage(capturedImage) {
  const blob = await (await fetch(capturedImage)).blob();
  const file = new File([blob], `boardUpload_${Date.now()}.png`, { type: "image/png" });

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiJson("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("업로드 실패");
  const data = await res.json();

  return data.fileUrl; // "/images/board/boardUpload_....png"
}

export async function getBoardList(sport, league) {
  const params = new URLSearchParams();
  if (sport) params.append("sport", sport);
  if (league) params.append("league", league);

  const url = `/api/board/list?sport=${sport ?? "all"}&league=${league ?? "all"}`; 
 return await apiJson(url, { method: "GET" });
}