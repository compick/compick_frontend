import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamRankings } from '../../api/match/Matches';
import GetTeamLogo from '../../utils/GetTeamLogo';

// 최근 5경기 결과를 아이콘으로 변환하는 헬퍼 함수 (TeamRankings.js와 동일)
const renderForm = (form) => {
    return (form || '-----').split('').map((result, index) => {
        let className = '';
        if (result === 'W') className = 'form-win';
        else if (result === 'D') className = 'form-draw';
        else if (result === 'L') className = 'form-loss';
        return <span key={index} className={`form-icon ${className}`}>{result}</span>;
    });
};

const leagueTitleMap = {
    epl: '프리미어리그',
    laliga: '라리가',
    kbo: 'KBO 리그',
    // 필요에 따라 추가
};

export default function TeamRankingPage() {
    const { league } = useParams(); // URL에서 리그 파라미터 가져오기
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!league) return;

        const fetchRankings = async () => {
            setLoading(true);
            try {
                // league에서 sport 추출 (예: 'epl' -> 'soccer', 'kbo' -> 'baseball')
                let sport = 'soccer'; // 기본값
                if (['kbo'].includes(league)) sport = 'baseball';
                else if (['ufc'].includes(league)) sport = 'mma';
                
                const result = await getTeamRankings(sport, league);
                if (result.status === 'error') {
                    throw new Error(result.error);
                }
                
                const data = result.data;
                const sortedData = data.sort((a, b) => {
                    if (b.points !== a.points) {
                        return b.points - a.points;
                    }
                    return b.diff - a.diff;
                });

                setRankings(sortedData);
            } catch (error) {
                console.error('Error fetching rankings:', error);
                setRankings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [league]);

    if (loading) {
        return <div className="ranking-page-container"><h2>순위 정보를 불러오는 중...</h2></div>;
    }

    if (rankings.length === 0) {
        return <div className="ranking-page-container"><h2>표시할 순위 정보가 없습니다.</h2></div>;
    }

    const pageTitle = leagueTitleMap[league.toLowerCase()] || '구단 순위';

    return (
        <div className="ranking-page-container full-ranking-table">
            <header className="ranking-header">
                <h1>🏆 {pageTitle} 전체 순위</h1>
            </header>
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
                        <th>최근 5경기</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((item, index) => (
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
                            <td className="form-cell">{renderForm(item.form)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
