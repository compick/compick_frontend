// src/routes/ProtectedRoute.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../../utils/Cookie.js";
import LoginModal from "../../components/LoginModal";

export default function ProtectedRoute({ children }) {
  const token = getCookie("jwt");
  const [showModal, setShowModal] = useState(!token);

  // 토큰이 있으면 페이지 그대로 보여줌
  if (token) {
    return children;
  }

  // 토큰이 없으면 모달을 띄움
  return (
    <>
      {showModal && (
        <LoginModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            window.location.href = "/login"; // 로그인 페이지로 이동
          }}
        />
      )}
      {/* 모달 닫아도 접근 막고 홈으로 돌려보냄 */}
      {!showModal && <Navigate to="/" replace />}
    </>
  );
}
