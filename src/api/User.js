import { apiJson } from "./apiClient";

// 비밀번호 확인 요청 API
export async function checkPassword( password) {
  try {
    const res = await apiJson(`/api/user/check-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    console.log("[checkPassword] password =", password);
    console.log("[checkPassword] res =", res);
    return res; // { success: true/false }
  } catch (err) {
    console.error("[checkPassword] 요청 실패:", err);
    return { success: false };
  }
}
export async function updateUser(payload) {
    try {
      const res = await apiJson("/api/user/update", {
        method: "PUT",      
        body: JSON.stringify(payload),
      });
      if(res.success === false) {
        throw new Error("사용자 정보 업데이트 실패");
      }
      return res;
    } catch (err) {
      console.error("[updateUser] error:", err);
      throw err;
    }
  }
  

