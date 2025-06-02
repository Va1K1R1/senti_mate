import React from "react";
import "./DiaryItem.css";
import { Link } from "react-router-dom";

const DiaryItem = ({ id, emotionId, date, content }) => {
    const emotionEmojiMap = {
        1: "😁",
        2: "🙂",
        3: "😐",
        4: "😢",
        5: "😭",
    };

    return (
        <div className="DiaryItem">
            <Link to={`/diary/${id}`}>
                <div className="info">
                    <span>{emotionEmojiMap[emotionId]}</span>
                    <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="content">{content.slice(0, 25) + "..."}</div>
            </Link>
        </div>
    );
};

export default DiaryItem;
