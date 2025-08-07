import { Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';
import LoginPage from "./login/LoginUser";
import RegisterUserPage from "./login/RegisterUser";
import AddBody from './body/AddBody';
import EditImage from './body/add/EditImage';
import WritePost from './body/add/WritePost';

export default function BodyPage(){



    return(
        <div className="bodyContainer">
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            <div style={{flex: 1 }}>
                <Routes>
                    <Route path='/home' element={<HomeBodyPage/>}/>
                    <Route path='/add' element={<AddBody/>}/>
                    <Route path="/user" element={ <LoginPage/> }/>
                    <Route path="/regist" element={ <RegisterUserPage/> }/>
                    <Route path="/editImage" element={<EditImage />} />
                <Route path="/writePost" element={<WritePost />} />
                </Routes>
            </div>
        </div>
    )
}