import React from "react";
import "./Viewer.css";

const emotionTextMap = {
    1: "매우 기뻐요",
    2: "기뻐요",
    3: "보통이에요",
    4: "슬퍼요",
    5: "매우 슬퍼요",
};

const Viewer = ({ content, emotionId }) => {
    return (
        <div className="Viewer">
            <h2>내 감정 기록</h2>
            <p className="emotion-text">{emotionTextMap[emotionId]}</p>
            <p className="content">{content}</p>
        </div>
    );
};

export default Viewer;
