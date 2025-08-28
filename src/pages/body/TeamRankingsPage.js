import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEplRankings, getLaligaRankings } from '../../api/match/soccer';
import { getKboRankings } from '../../api/match/baseball';
import { getUfcRankings } from '../../api/match/mma';
import GetTeamLogo from '../../utils/GetTeamLogo';
import GetLeagueLogo from '../../utils/GetLeagueLogo';

// 스포츠별 리그 매핑
const sportLeagues = {
    soccer: [
        { id: 'epl', name: '프리미어리그', logo: null },
        { id: 'laliga', name: '라리가', logo: null },
        { id: 'champions', name: '챔피언스리그', logo: null }
    ],
    baseball: [
        { id: 'kbo', name: 'KBO 리그', logo: null }
    ],
    mma: [
        { id: 'ufc', name: 'UFC', logo: null }
    ]
};

// 최근 5경기 결과를 아이콘으로 변환하는 헬퍼 함수
const renderForm = (form) => {
    return (form || '-----').split('').map((result, index) => {
        let className = '';
        if (result === 'W') className = 'form-win';
        else if (result === 'D') className = 'form-draw';
        else if (result === 'L') className = 'form-loss';
        return <span key={index} className={`form-icon ${className}`}>{result}</span>;
    });
};

export default function TeamRankingsPage() {
    const { sport = 'soccer' } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // URL 쿼리 파라미터에서 league 정보 가져오기
    const urlParams = new URLSearchParams(location.search);
    const leagueFromUrl = urlParams.get('league');
    
    // URL에서 전달된 리그가 유효한지 확인
    const isValidLeague = leagueFromUrl && sportLeagues[sport]?.some(league => league.id === leagueFromUrl);
    const initialLeague = isValidLeague ? leagueFromUrl : sportLeagues[sport]?.[0]?.id || 'epl';
    const [selectedLeague, setSelectedLeague] = useState(initialLeague);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 리그 로고 설정
    useEffect(() => {
        sportLeagues['soccer']?.forEach(league => {
            league.logo = GetLeagueLogo(league.name);
        });
        sportLeagues['baseball']?.forEach(league => {
            league.logo = GetLeagueLogo(league.name);
        });
        sportLeagues['mma']?.forEach(league => {
            league.logo = GetLeagueLogo(league.name);
        });
    }, []);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let data;
                if (sport === 'soccer') {
                    if (selectedLeague === 'epl') {
                        data = await getEplRankings();
                    } else if (selectedLeague === 'laliga') {
                        data = await getLaligaRankings();
                    }
                } else if (sport === 'baseball') {
                    if (selectedLeague === 'kbo') {
                        data = await getKboRankings();
                    }
                } else if (sport === 'mma') {
                    if (selectedLeague === 'ufc') {
                        data = await getUfcRankings();
                    }
                }
                
                // 승점(Points)과 득실차(DIFF) 기준으로 정렬
                const sortedData = data.sort((a, b) => {
                    if (b.points !== a.points) {
                        return b.points - a.points;
                    }
                    return b.diff - a.diff;
                });

                setRankings(sortedData);
            } catch (error) {
                console.error('Error fetching rankings:', error);
                setError('팀 순위 정보를 불러올 수 없습니다.');
                setRankings([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedLeague) {
            fetchRankings();
        }
    }, [selectedLeague, sport]);

    const handleSportChange = (newSport) => {
        // 스포츠 변경 시 기본 리그로 이동
        navigate(`/team-rankings/${newSport}`);
        setSelectedLeague(sportLeagues[newSport]?.[0]?.id || 'epl');
    };

    const handleLeagueChange = (leagueId) => {
        setSelectedLeague(leagueId);
        // URL 쿼리 파라미터 업데이트
        navigate(`/team-rankings/${sport}?league=${leagueId}`, { replace: true });
    };

    const currentLeagues = sportLeagues[sport] || [];

    return (
        <div className="teamRankingsPage">
            <header className="rankingsHeader">
                <h1>🏆 구단 순위</h1>
                <button 
                    className="backButton"
                    onClick={() => navigate(-1)}
                >
                    ← 뒤로가기
                </button>
            </header>

            {/* 스포츠 메뉴 */}
            <nav className="sportMenu">
                <button 
                    className={`sportButton ${sport === 'soccer' ? 'active' : ''}`}
                    onClick={() => handleSportChange('soccer')}
                >
                    ⚽ 축구
                </button>
                <button 
                    className={`sportButton ${sport === 'baseball' ? 'active' : ''}`}
                    onClick={() => handleSportChange('baseball')}
                >
                    ⚾ 야구
                </button>
                <button 
                    className={`sportButton ${sport === 'mma' ? 'active' : ''}`}
                    onClick={() => handleSportChange('mma')}
                >
                    🥊 MMA
                </button>
            </nav>

            {/* 리그 메뉴 */}
            <nav className="leagueMenu">
                {currentLeagues.map(league => (
                    <button
                        key={league.id}
                        className={`leagueButton ${selectedLeague === league.id ? 'active' : ''}`}
                        onClick={() => handleLeagueChange(league.id)}
                    >
                        {league.logo && (
                            <img src={league.logo} alt={league.name} className="leagueLogo" />
                        )}
                        {league.name}
                    </button>
                ))}
            </nav>

            {/* 랭킹 테이블 */}
            <div className="rankingsContent">
                {loading ? (
                    <div className="loadingMessage">순위 정보를 불러오는 중...</div>
                ) : error ? (
                    <div className="errorMessage">
                        <p>{error}</p>
                        <p>백엔드 서버 설정이 완료되면 다시 시도해주세요.</p>
                    </div>
                ) : rankings.length === 0 ? (
                    <div className="emptyMessage">표시할 순위 정보가 없습니다.</div>
                ) : (
                    <div className="rankingsTableContainer">
                        <table className="rankingsTable">
                            <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>팀</th>
                                    <th>경기</th>
                                    <th>승</th>
                                    <th>무</th>
                                    <th>패</th>
                                    <th>득실차</th>
                                    <th>승점</th>
                                    <th>최근 5경기</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((item, index) => (
                                    <tr key={item.teamId || index}>
                                        <td className="rankCell">{index + 1}</td>
                                        <td className="teamCell">
                                            <img 
                                                src={GetTeamLogo(selectedLeague, item.team)} 
                                                alt={item.team} 
                                                className="teamLogo" 
                                            />
                                            <span className="teamName">{item.team}</span>
                                        </td>
                                        <td>{item.played}</td>
                                        <td className="winCell">{item.win}</td>
                                        <td className="drawCell">{item.draw}</td>
                                        <td className="lossCell">{item.loss}</td>
                                        <td className="diffCell">{item.diff}</td>
                                        <td className="pointsCell">{item.points || 0}</td>
                                        <td className="formCell">{renderForm(item.form)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
