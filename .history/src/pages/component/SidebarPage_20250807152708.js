import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const topIcons = [
  { name: "home", svg: <path d="M4 10v10h5v-6h6v6h5V10L12 3z" /> },
  {
    name: "search",
    svg: <circle cx="11" cy="11" r="6" />,
    extra: <line x1="15.5" y1="15.5" x2="20" y2="20" />,
  },
  {
    name: "add",
    svg: (
      <>
        <line x1="12" y1="6" x2="12" y2="18" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </>
    ),
  },
  {
    name: "heart",
    svg: <path d="M12 21s-6-4.35-6-8a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 3.65-6 8-6 8z" />,
  },
  {
    name: "menu",
    svg: (
      <>
        <line x1="6" y1="7" x2="18" y2="7" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <line x1="6" y1="17" x2="18" y2="17" />
      </>
    ),
  },
];

const bottomIcons = [
  {
    name: "user",
    svg: <circle cx="12" cy="8" r="4" />,
    extra: <path d="M6 20c0-2 4-4 6-4s6 2 6 4" />,
  },
  {
    name: "trophy",
    svg: (
      <>
        <path d="M8 4h8v2h2v2c0 2.2-1.5 4-3.5 4H9.5C7.5 12 6 10.2 6 8V6h2V4z" />
        <path d="M10 18h4v2h-4z" />
      </>
    ),
  },
];

export default function IconSidebar() {
  const [activeIcon, setActiveIcon] = useState("home");
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const handleTopIconClick = (iconName, event) => {
    setActiveIcon(iconName);

    if (iconName === "menu") {
      const rect = menuRef.current.getBoundingClientRect();
      setPopupStyle({
        top: rect.bottom + 8,
        left: rect.right - 160, // 팝업 너비 고려
      });
      setShowPopup((prev) => !prev);
    } else {
      setShowPopup(false);
    }
  };

  return (
    <>
      <div className="sidebarContainer">
        <div className="sidebar">
          <div className="top-section">
            {topIcons.map((icon) => {
              const isMenu = icon.name === "menu";
              const iconElement = (
                <div
                  className={`tabIcon ${activeIcon === icon.name ? "active" : ""}`}
                  onClick={(e) => handleTopIconClick(icon.name, e)}
                  ref={isMenu ? menuRef : null}
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
              );

              // menu는 링크 이동 없이 동작, 나머지는 링크 적용
              return isMenu ? (
                <React.Fragment key={icon.name}>{iconElement}</React.Fragment>
              ) : (
                <Link to={`/${icon.name}`} key={icon.name} style={{ textDecoration: "none" }}>
                  {iconElement}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 메뉴 팝업 */}
        {showPopup && (
          <div
            className="popupBox"
            style={{
              position: "fixed",
              top: `${popupStyle.top}px`,
              left: `${popupStyle.left}px`,
              zIndex: 1000,
            }}
          >
            <div className="popupContent">
              {bottomIcons.map((icon) => (
                <Link
                  to={`/${icon.name}`}
                  key={icon.name}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="popupIcon"
                    onClick={() => setActiveIcon(icon.name)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="tabItem"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {icon.svg}
                      {icon.extra}
                    </svg>
                    <span>{icon.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
