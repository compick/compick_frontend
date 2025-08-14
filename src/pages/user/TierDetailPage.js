import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TierInfo from './TierInfo';
import { Line } from 'react-chartjs-2';
// Chart.js는 AllTiersPage 등 다른 곳에서 이미 register 되었으므로, 여기서는 생략 가능

export default function TierDetailPage({ userScores }) {
    const { category } = useParams(); // URL에서 종목 이름(category) 가져오기
    const tierData = userScores[category];

    const [selectedSeason, setSelectedSeason] = useState(tierData.currentSeason);

    if (!tierData) {
        return <div>해당 종목의 티어 정보가 없습니다.</div>;
    }
    
    const handleSeasonChange = (e) => setSelectedSeason(e.target.value);
    
    const seasonHistory = tierData.seasons[selectedSeason] || [];

    const chartData = {
        labels: seasonHistory.map((_, index) => `Game ${index + 1}`),
        datasets: [{
            label: `${selectedSeason} Score History`,
            data: seasonHistory,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
        }],
    };
    
    const chartOptions = { /* ... (chartOptions 생략, 기존과 동일) ... */ };

    return (
        <div className="uploadContainer">
            <h1>{category.toUpperCase()} 티어 상세 정보</h1>
            <div className="tierDetailContent">
                <div className="tierCardWrapper">
                    <TierInfo category={category} score={tierData.score} />
                </div>
                <div className="tierDataWrapper">
                    <div className="rankInfo">
                        <p>현재 점수: <strong>{tierData.score} LP</strong></p>
                        <p>서버 내 상위: <strong>{tierData.rankPercent}%</strong></p>
                    </div>
                    <div className="seasonSelector">
                        <label htmlFor="season-select">시즌 선택:</label>
                        <select id="season-select" value={selectedSeason} onChange={handleSeasonChange}>
                            {Object.keys(tierData.seasons).map(season => (
                                <option key={season} value={season}>{season}</option>
                            ))}
                        </select>
                    </div>
                    <div className="chartContainer">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>
            </div>

            <div className="voteHistorySection">
                <h2>투표 기록</h2>
                <ul className="voteHistoryList">
                    {tierData.voteHistory.map(item => (
                        <li key={item.id} className="voteHistoryItem">
                            <span className="voteDate">{item.date}</span>
                            <span className="voteReason">{item.reason}</span>
                            <span className={`voteChange ${parseInt(item.change) > 0 ? 'plus' : 'minus'}`}>{item.change}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
