// apiJson 말고 apiFetch 사용!
import { apiJson } from "./apiClient";

export async function addBoard({ content, matchtagList, image,sport,league}) {
  const payload = {
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
  // capturedImage(dataURL)에서 경로를 만들어내는 로직 (예시)
  // 실제 저장소 정책에 맞게 파일명을 정하면 됨
  const fakePath = `/assets/upload/boardUpload_${Date.now()}.png`;
  
  // TODO: 실제로는 이 경로에 파일을 저장해야 함
  // 지금은 DB에 저장될 path 문자열만 반환
  return fakePath;
}

export async function getBoardList(sport, league) {
  const params = new URLSearchParams();
  if (sport) params.append("sport", sport);
  if (league) params.append("league", league);

  const url = `/api/board/{sport}/{league}/list${params.toString() ? "?" + params.toString() : ""}`;
  return await apiJson(url, { method: "GET" });
}