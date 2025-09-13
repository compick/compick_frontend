// socketClient.js
import { getCookie, setCookie, deleteCookie } from "../utils/Cookie";
import { refreshAccessToken } from "./apiClient";  // 기존 로직 재활용

let ws = null;

export function connectSocket(matchId, onMessage) {
    // 🔑 기존 소켓 정리
    if (ws) {
        try { ws.close(); } catch (e) { }
        ws = null;
    }

    let token = getCookie("jwt"); // JWT 쿠키에서 가져오기 (없을 수 있음)

    const envBase = process.env.REACT_APP_WS_BASE || null;

    const baseUrl = envBase
        ? envBase
        : `${window.location.origin.replace(/^http/, "ws")}/ws/chat`;

    // ✅ 토큰이 있으면 subprotocol에 넣고, 없으면 아예 빼기
    const url = token
        ? `${baseUrl}?matchId=${matchId}&token=${token}`
        : `${baseUrl}?matchId=${matchId}`;

    console.log("🔗 WebSocket 연결 시도 URL:", url);

    ws = new WebSocket(url);

    ws.onopen = () => {
        console.log("✅ WebSocket 연결됨");
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
        if (ws !== event.target) {
            // 이미 새 소켓으로 교체된 상태라면 무시
            return;
        }
        console.warn("🔒 닫힘:", event.code, event.reason);

        if (event.reason === "ACCESS_TOKEN_EXPIRED") {
            try {
                // 🔄 리프레시 후 재연결
                await refreshAccessToken();
                console.log("🔄 토큰 재발급 성공, 소켓 재연결");
                connectSocket(matchId, onMessage);
            } catch (err) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                deleteCookie("jwt");
                window.location.href = "/login";
            }
        } else {
            // ❌ 다른 오류 타입 → alert + 쿠키 삭제 후 로그인 이동
            alert("토큰 오류: " + (event.reason || "UNKNOWN"));
            deleteCookie("jwt");
            window.location.href = "/login";
        }
    };

    ws.onerror = (err) => console.error("❌ WebSocket 에러:", err);

    return ws; // ✅ 이제 실제 ws 객체 반환
}



export function sendMessage(msgObj) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msgObj));
    } else {
        console.error("⚠️ WebSocket이 열려있지 않음");
    }
}

