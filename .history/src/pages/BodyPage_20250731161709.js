import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';
import LoginPage from "./login/LoginUser";
import RegisterUserPage from "./pages/login/RegisterUser";
export default function BodyPage(){



    return(
        <div className="bodyContainer">
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            <div style={{flex: 1}}>
                <Routes>
                    <Route path='/home' element={HomeBodyPage}/>
                  
                    <Route path="/login" element={ <LoginPage/> }/>
                    <Route path="/regist" element={ <RegisterUserPage/> }/>
                </Routes>
            </div>
        </div>
    )
}