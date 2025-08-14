const TIER_LIST = [
    { name: 'Challenger', minScore: 1000 },
    { name: 'Master', minScore: 800 },
    { name: 'Diamond', minScore: 600 },
    { name: 'Gold', minScore: 400 },
    { name: 'Silver', minScore: 200 },
    { name: 'Bronze', minScore: 0 }
];

const getTierInfo = (score) => {
    for (const tier of TIER_LIST) {
        if (score >= tier.minScore) {
            const nextTierIndex = TIER_LIST.indexOf(tier) - 1;
            const nextTier = nextTierIndex >= 0 ? TIER_LIST[nextTierIndex] : null;
            const maxScoreInTier = nextTier ? nextTier.minScore : tier.minScore + 200;
            const progress = ((score - tier.minScore) / (maxScoreInTier - tier.minScore)) * 100;
            return {
                ...tier,
                nextTierName: nextTier ? nextTier.name : 'Max',
                progress: Math.min(progress, 100)
            };
        }
    }
    return TIER_LIST[TIER_LIST.length - 1];
};

export default function TierInfo({ category, score }) {
    const tier = getTierInfo(score);
    const tierClassName = tier.name.toLowerCase();
    const tierIconSrc = `/img/tier/${category}/${tierClassName}.svg`;

    // 아이콘이 없을 경우를 대비한 대체 텍스트
    const handleImageError = (e) => {
        e.target.style.display = 'none'; // 아이콘 숨기기
        // 또는 대체 이미지 설정: e.target.src = '/img/tier/default.svg';
    };


    return (
        <div className={`tierInfoBox tier-${tierClassName}`}>
            <img 
                src={tierIconSrc} 
                alt={`${category} ${tier.name}`} 
                className="tierIcon"
                onError={handleImageError}
            />
            <div className="tierDetails">
                <span className="tierCategory">{category.toUpperCase()}</span>
                <span className="tierName">{tier.name}</span>
                <div className="progressBarContainer">
                    <div className="progressBar" style={{ width: `${tier.progress}%` }}></div>
                </div>
                <span className="tierScore">{score} LP</span>
            </div>
        </div>
    );
}
