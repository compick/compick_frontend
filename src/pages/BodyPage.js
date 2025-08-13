import { Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';
import LoginPage from "./login/LoginUser";
import RegisterUserPage from "./login/RegisterUser";
import AddBody from './body/AddBody';
import MyProfile from './user/MyProfile';
import AllTiersPage from './user/AllTiersPage'; // 새로 만들 페이지 import
import TierDetailPage from './user/TierDetailPage'; // 상세 페이지 import

export default function BodyPage({ userScores, capturedImage, setCapturedImage }){ // props 추가

    return(
        <div className="bodyContainer">
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            <div style={{flex: 1 }}>
                <Routes>
                    <Route path='/home' element={<HomeBodyPage/>}/>
                    {/* AddBody에 props 전달 */}
                    <Route path='/add' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                    <Route path='/editImage' element={<AddBody setCapturedImage={setCapturedImage} />}/>
                    <Route path='/writePost' element={<AddBody capturedImage={capturedImage} />}/>
                    <Route path="/login" element={ <LoginPage/> }/>
                    <Route path="/regist" element={ <RegisterUserPage/> }/>
                    <Route path="/myProfile" element={<MyProfile userScores={userScores} />}/>
                    <Route path="/all-tiers" element={<AllTiersPage userScores={userScores} />}/>
                    <Route path="/tier/:category" element={<TierDetailPage userScores={userScores} />}/>
                </Routes>
            </div>
        </div>
    )
}