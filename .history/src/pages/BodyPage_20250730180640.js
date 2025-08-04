import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SidebarPage from "./component/SidebarPage"

export default function BodyPage(){
    return(
        <div className="bodyContainer">
            <div style={{flex:0}}>
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            </div>
            <div style={{flex: 1}}>
                
            </div>
        </div>
    )
}