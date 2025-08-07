
// 리그
import eplLogo from "../img/soccerTeam/league/eplLogo.png";
import championLogo from "../img/soccerTeam/league/EuropeChampionsLeagueLogo.png";
import laligaSpain from "../img/soccerTeam/league/laligaLogo.png";


export default function getLeagueLogo(leagueName) {
  switch (leagueName) {
    case "England Premium League":
    case "EPL":
      return eplLogo;

    case "UEFA Champions League":
    case "Champions League":
      return championLogo;

    case "LA LIGA EA SPORTS":
    case "La Liga":
    case "LALIGA":
      return laligaLogo;

    default:
      return null; // 일치하는 리그가 없을 경우
  }
}