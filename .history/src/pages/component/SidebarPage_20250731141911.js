import React from "react"; 
import {like,plus,search,menu} from "../../../public/img/icon";

export default function SidebarPage(){

    return(
        <div className="sidebarContainer">
            <div className="absol sideItem">
                <img/>
            </div>
            <div className="tabMenu">
                <img src={like}/>
                <img className="tabItem plus"/>
                <img className="tabItem like"/>
                <img className="tabItem menu"/>
            </div>
        </div>
    );
}