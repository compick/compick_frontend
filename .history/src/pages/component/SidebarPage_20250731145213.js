import { useState } from "react";
const icons = [
  {
    name: "home",
    svg: <path d="M3 12L12 3l9 9v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" />,
  },
  {
    name: "search",
    svg: <circle cx="11" cy="11" r="6" />,
    extra: <line x1="16" y1="16" x2="21" y2="21" />,
  },
  {
    name: "add",
    svg: <line x1="12" y1="5" x2="12" y2="19" />,
    extra: <line x1="5" y1="12" x2="19" y2="12" />,
  },
  {
    name: "heart",
    svg: <path d="M12 21c-1.2-1.1-5-4.2-6.5-7C3.5 10 5.5 6 9 6c1.8 0 3 1 3 2.5C12 7 13.2 6 15 6c3.5 0 5.5 4 3.5 8-1.5 2.8-5.3 5.9-6.5 7z" />,
  },
  {
    name: "user",
    svg: <circle cx="12" cy="8" r="4" />,
    extra: <path d="M6 20c0-2.5 3.5-4 6-4s6 1.5 6 4" />,
  },
  {
    name: "trophy",
    svg: <path d="M8 4h8v2h3v2c0 2.2-1.5 4-3.5 4h-0.5c-.6 1.7-2.1 3-4 3s-3.4-1.3-4-3H8.5C6.5 12 5 10.2 5 8V6h3V4zM10 18h4v2h-4z" />,
  },
  {
    name: "menu",
    svg: <line x1="4" y1="6" x2="20" y2="6" />,
    extra: (
      <>
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </>
    ),
  },
];
export default function SidebarPage(){

    const [active, setActive] = useState("home");
    return(
        <div className="sidebarContainer">
                {icons.map((icon) => (
            <div
            key={icon.name}
            className={`tabMenu ${active === icon.name ? "active" : ""}`}
            onClick={() => setActive(icon.name)}
            >
            <svg
                viewBox="0 0 24 24"
                className="tabItem"
                xmlns="http://www.w3.org/2000/svg"
            >
                {icon.svg}
                {icon.extra}
            </svg>
            </div>
        ))}
        </div>
    );
}