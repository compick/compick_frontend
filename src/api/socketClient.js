import { getCookie } from "../utils/Cookie";

let ws = null;
let messageQueue = [];

export function connectSocket(matchId, onMessage) {
  // 기존 소켓 정리
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
    // 큐 flush
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

  ws.onclose = (event) => {
    console.log("🔒 onclose → code:", event.code, "reason:", event.reason);
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
