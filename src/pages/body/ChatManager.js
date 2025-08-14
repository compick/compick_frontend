import React from 'react';
import ChatWindow from './ChatWindow';

export default function ChatManager({ chatState, onOpenChat, onCloseChat, onMinimizeChat, onSetActiveChat }) {
    const { openChats, minimizedChats, activeChatId } = chatState;
    const activeChat = openChats.find(c => c.id === activeChatId);

    if (openChats.length === 0 && minimizedChats.length === 0) {
        return null; // 아무것도 없으면 렌더링 안함
    }

    return (
        <div className="chat-manager">
            {/* 열린 채팅 창 (현재 활성화된 창만 표시) */}
            {activeChat && (
                <ChatWindow 
                    key={activeChat.id} 
                    match={activeChat} 
                    onClose={onCloseChat}
                    onMinimize={onMinimizeChat}
                />
            )}

            {/* 열린 채팅방 탭 목록 (활성화된 창 위에 표시) */}
            <div className="chat-tabs">
                {openChats.map(chat => (
                    <button 
                        key={chat.id} 
                        className={`chat-tab ${chat.id === activeChatId ? 'active' : ''}`}
                        onClick={() => onSetActiveChat(chat.id)}
                    >
                        {`${chat.home.charAt(0)} vs ${chat.away.charAt(0)}`}
                    </button>
                ))}
            </div>

            {/* 최소화된 채팅방 목록 (화면 하단 바) */}
            <div className="minimized-chats-bar">
                {minimizedChats.map(chat => (
                    <button key={chat.id} onClick={() => onOpenChat(chat)}>
                        {chat.home} vs {chat.away}
                    </button>
                ))}
            </div>
        </div>
    );
}
