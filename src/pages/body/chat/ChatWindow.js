import React, { useState, useEffect, useRef } from 'react';
import { apiJson } from '../../../api/apiClient';
import './ChatWindow.css';

export default function ChatWindow({ match, onMinimize, onClose }) {
  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

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

        // 서버 응답 구조 { success: true, data: { user, messages } }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // 서버 저장 로직 추가 가능
    setMessages([
      ...messages,
      {
        messageId: Date.now(),
        content: newMessage,
        userIdx: me.userIdx,
        nickname: me.userNickname,
        createdAt: new Date().toISOString(),
      },
    ]);
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
          <button onClick={() => onMinimize(match)} className="minimize-chat-btn">
            -
          </button>
          <button onClick={() => onClose(match.id)} className="close-chat-btn">
            X
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => {
          const isMine = me && msg.userIdx === me.userIdx;
          return (
            <div
              key={msg.messageId}
              className={`chat-message ${isMine ? 'mine' : 'other'}`}
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
