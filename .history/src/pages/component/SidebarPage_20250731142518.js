import React from "react"; 
import like from "../../img/icon/like.svg";
import search from "../../img/icon/search.svg";
import user from "../../img/icon/user.svg";
import plus from "../../img/icon/plus.svg";

export default function SidebarPage(){

    return(
        <div className="sidebarContainer">
            <div className="absol sideItem">
                <img/>
            </div>
            <div className="tabMenu">
                <img src={like} className="tabItem"/>
                <img className="tabItem plus"/>
                <img className="tabItem like"/>
                <img className="tabItem menu"/>
            </div>
        </div>
    );
}