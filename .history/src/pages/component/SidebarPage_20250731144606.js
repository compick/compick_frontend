import { useState } from "react";

const icons = [
{ name: "home", svg: <path d="M4 10L12 3l8 7v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10z" /> },
{ name: "search", svg: <circle cx="11" cy="11" r="7" />, extra: <line x1="16.5" y1="16.5" x2="20" y2="20" /> },
{ name: "add", svg: <line x1="12" y1="5" x2="12" y2="19" />, extra: <line x1="5" y1="12" x2="19" y2="12" /> },
{ name: "heart", svg: <path d="M12 21s-6-4.35-6-8a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 3.65-6 8-6 8z" /> },
{ name: "user", svg: <circle cx="12" cy="8" r="4" />, extra: <path d="M6 20c0-2 4-4 6-4s6 2 6 4" /> },
{ name: "pin", svg: <path d="M12 2C8 2 6 6 6 8s6 12 6 12 6-10 6-12-2-6-6-6z" /> },
{ name: "menu", svg: <line x1="4" y1="6" x2="20" y2="6" />, extra: <>
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
</> },
];
export default function SidebarPage(){

    const [active, setActive] = useState("home");
    return(
        <div className="sidebarContainer">
                {icons.map((icon) => (
            <div
            key={icon.name}
            className={`icon-wrapper ${active === icon.name ? "active" : ""}`}
            onClick={() => setActive(icon.name)}
            >
            <svg
                viewBox="0 0 24 24"
                className="icon"
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