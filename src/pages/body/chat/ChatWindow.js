import React, { useState, useEffect, useRef } from 'react';
import { apiJson } from '../../../api/apiClient';
import { getCookie } from '../../../utils/Cookie';
import './ChatWindow.css';
import { connectSocket, sendMessage } from '../../../api/socketClient';
import { v4 as uuidv4 } from 'uuid'; // 상단에 추가


export default function ChatWindow({ match, onMinimize, onClose }) {
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // --- 초기 채팅 불러오기 (REST) ---
  useEffect(() => {
    if (!match?.id) return;
    let alive = true;

    (async () => {
      try {
        const data = await apiJson(
          `/api/chat/view?matchId=${encodeURIComponent(match.id)}`,
          { method: 'GET' }
        );

        if (!alive) return;

        const user = data?.data?.user ?? data?.user;
        const chatMessages = data?.data?.messages ?? [];

        setMe(user);
        setMessages(chatMessages);
      } catch (err) {
        console.error('채팅 불러오기 실패:', err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [match?.id]);

  // --- WebSocket 연결 ---
  useEffect(() => {
    if (!match?.id) return;

    const ws = connectSocket(match.id, (msg) => {
      if (msg.matchId === match.id) {
        setMessages((prev) => {
          // ✅ 중복 방지
          if (prev.some(m => m.messageId && m.messageId === msg.messageId)) {
            return prev;
          }
          return [...prev, msg];
        });
      }
    });

    wsRef.current = ws;

    return () => {
      ws.close(); // ✅ 반드시 닫기
    };
  }, [match?.id]);


  // --- 스크롤 맨 아래로 ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 메시지 전송 ---
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket이 열려있지 않음");
      return;
    }

    console.log("매치: " + match.id);
    console.log("content: " + newMessage);

    // 1️⃣ DB 저장 (REST API)
    try {
      await apiJson(`/api/chat/regist?matchId=${match.id}&content=${encodeURIComponent(newMessage)}`, {
        method: "POST" // POST여도 body는 필요 없음
      });
    } catch (err) {
      console.error("DB 저장 실패:", err);
    }

    // 2️⃣ WebSocket 브로드캐스트
    const msgObj = {
      tempId: uuidv4(),    // ✅ 임시 ID 추가
      matchId: match.id,
      content: newMessage,
      userIdx: me?.userIdx,
      nickname: me?.userNickname,
      createdAt: new Date().toISOString(),
    };

    wsRef.current.send(JSON.stringify(msgObj));
    setNewMessage('');
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <h2>
          {match.home} vs {match.away}
        </h2>
        <div className="chat-controls">
          <button onClick={() => onMinimize(match)} className="minimize-chat-btn">-</button>
          <button onClick={() => onClose(match.id)} className="close-chat-btn">X</button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => {
          const isMine = me && msg.userIdx === me.userIdx;
          return (
            <div
              key={msg.messageId || msg.tempId}
              className={`chat-message ${isMine ? "mine" : "other"}`}
            >
              {!isMine && <div className="nickname">{msg.nickname}</div>}
              <div className="bubble">{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="메시지 입력..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}
