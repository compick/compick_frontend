// src/components/ui.js
export const page = "min-h-screen grid place-items-center";
export const card = { maxWidth: "30vw", width: "93vw", background: "var(--card-bg)", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,.06)", padding: 24, margin: "20px auto" };
export const btn = {
  display: "block", width: "90%", padding: "12px 14px", margin: "10px 0",
  borderRadius: 10, border: "1px solid #e5e7eb", background: "var(--card-bg)",
  fontWeight: 600, textAlign: "center", textDecoration: "none", color: "#111", cursor: "pointer"
};
export const kakaoStyle = { ...btn, background: "#FEE500", borderColor: "#F7D500" };
export const plain = btn;
