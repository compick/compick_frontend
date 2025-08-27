// src/AuthBootstrap.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AuthBootstrap() {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash; // "#token=..."

    const tokenFromHash  = new URLSearchParams(hash.replace(/^#/, "")).get("token");
    const token = tokenFromHash;

    if (!token) return;
    document.cookie = `jwt=${encodeURIComponent(token)}; Path=/; Max-Age=3600; SameSite=Lax`;

  }, []);

  return null;
}
