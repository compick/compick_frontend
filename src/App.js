import { useState } from "react";
import { BrowserRouter } from "react-router-dom"


import BodyPage from "./pages/BodyPage";

import "./styles/login.css";
import "./styles/component.css";
import "./styles/body.css";
import "./styles/add.css";
import "./styles/user.css";
function App() {
  const [userScores, setUserScores] = useState({
      soccer: {
          score: 820,
          rankPercent: 15,
          currentSeason: "Season 3",
          seasons: {
              "Season 1": [150, 200, 180, 250, 320],
              "Season 2": [400, 520, 480, 600, 650],
              "Season 3": [700, 680, 750, 820],
          },
          voteHistory: [
              { id: 1, date: '2023-10-27', change: '+20', reason: '승리 예측 성공' },
              { id: 2, date: '2023-10-25', change: '-10', reason: '패배 예측 실패' },
              { id: 3, date: '2023-10-22', change: '+15', reason: '스코어 예측 성공' },
          ]
      },
      baseball: {
          score: 780,
          rankPercent: 1,
          currentSeason: "Season 2",
          seasons: {
              "Season 1": [800, 850, 920, 880, 1000],
              "Season 2": [1020, 1050, 1030, 1080],
          },
          voteHistory: [
            { id: 1, date: '2023-10-26', change: '+30', reason: 'MVP 예측 성공' },
            { id: 2, date: '2023-10-24', change: '-20', reason: '승리 예측 실패' },
          ]
      },
      ufc: {
          score: 50,
          rankPercent: 78,
          currentSeason: "Season 1",
          seasons: {
              "Season 1": [100, 80, 120, 90, 50],
          },
          voteHistory: [
            { id: 1, date: '2023-10-28', change: '-50', reason: 'KO패 예측 실패' },
          ]
      },
  });
  const [capturedImage, setCapturedImage] = useState(null); // 캡처 이미지 상태 추가

  return (
    <BrowserRouter>
         <BodyPage 
            userScores={userScores} 
            capturedImage={capturedImage}
            setCapturedImage={setCapturedImage}
         />
    </BrowserRouter>
  );
}

export default App;
