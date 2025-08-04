import { useState } from "react";

export default function HomeBodyPage(){
    const [date] = useState(new Date().toLocaleDateString());
    return(
        <div className="bodyContainer">
            <div className="content">
                <div className="contentBox">
                    <div className="feed-header">
        <img className="avatar" src={user.avatar} alt="user avatar" />
        <div className="user-info">
          <span className="username">{user.name}</span>
          <span className="timestamp">{time}</span>
        </div>
      </div>

      <div className="feed-content">
        <p>{content}</p>
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
  );
                </div>
            </div>
        </div>
    )
}