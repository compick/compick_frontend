// src/utils/mapper.js

/** 한글 → 영어 스포츠 코드 매퍼 */
export const KOR_SPORT_MAP = {
    "축구": "soccer",
    "야구": "baseball",
    "격투기": "mma",
  };
  
  /** 한글 → 영어 리그 코드 매퍼 */
  export const LEAGUE_MAP = {
    "유럽 챔피언스 리그": "ucl",
    "영국 프리미어리그": "epl",
    "영국 프리미어 리그": "epl",
    "EPL": "epl",
    "epl": "epl",
    "스페인 라리가": "laliga",
    "라리가": "laliga",
    "La Liga": "laliga",
    "laliga": "laliga",
    "KBO 리그": "kbo",
    "KBO": "kbo",
    "kbo": "kbo",
    "UFC": "ufc",
    "ufc": "ufc",
    // 필요 시 확장
  };
  
  /** 공통 변환 함수 */
  export const toSlug = (str = "") =>
    String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
  
  /** 스포츠 변환 */
  export const toSportSlug = (v) => {
    const raw = String(v || "").trim();
    const mapped =
      KOR_SPORT_MAP[raw] || KOR_SPORT_MAP[raw.toLowerCase()] || raw;
    return encodeURIComponent(toSlug(mapped));
  };
  
  /** 리그 변환 */
  export const toLeagueSlug = (v) => {
    const raw = String(v || "").trim();
    
    // 직접 매핑 시도
    let mapped = LEAGUE_MAP[raw];
    
    // 직접 매핑이 안되면 소문자로 시도
    if (!mapped) {
      mapped = LEAGUE_MAP[raw.toLowerCase()];
    }
    
    // 매핑이 안되면 원본값 사용하되 안전하게 처리
    if (!mapped) {
      mapped = raw;
    }
    
    // 빈 문자열이나 의미없는 값 처리
    if (!mapped || mapped === "" || mapped === "--") {
      console.warn("Invalid league value:", raw);
      return "unknown";
    }
    
    return encodeURIComponent(toSlug(mapped));
  };
  