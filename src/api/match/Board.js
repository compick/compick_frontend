import { apiJson } from "../apiClient";

const addBoard = async ({ userIdx, parentIdx, content, matchtagList, boardImages }) => {
  const requestUrl = `/api/board/regist`;
  const startedAt = Date.now();

  try {
    const formData = new FormData();

    // 기본 데이터
    formData.append("userIdx", userIdx);
    if (parentIdx) formData.append("parentIdx", parentIdx);
    formData.append("content", content ?? "");

    // 태그 배열 추가
    if (matchtagList && matchtagList.length > 0) {
      matchtagList.forEach(tag => formData.append("matchtagName", tag));
    }

    // 이미지 파일 추가
    if (boardImages && boardImages.length > 0) {
      boardImages.forEach(file => formData.append("images", file));
    }

    // axios 호출
    const response = await apiJson.post(requestUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("[BOARD REGIST] raw response =", response);

    const payload = extractData(response, {});
    return buildResult("success", payload, null, requestUrl, response, startedAt);

  } catch (error) {
    console.error("[BOARD REGIST] 요청 실패:", {
      url: requestUrl,
      message: error?.message,
      stack: error?.stack,
    });
    return buildResult("error", {}, error?.message ?? "Request failed", requestUrl, null, startedAt);
  }
};