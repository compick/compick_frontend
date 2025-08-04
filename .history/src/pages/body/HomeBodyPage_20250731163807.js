import { useState } from "react";

export default function HomeBodyPage(){
   

    return(
        <div className="bodyContainer">
            <div className="content">
                <div className="contentBox">
                    <div className="feed-header">
                        <img className="avatar"  alt="user avatar" />
                        <div className="user-info">
                            <span className="username">이름</span>
                            <span className="timestamp">작성시간</span>
                        </div>
                    </div>

                    <div className="feed-content">
                        <p>내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용</p>
                    </div>

                    {images?.length > 0 && (
                        <div className="feed-images">
                        {images.map((img, index) => (
                            <img key={index} src={img} alt={`feed-${index}`} className="feed-image" />
                        ))}
                        </div>
                    )}

                <div className="feed-reactions">
                    <span>❤️ {reactions.likes}</span>
                    <span>💬 {reactions.comments}</span>
                    <span>🔁 {reactions.reposts}</span>
                    <span>🔖 {reactions.bookmarks}</span>
                </div>
            </div>
        </div>
    </div>
    );
    
}