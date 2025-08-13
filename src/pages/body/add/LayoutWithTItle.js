// LayoutWithTitle.jsx
import { useLocation, useNavigate } from "react-router-dom";

const TITLE_MAP = {
  "/add": "이미지 업로드",
  "/editImage": "이미지 편집",
  "/writePost": "게시글 작성",
};

export default function LayoutWithTitle({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = TITLE_MAP[pathname] ?? "페이지";

  return (
    <div className="uploadContainer">
      <div className="container addpage">
        <button className="closeBtn" onClick={() => navigate("/home")}>❌</button>
        <div className="pageTitle">{title}</div>
      </div>
      {children}
    </div>
  );
}
