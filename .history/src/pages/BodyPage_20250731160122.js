import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';

export default function BodyPage(){
     const [selectedTab, setSelectedTab] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
    return(
        <div className="bodyContainer">
            <div style={{flex:0}}>
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            </div>
            <div style={{flex: 1}}>
                <Routes>
                    <Route path='/' element={HomeBodyPage}/>
                </Routes>
            </div>
        </div>
    )
}