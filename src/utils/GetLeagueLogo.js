
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
      return eplLogo;
    case "la liga ea sports":
    case "laliga":
      return laligaLogo;
    case "uefa champions league":
      return championLogo;
    case "kbo":
      return kboLogo;
    case "ufc":
      return ufcLogo;
    default:
      return null;
  }
}
