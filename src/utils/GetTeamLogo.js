import KIATigers from '../img/baseballTeam/kbo/KIA 타이거즈 로고.svg';
import SamsungLions from '../img/baseballTeam/kbo/삼성 라이온즈 로고.svg';
import LGTwins from '../img/baseballTeam/kbo/LG 트윈스 로고.svg';
import DoosanBears from '../img/baseballTeam/kbo/두산 베어스 로고.svg';
import ktWiz from '../img/baseballTeam/kbo/kt wiz 로고.svg';
import SSGLanders from '../img/baseballTeam/kbo/SSG 랜더스 로고.svg';
import LotteGiants from '../img/baseballTeam/kbo/롯데 자이언츠 로고.svg';
import HanwhaEagles from '../img/baseballTeam/kbo/한화 이글스 로고.svg';
import NCDinos from '../img/baseballTeam/kbo/NC 다이노스 로고.svg';
import KiwoomHeroes from '../img/baseballTeam/kbo/키움 히어로즈 로고.svg';

// ⚽ EPL 팀 로고
import Norwich from '../img/soccerTeam/epl/노리치 시티 FC 로고.svg';
import NottinghamForest from '../img/soccerTeam/epl/노팅엄 포레스트 FC 로고.svg';
import Newcastle from '../img/soccerTeam/epl/뉴캐슬 유나이티드 FC 로고.svg';
import Leicester from '../img/soccerTeam/epl/레스터 시티 FC 로고.svg';
import Luton from '../img/soccerTeam/epl/루턴 타운 FC 로고.svg';
import Liverpool from '../img/soccerTeam/epl/리버풀 FC 로고.svg';
import Leeds from '../img/soccerTeam/epl/리즈 유나이티드 FC 로고.svg';
import ManCity from '../img/soccerTeam/epl/맨체스터 시티 FC 로고.svg';
import ManUnited from '../img/soccerTeam/epl/맨체스터 유나이티드 FC 로고.svg';
import Burnley from '../img/soccerTeam/epl/번리 FC 로고.svg';
import Brighton from '../img/soccerTeam/epl/브라이튼 앤 호브 알비온 FC....svg';
import Brentford from '../img/soccerTeam/epl/브렌트포드 FC 로고.svg';
import Villarreal from '../img/soccerTeam/epl/비야레알 CF 로고.svg';
import Southampton from '../img/soccerTeam/epl/사우스햄튼 FC 로고.svg';
import Sunderland from '../img/soccerTeam/epl/선덜랜드 AFC 로고.svg';
import Sevilla from '../img/soccerTeam/epl/세비야 FC 로고.svg';
import SheffieldUnited from '../img/soccerTeam/epl/셰필드 유나이티드 FC 로고.svg';
import Swansea from '../img/soccerTeam/epl/스완지 시티 AFC 로고.svg';
import Arsenal from '../img/soccerTeam/epl/아스날 FC 로고.svg';
import AstonVilla from '../img/soccerTeam/epl/아스톤 빌라 FC 로고.svg';
import Everton from '../img/soccerTeam/epl/에버튼 FC 로고.svg';
import Watford from '../img/soccerTeam/epl/왓포드 FC 로고.svg';
import Urawa from '../img/soccerTeam/epl/우라와 레드 다이아몬즈 로고.svg';
import Wolverhampton from '../img/soccerTeam/epl/울버햄튼 원더러스 FC 로고.svg';
import WestBrom from '../img/soccerTeam/epl/웨스트 브롬위치 알비온 FC ....svg';
import WestHam from '../img/soccerTeam/epl/웨스트햄 유나이티드 FC 로고.svg';
import Ipswich from '../img/soccerTeam/epl/입스위치 타운 FC 로고.svg';
import Chelsea from '../img/soccerTeam/epl/첼시 FC 로고.svg';
import Cardiff from '../img/soccerTeam/epl/카디프 시티 FC 로고.svg';
import CarabaoCup from '../img/soccerTeam/epl/카라바오 컵 로고.svg';
import CrystalPalace from '../img/soccerTeam/epl/크리스탈 팰리스 FC 로고.svg';
import Tottenham from '../img/soccerTeam/epl/토트넘 홋스퍼 FC 로고.svg';
import Fulham from '../img/soccerTeam/epl/풀럼 FC 로고.svg';
import Fluminense from '../img/soccerTeam/epl/플루미넨시 FC 로고.svg';
import Huddersfield from '../img/soccerTeam/epl/허더즈필드 타운 AFC 로고(....svg';
import Bournemouth from '../img/soccerTeam/epl/AFC 본머스 로고.svg';
import Monterrey from '../img/soccerTeam/epl/CF 몬테레이 로고.svg';
import Flamengo from '../img/soccerTeam/epl/CR 플라멩구 로고.svg';
import Palmeiras from '../img/soccerTeam/epl/SE 파우메이라스 로고.svg';

const GetTeamLogo = (league, teamName) => {
   if (!league || !teamName) return null;

  switch (league.toLowerCase()) {
    // ⚾ KBO
    case "kbo":
    switch (teamName) {
        case 'KIA 타이거즈': return KIATigers;
        case '삼성 라이온즈': return SamsungLions;
        case 'LG 트윈스': return LGTwins;
        case '두산 베어스': return DoosanBears;
        case 'kt wiz': return ktWiz;
        case 'SSG 랜더스': return SSGLanders;
        case '롯데 자이언츠': return LotteGiants;
        case '한화 이글스': return HanwhaEagles;
        case 'NC 다이노스': return NCDinos;
        case '키움 히어로즈': return KiwoomHeroes;
        default: return null;
    }
    
    // ⚽ EPL
    case "epl":
      switch (teamName) {
        case "노리치 시티": return Norwich;
        case "노팅엄 포레스트": return NottinghamForest;
        case "뉴캐슬": 
        case "뉴캐슬 유나이티드": return Newcastle;
        case "레스터 시티": return Leicester;
        case "루턴 타운": return Luton;
        case "리버풀": return Liverpool;
        case "리즈 유나이티드": return Leeds;
        case "맨체스터 시티":
        case "맨시티": return ManCity;
        case "맨체스터 유나이티드":
        case "맨유": return ManUnited;
        case "번리": return Burnley;
        case "브라이튼": return Brighton;
        case "브렌트포드": return Brentford;
        case "비야레알": return Villarreal;
        case "사우스햄튼": return Southampton;
        case "선덜랜드": return Sunderland;
        case "세비야": return Sevilla;
        case "셰필드 유나이티드": return SheffieldUnited;
        case "스완지": return Swansea;
        case "아스날": return Arsenal;
        case "아스톤 빌라": return AstonVilla;
        case "에버튼": return Everton;
        case "왓포드": return Watford;
        case "우라와": return Urawa;
        case "울버햄튼": return Wolverhampton;
        case "웨스트 브롬": return WestBrom;
        case "웨스트햄": return WestHam;
        case "입스위치": return Ipswich;
        case "첼시": return Chelsea;
        case "카디프": return Cardiff;
        case "카라바오": return CarabaoCup;
        case "크리스탈 팰리스": return CrystalPalace;
        case "토트넘": return Tottenham;
        case "풀럼": return Fulham;
        case "플루미넨시": return Fluminense;
        case "허더즈필드": return Huddersfield;
        case "본머스": return Bournemouth;
        case "몬테레이": return Monterrey;
        case "플라멩구": return Flamengo;
        case "파우메이라스": return Palmeiras;
        default: return null;
      }

    default:
      return null;
  }
};

export default GetTeamLogo;