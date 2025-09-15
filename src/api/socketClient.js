import { getCookie, deleteCookie } from "../utils/Cookie";
import { refreshAccessToken } from "./apiClient";

let ws = null;
let shouldReconnect = false;
let lastMatchId = null;
let lastOnMessage = null;
let messageQueue = [];

setInterval(() => {
  if (shouldReconnect && (!ws || ws.readyState === WebSocket.CLOSED)) {
    console.log("♻️ 재연결 시도:", getCookie("jwt"));
    connectSocket(lastMatchId, lastOnMessage);
    shouldReconnect = false;
  }
}, 1000);

export function connectSocket(matchId, onMessage) {
  lastMatchId = matchId;
  lastOnMessage = onMessage;

  if (ws) {
    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;
    try { ws.close(); } catch (e) {}
    ws = null;
  }

  const token = getCookie("jwt");
  const baseUrl = `${window.location.origin.replace(/^http/, "ws")}/ws/chat`;
  const url = token
    ? `${baseUrl}?matchId=${matchId}&token=${token}`
    : `${baseUrl}?matchId=${matchId}`;

  console.log("🔗 WebSocket 연결 시도 URL:", url);

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("✅ WebSocket 연결됨");
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift();
      ws.send(JSON.stringify(msg));
    }
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      onMessage?.(msg);
    } catch (err) {
      console.error("메시지 파싱 실패:", err);
    }
  };

  ws.onclose = async (event) => {
    console.log("🔒 onclose → code:", event.code, "reason:", event.reason);
    if (event.reason === "ACCESS_TOKEN_EXPIRED") {
      try {
        await refreshAccessToken();
        console.log("🔄 토큰 재발급 성공 → 재연결 예정");
        console.log("🔑 새 토큰 확인:", getCookie("jwt"));
        shouldReconnect = true;
      } catch (err) {
        alert("세션 만료. 다시 로그인해주세요.");
        deleteCookie("jwt");
        window.location.href = "/login";
      }
      return;
    }
  };

  ws.onerror = (err) => console.error("❌ WebSocket 에러:", err);

  return ws;
}

export function sendMessage(msgObj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msgObj));
  } else {
    messageQueue.push(msgObj);
    console.log("📥 메시지 큐에 저장:", msgObj);
  }
}
