// apiJson 말고 apiFetch 사용!
import { apiJson,apiForm } from "./apiClient";

export async function addBoard({ title, content, matchtagList = [], capturedImage, sport, league }) {
  const formData = new FormData();

  // ⚠️ DTO 필드명은 서버 DTO와 맞춰주세요.
  // 서버가 matchtagName을 기대한다면 아래에서 matchtagName으로 보내세요.
  const dto = {
    title,
    content,
    sport,
    league,
    // 서버가 matchtagList를 받는다면 이 라인만,
    // 서버가 matchtagName을 받는다면 아래 라인을 matchtagName으로 바꾸세요.
    matchtagList,                // ← 필요에 따라 matchtagName으로 변경
    // matchtagName: matchtagList // ← 서버가 matchtagName을 기대하면 이 라인 사용
  };

  // 반드시 JSON Blob으로!
  formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

  // 파일 파트(선택)
  if (capturedImage) {
    const blob = await (await fetch(capturedImage)).blob();
    const file = new File([blob], `boardUpload_${Date.now()}.png`, { type: blob.type || "image/png" });
    formData.append("file", file);
  }

  // 절대 Content-Type 헤더를 수동으로 설정하지 마세요 (boundary 필요)
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

  const url = `/api/board/list${params.toString() ? "?" + params.toString() : ""}`;
  return await apiJson(url, { method: "GET" });
}
export async function toggleLike(boardId) {
  return await apiJson(`/api/board/like/${boardId}`, {
    method: "POST"
  });
}
export async function getPostDetail(boardId) {
  return await apiJson(`/api/board/detail/${boardId}`, { method: "GET" });
}
