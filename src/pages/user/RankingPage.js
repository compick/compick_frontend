import React, { useState, useMemo } from 'react';
import defaultProfile from '../../img/icon/defaultProfile.jpeg';

// 임시 랭킹 데이터
const dummyRankingData = {
    soccer: [
        { rank: 1, nickname: '축신', score: 2800, profileImg: defaultProfile },
        { rank: 2, nickname: '메시팬', score: 2750, profileImg: defaultProfile },
        { rank: 3, nickname: '호날두팬', score: 2700, profileImg: defaultProfile },
        { rank: 4, nickname: '손흥민팬', score: 2650, profileImg: defaultProfile },
        { rank: 5, nickname: '김민재팬', score: 2600, profileImg: defaultProfile },
    ],
    baseball: [
        { rank: 1, nickname: '야구왕', score: 3000, profileImg: defaultProfile },
        { rank: 2, nickname: '오타니팬', score: 2900, profileImg: defaultProfile },
        { rank: 3, nickname: '김하성팬', score: 2800, profileImg: defaultProfile },
    ],
    ufc: [
        { rank: 1, nickname: '격투기황제', score: 2950, profileImg: defaultProfile },
        { rank: 2, nickname: '맥그리거팬', score: 2850, profileImg: defaultProfile },
        { rank: 3, nickname: '존존스팬', score: 2800, profileImg: defaultProfile },
        { rank: 4, nickname: '정찬성팬', score: 2750, profileImg: defaultProfile },
    ],
};

export default function RankingPage() {
    const [category, setCategory] = useState('soccer');
    const [searchTerm, setSearchTerm] = useState('');

    const rankings = dummyRankingData[category] || [];

    const filteredRankings = useMemo(() => 
        rankings.filter(user => 
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        ), [rankings, searchTerm]);

    const podium = filteredRankings.filter(user => user.rank <= 3 && searchTerm === '');
    const list = searchTerm ? filteredRankings : filteredRankings.filter(user => user.rank > 3);

    return (
        <div className="homeContainer_new">
            <header className="ranking-header">
                <h1>🏆 MMR 랭킹</h1>
            </header>

            <nav className="ranking-menu-bar">
                <div className="category-buttons">
                    <button className={category === 'soccer' ? 'active' : ''} onClick={() => setCategory('soccer')}>축구</button>
                    <button className={category === 'baseball' ? 'active' : ''} onClick={() => setCategory('baseball')}>야구</button>
                    <button className={category === 'ufc' ? 'active' : ''} onClick={() => setCategory('ufc')}>UFC</button>
                </div>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="닉네임 검색..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </nav>

            {searchTerm === '' && (
                <section className="podium-section">
                    {podium.map(user => (
                        <div key={user.rank} className={`podium-column rank-${user.rank}`}>
                            <div className="podium-profile-wrapper">
                                {user.rank === 1 && <div className="crown-icon">👑</div>}
                                <img src={user.profileImg} alt={user.nickname} className={`podium-profile-img rank-${user.rank}`} />
                            </div>
                            <div className="podium-nickname">{user.nickname}</div>
                            <div className={`podium-bar rank-${user.rank}`}></div>
                            <div className="podium-score">{user.score} 점</div>
                        </div>
                    ))}
                </section>
            )}

            <section className="list-section">
                {list.length > 0 ? list.map(user => (
                    <div key={user.rank} className="list-item">
                        <span className="list-rank">{user.rank}</span>
                        <img src={user.profileImg} alt={user.nickname} className="list-profile-img" />
                        <span className="list-nickname">{user.nickname}</span>
                        <span className="list-score">{user.score} 점</span>
                    </div>
                )) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </section>
        </div>
    );
}
