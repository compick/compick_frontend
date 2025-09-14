// WritePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBoard,uploadCapturedImage } from "../../../api/Board";
import MatchSearch from "./MatchSearch";


export default function WritePost({ capturedImage }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLeague, setSelectedLeague] = useState("all");
  const navigate = useNavigate();

  // 스포츠와 리그 옵션 정의
  const sportOptions = {
    '전체': {
      leagues: [
        { name: '모든리그', value: 'all' }
      ]
    },
    '축구': {
      leagues: [
        { name: '모든리그', value: 'all' },
        { name: 'EPL', value: 'epl' },
        { name: '라리가', value: 'laliga' }
      ]
    },
    '야구': {
      leagues: [
        { name: '모든리그', value: 'all' },
        { name: 'KBO', value: 'kbo' }
      ]
    },
    'MMA': {
      leagues: [
        { name: '모든리그', value: 'all' },
        { name: 'UFC', value: 'ufc' }
      ]
    }
  };

  const handleShare = async (e) => {
    e?.preventDefault();
    if (loading) return;
    setLoading(true);
  
    try {
  
      // 2) 이미지 준비
      const imageUrl = capturedImage ? await uploadCapturedImage(capturedImage) : null;
      console.log("[imageUrl]", imageUrl);
  
      // 3) 선택된 매치들을 matchtagList 형태로 변환
      const matchtagList = selectedMatches.map(match => ({
        matchId: match.matchId,
        homeTeam: match.homeTeamName || '',
        awayTeam: match.awayTeamName || ''
      }));
     
      // 4) 업로드
      const result = await addBoard({
        matchtagList,
        content,
        image: imageUrl,
        sport: selectedSport,
        league: selectedLeague
      });
  
      // ✅ 응답 전체를 먼저 출력
      console.log("[addBoard 응답 전체]", result);
  
      if (result.code === 200) {
        alert("게시글이 성공적으로 등록되었습니다!");
        setContent("");
        setSelectedMatches([]);
        setSelectedSport("all");
        setSelectedLeague("all");
  
        // ✅ data가 어디 있는지 확인 후 안전하게 출력
        if (result.data) {
          console.log("[게시글 등록 성공 - result.data]", result.data);
        } else if (result.response?.data) {
          console.log("[게시글 등록 성공 - result.response.data]", result.response.data);
        } else {
          console.log("[게시글 등록 성공 - result 내용 확인 필요]", result);
        }
  
        navigate("/", { replace: true });
      } else {
        alert("게시글 등록 실패: " + (result.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("게시글 등록 중 오류:", err);
      alert(`게시글 등록 실패: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (match, isRemove = false) => {
    if (isRemove) {
      setSelectedMatches(prev => prev.filter(m => m.matchId !== match));
    } else {
      setSelectedMatches(prev => {
        // 이미 선택된 매치인지 확인
        if (prev.some(m => m.matchId === match.matchId)) {
          return prev;
        }
        // 최대 3개까지만 선택 가능
        if (prev.length >= 3) {
          alert("최대 3개의 매치만 선택할 수 있습니다.");
          return prev;
        }
        return [...prev, match];
      });
    }
  };

  // 스포츠 선택 핸들러
  const handleSportChange = (sport) => {
    setSelectedSport(sport);
    setSelectedLeague("all"); // 스포츠 변경 시 리그를 'all'로 초기화
  };

  // 리그 선택 핸들러
  const handleLeagueChange = (league) => {
    setSelectedLeague(league);
  };

  return (
    <div className="uploadContainer">
      <h2>새 게시물</h2>
<div className="writeBoardBox">
  <div className="previewBox">
{capturedImage && (

        <img
          src={capturedImage}
          alt="post"
          style={{ width: "100%", maxWidth: 400, borderRadius: 8, marginBottom: 16 }}
        />
      )}
  </div>
   
   <div className="sportLeagueSection">
        <h3>스포츠 및 리그 선택</h3>
        <div className="sportLeagueSelectors">
          <div className="selectorGroup">
            <label htmlFor="sportSelect">스포츠:</label>
            <select 
              id="sportSelect"
              value={selectedSport} 
              onChange={(e) => handleSportChange(e.target.value)}
              className="sportSelect"
            >
              {Object.keys(sportOptions).map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
          
          <div className="selectorGroup">
            <label htmlFor="leagueSelect">리그:</label>
            <select 
              id="leagueSelect"
              value={selectedLeague} 
              onChange={(e) => handleLeagueChange(e.target.value)}
              className="leagueSelect"
            >
              {selectedSport && sportOptions[selectedSport]?.leagues.map(league => (
                <option key={league.value} value={league.value}>{league.name}</option>
              ))}
            </select>
          </div>
        </div>
        <h3>매치 언급</h3>
        <MatchSearch 
          onSelectMatch={handleMatchSelect}
          selectedMatches={selectedMatches}
        />
        <h3>게시글 설명</h3>
        <textarea
        placeholder="게시글 설명 작성"
        className="postText"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="button" className="postBtn" onClick={handleShare} disabled={loading}>
        {loading ? "업로드 중..." : "공유"}
      </button>
      </div>
</div>

      
    </div>
  );
}
