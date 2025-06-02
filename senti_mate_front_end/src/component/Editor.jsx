import React, { useState } from "react";
import EmotionItem from "./EmotionItem";
import './Editor.css';

const emotionList = [
    { id: 1, image: "/src/img/very-happy.png", name: "매우 기쁨" },
    { id: 2, image: "/src/img/happy.png", name: "기쁨" },
    { id: 3, image: "/src/img/neutral.png", name: "보통" },
    { id: 4, image: "/src/img/sad.png", name: "슬픔" },
    { id: 5, image: "/src/img/very-sad.png", name: "매우 슬픔" },
];

const Editor = ({ isEditMode = false, initialData }) => {
    const [selectedEmotion, setSelectedEmotion] = useState(
        isEditMode ? initialData.emotionId : 3
    );
    const [content, setContent] = useState(isEditMode ? initialData.content : "");

    const onChangeEmotion = (id) => {
        setSelectedEmotion(id);
    };

    const onChangeContent = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className="Editor">
            <h2>오늘의 감정 선택</h2>
            <div className="emotion-list">
                {emotionList.map((it) => (
                    <EmotionItem
                        key={it.id}
                        emotion={it}
                        isSelected={it.id === selectedEmotion}
                        onClick={onChangeEmotion}
                    />
                ))}
            </div>
            <textarea
                className="content-input"
                value={content}
                onChange={onChangeContent}
                placeholder="오늘 하루 어땠는지 자유롭게 기록해보세요."
            />
        </div>
    );
};

export default Editor;
