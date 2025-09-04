import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchDetail } from "../../../api/match/Matches";
import MatchCard from "../home/match/MatchCard";
import { getCookie } from "../../../utils/Cookie";
import "../../../styles/detail.css";
import { getHomeAndAwayMatches ,getRecentMatchesByHome,getRecentMatchesByAway} from "../../../api/match/Detail";
// 팀 로고 컴포넌트
const TeamLogo = ({ teamName, logoUrl }) => {
  if (logoUrl) {
    return <img src={logoUrl} alt={teamName || '팀'} className="team-logo" />;
  }
  
  // 팀 이름이 없으면 기본값 처리
  if (!teamName) {
    return <div className="team-logo">팀</div>;
  }
  
  // 로고가 없으면 팀 이름의 첫 글자들로 대체
  const initials = teamName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
  return <div className="team-logo">{initials}</div>;
};



// 최근 경기 기록 컴포넌트
const RecentMatch = ({ match }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return '예정';
      case 'live': return '진행중';
      case 'finished': return '종료';
      default: return status;
    }
  };

  const shouldShowScore = (status) => {
    return status === 'live' || status === 'finished';
  };

  return (
    <div className="recent-match">
      <div className="match-date">{formatDate(match.date || match.matchDate)}</div>
      <div className="match-status">{getStatusText(match.status || match.matchStatus)}</div>
      <div className="match-teams">
        <div className="team">
          <TeamLogo teamName={match.homeTeam || match.home_team} logoUrl={match.homeTeamLogo || match.home_team_logo} />
          <span className="team-name">{match.homeTeam || match.home_team}</span>
        </div>
        <div className="score">
          {shouldShowScore(match.status || match.matchStatus) 
            ? `${match.homeScore || match.home_score || 0} : ${match.awayScore || match.away_score || 0}`
            : 'VS'
          }
        </div>
        <div className="team">
          <span className="team-name">{match.awayTeam || match.away_team}</span>
          <TeamLogo teamName={match.awayTeam || match.away_team} logoUrl={match.awayLogo || match.away_logo} />
        </div>
      </div>
    </div>
  );
};

// 로그인 확인 모달 컴포넌트
const LoginModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-content">
          <h3>로그인이 필요합니다</h3>
          <p>오픈톡 기능을 사용하려면 로그인이 필요합니다.</p>
          <p>로그인하시겠습니까?</p>
          <div className="login-modal-buttons">
            <button className="login-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button className="login-modal-confirm" onClick={onConfirm}>
              로그인하기
        </button>
      </div>
        </div>
      </div>
    </div>
  );
};

// 맞대결 경기 컴포넌트
const H2HMatch = ({ match }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <div className="h2h-match">
      <div style={{ flex: 1 }}>
        <div className="match-date">{formatDate(match.startTime || match.matchDate || match.scheduledDate)}</div>
        <div className="match-league">{match.league || match.leagueName || match.competition}</div>
      </div>
      <div className="match-teams">
        <div className="team">
          <TeamLogo teamName={match.homeTeam || match.home_team || match.homeTeamName} logoUrl={match.homeTeamLogo || match.home_team_logo} />
          <span className="team-name">{match.homeTeam || match.home_team || match.homeTeamName}</span>
        </div>
        <div className="score">{match.homeScore || match.home_score || 0} : {match.awayScore || match.away_score || 0}</div>
        <div className="team">
          <span className="team-name">{match.awayTeam || match.away_team || match.awayTeamName}</span>
          <TeamLogo teamName={match.awayTeam || match.away_team || match.awayTeamName} logoUrl={match.awayTeamLogo || match.away_team_logo} />
        </div>
      </div>
    </div>
  );
};

export default function MatchDetailPage({
  likedMatches = [],
  onLikeMatch = () => {},
  onOpenChat = () => {},
  recentMatchData = {},
  h2hHistory = [],
}) {
  const { sport, league, matchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('power');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [h2hMatches, setH2hMatches] = useState([]);
  const [homeRecent, setHomeRecent] = useState([]);
  const [awayRecent, setAwayRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // 최근 접속한 경기 저장
  useEffect(() => {
    const savedMatches = JSON.parse(localStorage.getItem('recentMatches') || '[]');
    const currentMatch = { sport, league, matchId, timestamp: Date.now() };
    
    // 이미 있는 경기면 제거
    const filteredMatches = savedMatches.filter(match => 
      !(match.sport === sport && match.league === league && match.matchId === matchId)
    );
    
    // 새 경기를 맨 앞에 추가하고 최대 5개만 유지
    const newMatches = [currentMatch, ...filteredMatches].slice(0, 5);
    setRecentMatches(newMatches);
    localStorage.setItem('recentMatches', JSON.stringify(newMatches));
  }, [sport, league, matchId]);

  
useEffect(() => {
  if (!detail) return;
  // 백엔드가 내려주는 팀 ID 키에 맞춰 안전 추출
  const homeId = detail.homeTeamId ?? detail.home_team_id ?? detail.homeId ?? detail.homeTeam?.id;
  const awayId = detail.awayTeamId ?? detail.away_team_id ?? detail.awayId ?? detail.awayTeam?.id;

  if (!homeId || !awayId) {
    setH2hMatches([]); // 아이디 없으면 비움
    return;
  }

  let alive = true;
  (async () => {
    const res = await getHomeAndAwayMatches(sport, league, homeId, awayId);
    if (!alive) return;
    if (res.status === "success") {
      setH2hMatches(Array.isArray(res.data) ? res.data : []);
    } else {
      setH2hMatches([]); // 실패 시 비움
      console.error("[H2H] error:", res.error);
    }
  })();

  return () => { alive = false; };
}, [detail, sport, league]);




  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMatchDetail(sport, league, matchId);
        if (!alive) return;

        if (res.status === "success") {
          console.log("API 응답 데이터:", res.data);
          setDetail(res.data);
        } else {
          console.error("API 오류:", res.error);
          setError(res.error || "경기 정보를 불러오지 못했습니다.");
        }
      } catch (e) {
        setError(e.message || "네트워크 오류가 발생했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [sport, league, matchId]);
  // useEffect(() => {
  //   if (!detail) return;
  
  //   // detail에서 팀 ID 안전 추출
  //   const homeId =
  //     detail.homeTeamId ??
  //     detail.home_team_id ??
  //     detail.homeId ??
  //     detail.homeTeam?.id;
  
  //   const awayId =
  //     detail.awayTeamId ??
  //     detail.away_team_id ??
  //     detail.awayId ??
  //     detail.awayTeam?.id;
  
  //   if (!homeId || !awayId) {
  //     // id가 없으면 호출하지 않음
  //     setHomeRecent([]);
  //     setAwayRecent([]);
  //     return;
  //   }
  
  //   let alive = true;
  //   (async () => {
  //     try {
  //       setRecentLoading(true);
  //       const resHome = await getRecentMatchesByHome(sport, league, homeId);
  //       const resAway = await getRecentMatchesByAway(sport, league, awayId);
  
  //       if (!alive) return;
  
  //       if (res.status === "success") {
  //         // 백엔드가 { homeRecent: [...], awayRecent: [...] } 형태로 내려오도록 구성
  //         const data = res.data ?? {};
  //         setHomeRecent(Array.isArray(data.homeRecent) ? data.homeRecent : []);
  //         setAwayRecent(Array.isArray(data.awayRecent) ? data.awayRecent : []);
  //       } else {
  //         console.error("[RECENT] error:", res.error);
  //         setHomeRecent([]);
  //         setAwayRecent([]);
  //       }
  //     } catch (e) {
  //       console.error("[RECENT] exception:", e);
  //       setHomeRecent([]);
  //       setAwayRecent([]);
  //     } finally {
  //       if (alive) setRecentLoading(false);
  //     }
  //   })();
  
  //   return () => {
  //     alive = false;
  //   };
  // }, [detail, sport, league]);

  

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return '경기전';
      case 'live': return '진행중';
      case 'finished': return '경기종료';
      default: return status || '경기 상태';
    }
  };

  const shouldShowScore = (status) => {
    return status === 'live' || status === 'finished';
  };

  // 승률 계산 함수
  const calculateWinRate = (matches, teamName) => {
    if (!matches || matches.length === 0) return 0;
    
    const finishedMatches = matches.filter(match => 
      match.status === 'finished' || match.matchStatus === 'finished'
    );
    
    if (finishedMatches.length === 0) return 0;
    
    const wins = finishedMatches.filter(match => {
      const homeScore = parseInt(match.homeScore || match.home_score || 0);
      const awayScore = parseInt(match.awayScore || match.away_score || 0);
      const homeTeam = match.homeTeam || match.homeTeamName || match.home_team;
      const awayTeam = match.awayTeam || match.awayTeamName || match.away_team;
      
      // 해당 팀이 홈팀인지 원정팀인지 확인
      const isHomeTeam = homeTeam === teamName;
      const isAwayTeam = awayTeam === teamName;
      
      if (isHomeTeam) {
        return homeScore > awayScore;
      } else if (isAwayTeam) {
        return awayScore > homeScore;
      }
      return false;
    }).length;
    
    return Math.round((wins / finishedMatches.length) * 100);
  };

  // 팀별 최근 5경기 가져오기
  const homeTeamRecentMatches = useMemo(() => {
    return (homeRecent.length ? homeRecent : (detail?.homeRecentMatches || detail?.home_recent_matches || []))
      .slice(0, 5);
  }, [homeRecent, detail]);

  const awayTeamRecentMatches = useMemo(() => {
    return (awayRecent.length ? awayRecent : (detail?.awayRecentMatches || detail?.away_recent_matches || []))
      .slice(0, 5);
  }, [awayRecent, detail]);

  // 승률 계산
  const homeWinRate = useMemo(() => {
    const homeTeamName = detail?.homeTeam || detail?.home_team || detail?.homeTeamName;
    return calculateWinRate(homeTeamRecentMatches, homeTeamName);
  }, [homeTeamRecentMatches, detail]);

  const awayWinRate = useMemo(() => {
    const awayTeamName = detail?.awayTeam || detail?.away_team || detail?.awayTeamName;
    return calculateWinRate(awayTeamRecentMatches, awayTeamName);
  }, [awayTeamRecentMatches, detail]);

  // 로그인 상태 확인
  const isLoggedIn = useMemo(() => {
    const token = getCookie('jwt');
    return !!token;
  }, []);

  // 탭 클릭 핸들러
  const handleTabClick = (tabName) => {
    if (tabName === 'opentalk' && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setActiveTab(tabName);
  };

  // 로그인 모달 핸들러
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
  };

  const { year, month, day, hour, minute } = useMemo(() => {
    const iso = detail?.startTime;
    if (!iso) return { year: "", month: "", day: "", hour: "", minute: "" };
  
    const safe = String(iso).replace(" ", "T");
    const [datePart, timePart = ""] = safe.split("T");
    const [y, m, d] = datePart.split("-");
    const [h = "", mi = ""] = timePart.split(":");
    return {year:y, month: m, day: d, hour: h, minute: mi };
  }, [detail?.startTime]);


  if (loading) {
    return (
      <div className="match-detail-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-detail-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          에러: {error}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="match-detail-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          경기를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="match-detail-layout">
      {/* 왼쪽 사이드바 - 최근 접속한 경기 */}
      <div className="left-sidebar">
        <h3>최근 접속한 경기</h3>
        <div className="recent-matches-list">
          {recentMatches.map((match, index) => (
            <div key={index} className="recent-match-item">
              <div className="match-info">
                <div className="match-league">{match.league}</div>
                <div className="match-id">ID: {match.matchId}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


   

      {/* 메인 컨텐츠 */}
    <div className="match-detail-container">
        {/* 매치 헤더 */}
        <div className="match-header">
          <div className="team-info">
            <TeamLogo teamName={detail.homeTeam || detail.home_team || detail.homeTeamName} logoUrl={detail.homeTeamLogo || detail.home_team_logo} />
            <div className="team-name">홈 {detail.homeTeam || detail.home_team || detail.homeTeamName || '홈팀'}</div>
          </div>
          
          <div className="match-info">
            <div className="match-time">{`${year}-${month}-${day} ${hour}:${minute}`  || '경기 시간'}</div>
            <div className="match-status">{getStatusText(detail.matchStatus || detail.status || detail.state)}</div>
              {shouldShowScore(detail.matchStatus || detail.status || detail.state) && (
              <div className="match-score">
                {detail.homeScore || detail.home_score || 0} : {detail.awayScore || detail.away_score || 0}
              </div>
            )}
          </div>
          
          <div className="team-info">
            <div className="team-name">{detail.awayTeam || detail.away_team || detail.awayTeamName || '원정팀'}</div>
            <TeamLogo teamName={detail.awayTeam || detail.away_team || detail.awayTeamName} logoUrl={detail.awayTeamLogo || detail.away_team_logo} />
          </div>
        </div>

        {/* 광고 섹션 */}
        <div className="ad-section">
          <div className="ad-label">AD</div>
          <div className="ad-content">
            <div className="ad-image">애니메</div>
            <div className="ad-text">
              <div className="ad-title">솔직하게 말씀드릴게요</div>
              <div className="ad-subtitle">LV.99999 올타임 레전드 힐링 게임</div>
              <button className="ad-button">더 알아보기 &gt;</button>
            </div>
          </div>
        </div>

        {/* 네비게이션 탭 */}
        <div className="match-nav-tabs">
          <div 
            className={`tab ${activeTab === 'power' ? 'active' : ''}`}
            onClick={() => handleTabClick('power')}
          >
            전력
          </div>
          <div 
            className={`tab ${activeTab === 'opentalk' ? 'active' : ''}`}
            onClick={() => handleTabClick('opentalk')}
          >
            오픈톡
          </div>
        </div>

        {/* 전력 탭 내용 */}
        {activeTab === 'power' && (
          <>
            {/* 팀 전력 비교 섹션 */}
            <div className="team-power-comparison">
              <h3>팀 전력 비교</h3>
              <div className="power-stats">
                <div className="team-power">
                  <div className="team-name">{detail.homeTeam || detail.home_team || detail.homeTeamName || '홈팀'}</div>
                  <div className="win-rate">승률: {homeWinRate}%</div>
                  <div className="recent-matches-count">최근 5경기</div>
                </div>
                <div className="vs-divider">VS</div>
                <div className="team-power">
                  <div className="team-name">{detail.awayTeam || detail.away_team || detail.awayTeamName || '원정팀'}</div>
                  <div className="win-rate">승률: {awayWinRate}%</div>
                  <div className="recent-matches-count">최근 5경기</div>
                </div>
              </div>
            </div>

            {/* 홈팀 최근 경기 기록 */}
            <div className="team-recent-matches">
              <h3>{detail.homeTeam || detail.home_team || detail.homeTeamName || '홈팀'} 최근 5경기</h3>
              <div className="match-cards-container">
                {homeTeamRecentMatches.length > 0 ? (
                  homeTeamRecentMatches.map((match, index) => (
                    <MatchCard 
                      key={index} 
                      match={match} 
                      likedMatches={likedMatches} 
                      onLike={onLikeMatch} 
                    />
                  ))
                ) : (
                  <div className="no-matches">최근 경기 기록이 없습니다.</div>
                )}
              </div>
            </div>

            {/* 원정팀 최근 경기 기록 */}
            <div className="team-recent-matches">
              <h3>{detail.awayTeam || detail.away_team || detail.awayTeamName || '원정팀'} 최근 5경기</h3>
              <div className="match-cards-container">
                {awayTeamRecentMatches.length > 0 ? (
                  awayTeamRecentMatches.map((match, index) => (
                    <MatchCard 
                      key={index} 
                      match={match} 
          likedMatches={likedMatches}
                      onLike={onLikeMatch} 
                    />
                  ))
                ) : (
                  <div className="no-matches">최근 경기 기록이 없습니다.</div>
                )}
              </div>
            </div>

            {/* 맞대결 섹션 */}
            <div className="head-to-head-section">
              <h3>최근 양팀 맞대결</h3>
              <div className="h2h-matches">
              {h2hMatches.length > 0 ? (
                h2hMatches.map((match, index) => (
                  <H2HMatch key={index} match={match} />
                ))
              ) : (
                <div className="no-matches">맞대결 기록이 없습니다.</div>
              )}
              </div>
            </div>
          </>
        )}

        {/* 오픈톡 탭 내용 */}
        {activeTab === 'opentalk' && (
          <div className="opentalk-section">
            {isLoggedIn ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                오픈톡 기능이 준비 중입니다.
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                로그인이 필요한 기능입니다.
              </div>
            )}
          </div>
        )}
      </div>

             {/* 오른쪽 사이드바 - 오픈톡 채팅 */}
       <div className="right-sidebar">
         <div className="chat-container">
           <h3>오픈톡</h3>
           <div className="chat-messages">
             {isLoggedIn ? (
               <div className="chat-placeholder">
                 실시간 채팅 기능이 준비 중입니다.
               </div>
             ) : (
               <div className="chat-placeholder">
                 로그인이 필요한 기능입니다.
               </div>
             )}
           </div>
         </div>
        </div>

       {/* 로그인 확인 모달 */}
       <LoginModal 
         isOpen={showLoginModal}
         onClose={handleLoginCancel}
         onConfirm={handleLoginConfirm}
       />
    </div>
  );
}
