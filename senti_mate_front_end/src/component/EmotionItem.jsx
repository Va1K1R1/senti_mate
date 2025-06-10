import React from "react";
import "./EmotionItem.css";

const EmotionItem = ({ emotion, isSelected, onClick }) => {
    return (
        <div
            className={["EmotionItem", isSelected ? "selected" : ""].join(" ")}
            onClick={() => onClick(emotion.id)}
        >
            <div className="emoji">{emotion.emoji}</div>
            <span>{emotion.name}</span>
        </div>
    );
};

export default EmotionItem;
