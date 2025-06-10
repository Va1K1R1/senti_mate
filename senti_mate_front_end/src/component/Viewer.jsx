import React from "react";
import "./Viewer.css";

const emotionTextMap = {
    1: "오늘은 매우 기쁜 하루였군요 😊",
    2: "기쁨이 가득했던 하루였어요 🙂",
    3: "평범하지만 소중한 하루였네요 😐",
    4: "조금은 마음이 무거웠던 하루였어요 😢",
    5: "많이 힘들었던 하루였겠네요 😭",
};

const Viewer = ({ content, emotionId }) => {
    return (
        <div className="Viewer">
            <h2>✨ 감정일기 분석 결과 ✨</h2>
            <div className="emotion-box">
                <p className="emotion-text">{emotionTextMap[emotionId]}</p>
                <p className="emotion-desc">
                    당신의 하루를 이렇게 표현할 수 있어요.
                    감정을 이렇게 솔직하게 표현해 준 것만으로도 정말 잘했어요!
                </p>
            </div>
            <div className="content-box">
                <h3>📝 당신의 기록</h3>
                <p className="content">{content}</p>
            </div>
        </div>
    );
};

export default Viewer;
