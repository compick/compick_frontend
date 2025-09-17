import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchSearch from "./MatchSearch";
import { apiForm, apiJson } from "../../../api/apiClient";

export default function WritePost({ capturedImage }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLeague, setSelectedLeague] = useState("all");
  const navigate = useNavigate();

  // 스포츠와 리그 옵션
  const sportOptions = {
    전체: { leagues: [{ name: "모든리그", value: "all" }] },
    축구: {
      leagues: [
        { name: "모든리그", value: "all" },
        { name: "EPL", value: "epl" },
        { name: "라리가", value: "laliga" },
      ],
    },
    야구: {
      leagues: [
        { name: "모든리그", value: "all" },
        { name: "KBO", value: "kbo" },
      ],
    },
  };

  // 게시글 등록
  const handleShare = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("sport", selectedSport);
      formData.append("league", selectedLeague);

      // 매치 태그 (배열)
      selectedMatches.forEach((match, idx) => {
        formData.append(`matchtagName[${idx}].matchId`, match.matchId);
        formData.append(`matchtagName[${idx}].homeTeam`, match.homeTeamName || "");
        formData.append(`matchtagName[${idx}].awayTeam`, match.awayTeamName || "");
      });

      if (capturedImage) {
        // base64 → File 변환 후 formData에 추가
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        const file = new File([blob], `board_${Date.now()}.png`, {
          type: blob.type || "image/png",
        });
        formData.append("file", file);
      }

      const data = await apiForm("/api/board/regist", formData);

      if (data.code === 200) {
        alert("게시글 등록 성공!");
        navigate("/");
      } else {
        alert("게시글 등록 실패: " + (data.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("게시글 등록 중 오류:", err);
      alert("게시글 등록 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 매치 선택 핸들러
  const handleMatchSelect = (match, isRemove = false) => {
    if (isRemove) {
      setSelectedMatches((prev) => prev.filter((m) => m.matchId !== match));
    } else {
      setSelectedMatches((prev) => {
        if (prev.some((m) => m.matchId === match.matchId)) return prev;
        if (prev.length >= 3) {
          alert("최대 3개의 매치만 선택할 수 있습니다.");
          return prev;
        }
        return [...prev, match];
      });
    }
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
              style={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 8,
                marginBottom: 16,
              }}
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
                onChange={(e) => setSelectedSport(e.target.value)}
                className="sportSelect"
              >
                {Object.keys(sportOptions).map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            <div className="selectorGroup">
              <label htmlFor="leagueSelect">리그:</label>
              <select
                id="leagueSelect"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="leagueSelect"
              >
                {sportOptions[selectedSport]?.leagues.map((league) => (
                  <option key={league.value} value={league.value}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3>게시글 제목</h3>
          <input
            type="text"
            placeholder="게시글 제목을 입력하세요"
            className="postTitle_wirte"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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

          <button
            type="button"
            className="postBtn"
            onClick={handleShare}
            disabled={loading}
          >
            {loading ? "업로드 중..." : "공유"}
          </button>
        </div>
      </div>
    </div>
  );
}
