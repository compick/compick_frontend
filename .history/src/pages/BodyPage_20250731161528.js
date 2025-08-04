import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';

export default function BodyPage(){



    return(
        <div className="bodyContainer">
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            <div style={{flex: 1}}>
                <Routes>
                  <Route path='/home' element={HomeBodyPage}/>
                </Routes>
            </div>
        </div>
    )
}