import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SidebarPage from "./component/SidebarPage"
import HomeBodyPage from './body/HomeBodyPage';

export default function BodyPage(){
    const [selectedTab, setSelectedTab] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);        // 검색어 저장
        setSelectedTab("search");        // 검색 탭으로 이동
    };


    return(
        <div className="bodyContainer">
            <div style={{flex:0}}>
                <div style={{display:"flex"}}>
                    <SidebarPage/>
                </div>
            </div>
            <div style={{flex: 1}}>
                <Routes>
                    {isExpanded && selectedTab === "home" && (
                        <HomeBodyPage
                        selectedTab={selectedTab}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        setSelectedRestaurant={setSelectedRestaurant}
                        handleSearch={handleSearch} // ✅ 여기 추가!
                        onFilteredListChange={setFilteredList}
                        />
                    )}
                    {isExpanded && selectedTab === "best" && <BarBest 
                        selectedTab={selectedTab}
                        bounds={bounds}
                        moveMapToFitBounds={moveMapToFitBounds}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        setSelectedRestaurant={setSelectedRestaurant}
                        handleSearch={handleSearch} // ✅ 여기 추가!/
                        onFilteredListChange={setFilteredList}
                        />}
                    {isExpanded && selectedTab === "clean" && <BarClean 
                        selectedTab={selectedTab}
                        bounds={bounds}
                        moveMapToFitBounds={moveMapToFitBounds}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        setSelectedRestaurant={setSelectedRestaurant}
                        handleSearch={handleSearch} // ✅ 여기 추가!\
                        onFilteredListChange={setFilteredList}
                        />}
                    {isExpanded && selectedTab === "penal" && <BarPenal 
                        selectedTab={selectedTab}
                        bounds={bounds}
                        moveMapToFitBounds={moveMapToFitBounds}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        setSelectedRestaurant={setSelectedRestaurant}
                        handleSearch={handleSearch}
                        onFilteredListChange={setFilteredList}
                    />}
                    {isExpanded && selectedTab === "mypage" && <BarMy 
                        selectedTab={selectedTab}
                        bounds={bounds}
                        moveMapToFitBounds={moveMapToFitBounds}
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        setSelectedRestaurant={setSelectedRestaurant}
                        handleSearch={handleSearch}
                        onFilteredListChange={setFilteredList}
                    />}
                </Routes>
            </div>
        </div>
    )
}