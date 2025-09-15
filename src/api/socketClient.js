import { getCookie, deleteCookie } from "../utils/Cookie";
import { refreshAccessToken } from "./apiClient";

let ws = null;
let shouldReconnect = false;
let lastMatchId = null;
let lastOnMessage = null;
let messageQueue = [];

// 주기적으로 재연결 루프
setInterval(() => {
  if (shouldReconnect && (!ws || ws.readyState === WebSocket.CLOSED)) {
    console.log("♻️ 재연결 시도");
    connectSocket(lastMatchId, lastOnMessage);
    shouldReconnect = false;
  }
}, 1000);

export function connectSocket(matchId, onMessage) {
  // 매개변수 기억
  lastMatchId = matchId;
  lastOnMessage = onMessage;

  // 기존 소켓 정리
  if (ws) {
    try { ws.close(); } catch (e) {}
    ws = null;
  }

  const token = getCookie("jwt");
  const envBase = process.env.REACT_APP_WS_BASE || null;
  const baseUrl = envBase
    ? envBase
    : `${window.location.origin.replace(/^http/, "ws")}/ws/chat`;

  const url = token
    ? `${baseUrl}?matchId=${matchId}&token=${token}`
    : `${baseUrl}?matchId=${matchId}`;

  console.log("🔗 WebSocket 연결 시도 URL:", url);

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("✅ WebSocket 연결됨");
    // 큐 flush
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift();
      ws.send(JSON.stringify(msg));
      console.log("📤 큐에서 전송:", msg);
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
    console.log("🔒 onclose →", "code:", event.code, "reason:", event.reason);

    if (event.code === 1000) {
      console.log("ℹ️ 정상 종료 (언마운트/탭 전환)");
      return;
    }

    if (event.reason === "ACCESS_TOKEN_EXPIRED") {
      try {
        await refreshAccessToken();
        console.log("🔄 토큰 재발급 성공 → 재연결 예정");
        shouldReconnect = true;   // 👈 여기서 플래그만 세움
      } catch (err) {
        alert("세션 만료. 다시 로그인해주세요.");
        deleteCookie("jwt");
        window.location.href = "/login";
      }
      return;
    }

    console.log("❌ 알 수 없는 종료:", { code: event.code, reason: event.reason });
    deleteCookie("jwt");
    window.location.href = "/login";
  };

  ws.onerror = (err) => console.error("❌ WebSocket 에러:", err);

  return ws;
}

export function sendMessage(msgObj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msgObj));
    console.log("📤 즉시 전송:", msgObj);
  } else {
    messageQueue.push(msgObj);
    console.log("📥 메시지 큐에 저장:", msgObj);
  }
}
