
// 리그
import eplLogo from "../img/soccerTeam/league/eplLogo.png";
import championLogo from "../img/soccerTeam/league/EuropeChampionsLeagueLogo.png";
import laligaLogo from "../img/soccerTeam/league/laligaLogo.png";


export default function GetLeagueLogo(leagueName) {
  switch (leagueName) {
    case "England Premium League":
      return eplLogo;
    case "LA LIGA EA SPORTS":
      return laligaLogo;
    case "UEFA Champions League":
      return championLogo;
    default:
      return null;
  }
}
