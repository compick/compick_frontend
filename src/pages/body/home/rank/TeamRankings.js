import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetTeamLogo from '../../../../utils/GetTeamLogo';
import { getTeamRankings } from '../../../../api/match/Matches';

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

    useEffect(() => {
        if (!league || !sport || league === 'all' || sport === 'all') {
            setRankings([]);
            setLoading(false);
            return;
        }

        const fetchRankings = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('🏆 TeamRankings API 호출:', { sport, league });
                
                const result = await getTeamRankings(sport, league);
                if (result.status === 'error') {
                    throw new Error(result.error);
                }
                const data = result.data;
                
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
    }, [league, sport]);

    const handleRankingClick = () => {
        if (league && league !== 'all') {
            navigate(`/ranking/${league}`);
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
                                <img src={GetTeamLogo(league, item.team)} alt={item.team} className="team-logo-small" />
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
