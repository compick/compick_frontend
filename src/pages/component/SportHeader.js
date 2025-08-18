import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../img/icon/homeLogo.gif';
import '../../styles/component.css';

export default function SportHeader({ selectedLeague, handleLeagueChange }){
    const navigate = useNavigate();

    const sports = {
        '축구': {
            leagues: [
                { name: '전체보기', key: 'soccer' },
                { name: 'EPL', key: 'epl' },
                { name: '라리가', key: 'laliga' }
            ]
        },
        '야구': {
            leagues: [
                { name: '전체보기', key: 'kbo' },
                { name: 'KBO', key: 'kbo' }
            ]
        },
        'MMA': {
            leagues: [
                { name: '전체보기', key: 'ufc' },
                { name: 'UFC', key: 'ufc' }
            ]
        }
    };

    // 현재 선택된 리그에 따라 어떤 스포츠 메뉴가 활성화되어야 하는지 결정
    const getActiveSport = () => {
        if (['epl', 'laliga', 'soccer'].includes(selectedLeague)) return '축구';
        if (['kbo', 'baseball'].includes(selectedLeague)) return '야구';
        if (['ufc', 'mma'].includes(selectedLeague)) return 'MMA';
        return null;
    };

    const activeSport = getActiveSport();

    return(
        <div className="sportHeader">
            <div className="sportHeaderLeft">
                <Link to="/">
                    <img src={logo} alt="logo" style={{cursor: 'pointer'}}/>
                </Link>
            </div>
            <div className="sportHeaderCenter">
                {Object.entries(sports).map(([sportName, sportData]) => (
                    <div key={sportName} className="sport-menu-item">
                        <button 
                            onClick={() => handleLeagueChange(sportData.leagues[0].key)}
                            className={activeSport === sportName ? 'active' : ''}
                        >
                            {sportName}
                        </button>
                        {activeSport === sportName && (
                            <div className="league-menu">
                                {sportData.leagues.map((league) => (
                                    <button 
                                        key={league.name} 
                                        onClick={() => handleLeagueChange(league.key)}
                                        className={selectedLeague === league.key ? 'active' : ''}
                                    >
                                        {league.name}
                                    </button>
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