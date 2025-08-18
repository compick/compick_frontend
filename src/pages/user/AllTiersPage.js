import React from 'react';
import { Link } from 'react-router-dom'; // Link import
import TierInfo from './TierInfo';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AllTiersPage({ userScores }) {
    const sortedTiers = Object.entries(userScores)
        .filter(([, data]) => data.score > 0)
        .sort(([, dataA], [, dataB]) => dataB.score - dataA.score);

    return (
        <div className="uploadContainer">
            <h1>전체 티어 정보</h1>
            {sortedTiers.map(([category, data]) => {
                const chartData = {
                    labels: data.seasons[data.currentSeason].map((_, index) => `Game ${index + 1}`),
                    datasets: [{
                        label: `${data.currentSeason} Score History`,
                        data: data.seasons[data.currentSeason],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.3,
                    }],
                };

                const chartOptions = {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: `${category.toUpperCase()} 점수 변동` },
                    },
                };

                return (
                    <Link to={`/tier/${category}`} key={category} className="tierSection">
                        <div className="tierCardWrapper">
                           <TierInfo category={category} score={data.score} />
                        </div>
                        <div className="tierChartWrapper">
                            <Line options={chartOptions} data={chartData} />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
