import { useNavigate } from "react-router-dom";
import TierInfo from "./TierInfo";

export default function TierList({ userScores }) {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="tierContainer">
            {Object.entries(userScores)
                .filter(([, data]) => data.score > 0)
                .sort(([, dataA], [, dataB]) => dataB.score - dataA.score)
                .map(([category, data]) => (
                    <div key={category} className="tierInfoWrapper" onClick={() => handleNavigate(`/tier/${category}`)}>
                        <TierInfo category={category} score={data.score} />
                    </div>
            ))}
        </div>
    );
}
