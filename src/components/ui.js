// src/components/ui.js
export const page = "min-h-screen grid place-items-center";
export const card = { maxWidth: 420, width: "92vw", background: "#fff", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,.06)", padding: 24 };
export const btn = {
  display: "block", width: "100%", padding: "12px 14px", margin: "10px 0",
  borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff",
  fontWeight: 600, textAlign: "center", textDecoration: "none", color: "#111", cursor: "pointer"
};
export const kakaoStyle = { ...btn, background: "#FEE500", borderColor: "#F7D500" };
export const plain = btn;
