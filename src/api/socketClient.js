import { getCookie } from "../utils/Cookie";

let ws = null;
let messageQueue = [];
let retryCount = 0;
const MAX_RETRY = 3;       // 최대 재연결 시도 횟수
const RETRY_DELAY = 1000;  // 재연결 딜레이(ms)

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
    retryCount = 0; // 연결 성공 시 retryCount 초기화

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

    if (event.code === 1006 && retryCount < MAX_RETRY) {
      retryCount++;
      console.warn(`⚠️ 비정상 종료(1006) → ${retryCount}번째 재연결 시도 예정...`);
      setTimeout(() => connectSocket(matchId, onMessage), RETRY_DELAY);
    } else if (retryCount >= MAX_RETRY) {
      console.error("🚨 WebSocket 재연결 실패, 페이지 새로고침 필요");
      // 필요 시: window.location.reload();
    }
  };

  ws.onerror = (err) => {
    console.error("❌ WebSocket 에러:", err);
  };

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
