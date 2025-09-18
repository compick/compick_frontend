import React, { useState } from 'react';
import ChatWindow from '../pages/body/chat/ChatWindow';
import './GlobalChatSidebar.css';

export default function GlobalChatSidebar({ 
    chatState, 
    onOpenChat, 
    onCloseChat, 
    onMinimizeChat, 
    onSetActiveChat,
    isVisible,
    onToggleVisibility 
}) {
    const { openChats, minimizedChats, activeChatId } = chatState;
    const activeChat = openChats.find(c => c.id === activeChatId);

    // 사이드바가 보이지 않거나 채팅이 없으면 토글 버튼만 표시
    if (!isVisible) {
        return (
            <div className="chat-sidebar-toggle">
                {/* <button 
                    className="toggle-chat-btn"
                    onClick={onToggleVisibility}
                    title="채팅 열기"
                >
                    💬
                </button> */}
                {/* 최소화된 채팅 개수 표시 */}
                {(openChats.length > 0 || minimizedChats.length > 0) && (
                    <span className="chat-count-badge">
                        {openChats.length + minimizedChats.length}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="global-chat-sidebar">
            {/* 사이드바 헤더 */}
            <div className="sidebar-header">
                <h3>채팅</h3>
                <button 
                    className="close-sidebar-btn"
                    onClick={onToggleVisibility}
                    title="사이드바 닫기"
                >
                    ✕
                </button>
            </div>

            {/* 채팅방이 없을 때 */}
            {openChats.length === 0 && minimizedChats.length === 0 && (
                <div className="no-chats">
                    <p>진행 중인 채팅이 없습니다.</p>
                    <p>경기를 선택해서 채팅을 시작해보세요!</p>
                </div>
            )}

            {/* 열린 채팅방 리스트 */}
            {openChats.length > 0 && (
                <div className="chat-list-sidebar">
                    <div className="chat-list-header">
                        <h4>열린 채팅방 ({openChats.length})</h4>
                        <span className="chat-list-subtitle">클릭하여 채팅방 전환</span>
                    </div>
                    <div className="chat-list-items">
                        {openChats.map(chat => (
                            <div 
                                key={chat.id} 
                                className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
                            >
                                <button 
                                    className="chat-item-button"
                                    onClick={() => onSetActiveChat(chat.id)}
                                >
                                    <div className="match-info">
                                        <span className="match-teams">
                                            {chat.home} vs {chat.away}
                                        </span>
                                        <span className="match-time">
                                            {chat.matchTime || '경기 진행중'}
                                        </span>
                                    </div>
                                    {chat.id === activeChatId && (
                                        <span className="active-indicator">●</span>
                                    )}
                                </button>
                                <div className="chat-item-actions">
                                    <button 
                                        className="minimize-btn"
                                        onClick={() => onMinimizeChat(chat)}
                                        title="최소화"
                                    >
                                        −
                                    </button>
                                    <button 
                                        className="close-btn"
                                        onClick={() => onCloseChat(chat.id)}
                                        title="닫기"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 활성 채팅창 */}
            {activeChat && (
                <div className="active-chat-container">
                    <ChatWindow 
                        key={activeChat.id} 
                        match={activeChat} 
                        onClose={onCloseChat}
                        onMinimize={onMinimizeChat}
                    />
                </div>
            )}

            {/* 최소화된 채팅방 목록 */}
            {minimizedChats.length > 0 && (
                <div className="minimized-chats-sidebar">
                    <div className="minimized-chats-header">
                        <h4>최소화된 채팅방 ({minimizedChats.length})</h4>
                        <span className="minimized-chats-subtitle">클릭하여 복원</span>
                    </div>
                    <div className="minimized-chats-items">
                        {minimizedChats.map(chat => (
                            <div key={chat.id} className="minimized-chat-item">
                                <button 
                                    className="minimized-item-button"
                                    onClick={() => onOpenChat(chat)}
                                >
                                    <div className="match-info">
                                        <span className="match-teams">
                                            {chat.home} vs {chat.away}
                                        </span>
                                        <span className="match-time">
                                            {chat.matchTime || '최소화됨'}
                                        </span>
                                    </div>
                                    <span className="restore-icon">↗</span>
                                </button>
                                <button 
                                    className="close-minimized-btn"
                                    onClick={() => onCloseChat(chat.id)}
                                    title="닫기"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
