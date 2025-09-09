import React from "react";

export default function LoginModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-content">
          <h3>로그인이 필요합니다</h3>
          <p>오픈톡 기능을 사용하려면 로그인이 필요합니다.</p>
          <p>로그인하시겠습니까?</p>
          <div className="login-modal-buttons">
            <button className="login-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button className="login-modal-confirm" onClick={onConfirm}>
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
