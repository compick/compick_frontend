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

const GetTeamLogo = (league, teamName) => {
    if (league.toLowerCase() !== 'kbo') {
        return null;
    }

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
};

export default GetTeamLogo;
