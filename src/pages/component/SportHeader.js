import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/icon/homeLogo.gif';
import '../../styles/component.css';

export default function SportHeader({ selectedLeague }){
    const [openSport, setOpenSport] = useState(null);
    const menuRef = useRef(null);

    const sports = {
        '축구': {
            basePath: '/soccer',
            leagues: [
                { name: '전체보기', path: '/soccer' },
                { name: 'EPL', path: '/soccer/epl' },
                { name: '라리가', path: '/soccer/laliga' }
            ]
        },
        '야구': {
            basePath: '/baseball',
            leagues: [
                { name: '전체보기', path: '/baseball' },
                { name: 'KBO', path: '/baseball/kbo' }
            ]
        },
        'MMA': {
            basePath: '/mma',
            leagues: [
                { name: '전체보기', path: '/mma' },
                { name: 'UFC', path: '/mma/ufc' }
            ]
        }
    };

    // 현재 선택된 리그에 따라 어떤 스포츠 메뉴가 활성화되어야 하는지 결정
    const getActiveSport = () => {
        const path = window.location.pathname;
        if (path.startsWith('/soccer')) return '축구';
        if (path.startsWith('/baseball')) return '야구';
        if (path.startsWith('/mma')) return 'MMA';
        return null;
    };
    const activeSport = getActiveSport();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenSport(null); // 메뉴 바깥 클릭 시 닫기
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleSportClick = (sportName) => {
        setOpenSport(prevOpenSport => prevOpenSport === sportName ? null : sportName);
    };

    const handleLeagueSelect = () => {
        setOpenSport(null); // 리그 선택 후 메뉴 닫기
    };

    return(
        <div className="sportHeader">
            <div className="sportHeaderLeft">
                <Link to="/">
                    <img src={logo} alt="logo" style={{cursor: 'pointer'}}/>
                </Link>
            </div>
            <div className="sportHeaderCenter" ref={menuRef}>
                {Object.entries(sports).map(([sportName, sportData]) => (
                    <div key={sportName} className="sport-menu-item">
                        <Link to={sportData.basePath} className={`sport-button ${activeSport === sportName ? 'active' : ''}`} onClick={() => handleSportClick(sportName)}>
                            {sportName}
                        </Link>
                        {openSport === sportName && (
                            <div className="league-menu">
                                {sportData.leagues.map((league) => (
                                    <Link to={league.path} key={league.name} className={`league-button ${window.location.pathname === league.path ? 'active' : ''}`} onClick={handleLeagueSelect}>
                                        {league.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="sportHeaderRight">
                {/* 추후 검색, 유저 아이콘 등 추가될 공간 */}
            </div>
        </div>
    )
}