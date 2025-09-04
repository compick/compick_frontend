
// 리그
import eplLogo from "../img/soccerTeam/league/eplLogo.png";
import championLogo from "../img/soccerTeam/league/EuropeChampionsLeagueLogo.png";
import laligaLogo from "../img/soccerTeam/league/laligaLogo.png";
import kboLogo from "../img/baseballTeam/kbo/KBO 리그 로고.svg";
import ufcLogo from "../img/MMA/UFC/ufc 로고.svg";
// UFC 로고가 있다면 여기에 import 하세요. 예: import ufcLogo from '...';

export default function GetLeagueLogo(leagueName) {
  if (!leagueName) return null;
  const lowerLeagueName = leagueName.toLowerCase();

  switch (lowerLeagueName) {
    case "england premium league":
    case "epl":
    case "premier league":
    case "영국 프리미어 리그":
    case "england premier league":
    case "premier league":
    case "england premium league":
      return eplLogo;
    case "la liga ea sports":
    case "laliga":
    case "la liga":
    case "primera división":
    case "스페인 라리가":
    case "라리가":
    case "스페인 프리메라 디비시온":
      return laligaLogo;
    case "uefa champions league":
    case "champions league":
    case "챔피언스 리그":
    case "uefa 챔피언스 리그":
    case "uefa champions league":
      return championLogo;
    case "kbo":
    case "korean baseball organization":
    case "k리그1":
    case "k리그2":
      return kboLogo;
    case "ufc":
    case "ultimate fighting championship":
      return ufcLogo;
    default:
      return null;
  }
}
