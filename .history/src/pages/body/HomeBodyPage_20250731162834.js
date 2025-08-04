import { useState } from "react";

export default function HomeBodyPage(){
    const [date] = useState(new Date().toLocaleDateString());
    return(
        <div className="bodyContainer">
            <div className="content">
                <div className="container">
                    <strong className="nickName">야</strong>
                    <span className="gray">{date}</span>
                </div>
            </div>
        </div>
    )
}