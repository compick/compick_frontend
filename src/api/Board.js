// apiJson 말고 apiFetch 사용!
import { apiJson,apiForm } from "./apiClient";

export async function addBoard({ title,content, matchtagList, capturedImage ,sport,league}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("sport", sport);
  formData.append("league", league);

  // matchtagList 배열 JSON으로 넣음
  if (matchtagList && matchtagList.length > 0) {
    formData.append("matchtagList", JSON.stringify(matchtagList));
  }
  if (capturedImage) {
    const blob = await (await fetch(capturedImage)).blob();
    const file = new File([blob], `boardUpload_${Date.now()}.png`, { type: "image/png" });
    formData.append("file", file);
  }

  return await apiForm("/api/board/regist", formData);
}

export async function uploadCapturedImage(capturedImage) {
  const blob = await (await fetch(capturedImage)).blob();
  const file = new File([blob], `boardUpload_${Date.now()}.png`, { type: "image/png" });

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiForm("/api/upload/image", formData);

  return res.fileUrl; 
}

export async function getBoardList(sport, league) {
  const params = new URLSearchParams();
  if (sport) params.append("sport", sport);
  if (league) params.append("league", league);

  const url = `/api/board/list?sport=${sport ?? "all"}&league=${league ?? "all"}`; 
 return await apiJson(url, { method: "GET" });
}