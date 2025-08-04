import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';

export default function BodyPage(){
    const [selectedTab, setSelectedTab] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(null);
    
    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);        // 검색어 저장
        setSelectedTab("search");        // 검색 탭으로 이동
    };


    return(
        <div className="bodyContainer">
            <div style={{flex:0}}>
                <div style={{display:"flex"}}>
                    <SidebarPage
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                    />
                </div>
            </div>
            <div style={{flex: 1}}>
                <Routes>
                  <Route path='/home' element={HomeBodyPage}/>
                </Routes>
            </div>
        </div>
    )
}