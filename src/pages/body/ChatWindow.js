import React, { useState, useEffect, useRef } from 'react';

export default function ChatWindow({ match, onMinimize, onClose }) {
    const [messages, setMessages] = useState([
        { user: '유저1', text: '오늘 경기 재밌네요!' },
        { user: '유저2', text: '인정합니다!' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        setMessages([...messages, { user: '나', text: newMessage }]);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-window">
            <header className="chat-header">
                <h2>{match.home} vs {match.away}</h2>
                <div className="chat-controls">
                    <button onClick={() => onMinimize(match)} className="minimize-chat-btn">-</button>
                    <button onClick={() => onClose(match.id)} className="close-chat-btn">X</button>
                </div>
            </header>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <p key={i}><strong>{msg.user}:</strong> {msg.text}</p>
                ))}
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
};
