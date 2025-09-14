import React, { useState, useEffect, useRef } from 'react';
import { apiJson } from '../../../api/apiClient';

export default function MatchSearch({ onSelectMatch, selectedMatches = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    // 검색어가 변경될 때마다 검색 실행
    useEffect(() => {
        const searchMatches = async () => {
          if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
          }
      
          setIsLoading(true);
          try {
            const res = await apiJson(`/api/match/search?keyword=${encodeURIComponent(searchTerm)}`);
            console.log("[SEARCH RESPONSE] raw =", res);
          
            if (Array.isArray(res)) {
              setSearchResults(res);
            } else if (res?.data) {
              setSearchResults(res.data);
            } else {
              setSearchResults([]);
            }
            setShowResults(true);
          } catch (error) {
            console.error('매치 검색 중 오류:', error);
            setSearchResults([]);
          }
          
        };
      
        const timeoutId = setTimeout(searchMatches, 300); // 디바운스
        return () => clearTimeout(timeoutId);
      }, [searchTerm]);

    // 외부 클릭 시 결과 숨기기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMatchSelect = (match) => {
        // 최대 선택 개수 확인
        if (selectedMatches.length >= 3) {
            return; // 이미 3개 선택된 경우 추가 선택 방지
        }
        onSelectMatch(match);
        setSearchTerm('');
        setShowResults(false);
    };

    const handleRemoveMatch = (matchId) => {
        onSelectMatch(matchId, true); // true는 제거 플래그
    };

    const isMatchSelected = (matchId) => {
        return selectedMatches.some(match => match.matchId === matchId);
    };

    return (
        <div className="matchSearch" ref={searchRef}>
            <div className="matchSearchInput">
                <input
                    type="text"
                    placeholder="팀명이나 매치를 검색하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchInput"
                />
                {isLoading && <div className="searchLoading">검색 중...</div>}
            </div>

            {showResults && searchResults.length > 0 && (
                <div className="searchResults" ref={resultsRef}>
                    {searchResults.map((match) => (
                        <div
                            key={match.matchId}
                            className={`searchResultItem ${isMatchSelected(match.matchId) ? 'selected' : ''} ${selectedMatches.length >= 3 && !isMatchSelected(match.matchId) ? 'disabled' : ''}`}
                            onClick={() => !isMatchSelected(match.matchId) && selectedMatches.length < 3 && handleMatchSelect(match)}
                        >
                            <div className="matchInfo">
                             <div className="matchMeta">
                                    <span className="matchLeague">{match.leagueNickname?.toUpperCase()}</span>
                                    <span className="matchDate">
                                        {match.startTime ? new Date(match.startTime).toLocaleDateString() : 
                                         match.date || '날짜 미정'}
                                    </span>
                            </div>
                                <div className="matchTeams">
                                    <div className="match-row detail">
                                        <img className = "team-logo team-logo-left" src={match.homeTeamLogo} alt={match.homeTeamName} />
                                        <span className = "team-name">{match.homeTeamName}</span>
                                        <span className = "team-score">{match.homeScore}</span>
                                    </div>
                                    <div className="match-row detail">
                                        <img className = "team-logo team-logo-left" src={match.awayTeamLogo} alt={match.awayTeamName} />
                                        <span className = "team-name">{match.awayTeamName}</span>
                                        <span className = "team-score">{match.awayScore}</span>
                                    </div>
                                </div>
                               
                            </div>
                            {isMatchSelected(match.matchId) && (
                                <div className="selectedIndicator">✓ 선택됨</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showResults && searchResults.length === 0 && searchTerm.trim().length >= 2 && !isLoading && (
                <div className="noResults">
                    검색 결과가 없습니다.
                </div>
            )}

            {selectedMatches.length >= 3 && (
                <div className="maxSelectionNotice">
                    <p>최대 3개의 매치까지 선택할 수 있습니다.</p>
                </div>
            )}

            {selectedMatches.length > 0 && (
                <div className="selectedMatches">
                    <h4>선택된 매치 ({selectedMatches.length}/3):</h4>
                    {selectedMatches.map((match) => (
                   <div key={match.matchId} className="selectedMatchItem">
                   <div className="matchTeams">
                     <div className="match-row detail">
                       <img
                         className="team-logo team-logo-left"
                         src={match.homeTeamLogo}
                         alt={match.homeTeamName}
                       />
                       <span className="team-name">{match.homeTeamName}</span>
                       <span className="team-score">{match.homeScore}</span>
                     </div>
                     <div className="match-row detail">
                       <img
                         className="team-logo team-logo-left"
                         src={match.awayTeamLogo}
                         alt={match.awayTeamName}
                       />
                       <span className="team-name">{match.awayTeamName}</span>
                       <span className="team-score">{match.awayScore}</span>
                     </div>
                   </div>
                   <button
                     type="button"
                     className="removeMatchBtn"
                     onClick={() => handleRemoveMatch(match.matchId)}
                   >
                     ✕
                   </button>
                 </div>
               ))}
             </div>
           )}

        </div>
    );
}
