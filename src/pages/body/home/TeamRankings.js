import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEplRankings, getLaligaRankings } from '../../../api/match/soccer';
import { getKboRankings } from '../../../api/match/baseball';
import { getUfcRankings } from '../../../api/match/mma';
import GetTeamLogo from '../../../utils/GetTeamLogo';

// 최근 5경기 결과를 아이콘으로 변환하는 헬퍼 함수
const renderForm = (form) => {
    return form.split('').map((result, index) => {
        let className = '';
        if (result === 'W') className = 'form-win';
        else if (result === 'D') className = 'form-draw';
        else if (result === 'L') className = 'form-loss';
        return <span key={index} className={`form-icon ${className}`}>{result}</span>;
    });
};

export default function TeamRankings({ league, sport }) {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 'soccer' 나 'baseball' 같은 상위 카테고리는 특정 리그로 변환
    const targetLeague = league === 'soccer' ? 'epl' : league === 'baseball' ? 'kbo' : league;

    useEffect(() => {
        if (!targetLeague || ['all', 'mma'].includes(targetLeague)) {
            setRankings([]);
            setLoading(false);
            return;
        }

        const fetchRankings = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('🏆 TeamRankings API 호출:', { sport, targetLeague });
                
                let data;
                if (sport === 'soccer') {
                    if (targetLeague === 'epl') {
                        data = await getEplRankings();
                    } else if (targetLeague === 'laliga') {
                        data = await getLaligaRankings();
                    }
                } else if (sport === 'baseball') {
                    if (targetLeague === 'kbo') {
                        data = await getKboRankings();
                    }
                } else if (sport === 'mma') {
                    if (targetLeague === 'ufc') {
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

        fetchRankings();
    }, [targetLeague, sport]);

    const handleRankingClick = () => {
        if (targetLeague && !['all', 'mma'].includes(targetLeague)) {
            navigate(`/ranking/${targetLeague}`);
        }
    };

    if (loading) {
        return <div>순위 정보를 불러오는 중...</div>;
    }

    if (error) {
        return (
            <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                <p>{error}</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    백엔드 서버 설정이 완료되면 다시 시도해주세요.
                </p>
            </div>
        );
    }

    if (rankings.length === 0) {
        return <div>표시할 순위 정보가 없습니다.</div>;
    }

    return (
        <div className="ranking-table-container clickable" onClick={handleRankingClick}>
            <table className="ranking-table">
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>팀</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>DIFF</th>
                        <th>승점</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.slice(0, 5).map((item, index) => (
                        <tr key={item.teamId || index}>
                            <td>{index + 1}</td>
                            <td className="team-cell">
                                <img src={GetTeamLogo(targetLeague, item.team)} alt={item.team} className="team-logo-small" />
                                {item.team}
                            </td>
                            <td>{item.played}</td>
                            <td>{item.win}</td>
                            <td>{item.draw}</td>
                            <td>{item.loss}</td>
                            <td>{item.diff}</td>
                            <td className="points-cell">{item.points || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
