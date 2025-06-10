import React, { useState } from "react";
import EmotionItem from "./EmotionItem";
import './Editor.css';

const emotionList = [
    { id: 1, emoji: "😁", name: "매우 기쁨" },
    { id: 2, emoji: "🙂", name: "기쁨" },
    { id: 3, emoji: "😐", name: "보통" },
    { id: 4, emoji: "😢", name: "슬픔" },
    { id: 5, emoji: "😭", name: "매우 슬픔" },
];

const Editor = ({ isEditMode = false, initialData = {}, onSubmit }) => {
    const [selectedEmotion, setSelectedEmotion] = useState(
        isEditMode ? initialData.emotionId : 3
    );
    const [content, setContent] = useState(isEditMode ? initialData.content : "");

    const handleSubmit = () => {
        if (!content.trim()) {
            alert("일기 내용을 입력해주세요.");
            return;
        }

        const updatedEntry = {
            ...initialData,
            emotionId: selectedEmotion,
            content,
        };

        if (onSubmit) onSubmit(updatedEntry);
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
                        onClick={setSelectedEmotion}
                    />
                ))}
            </div>

            <textarea
                className="content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘 하루 어땠는지 자유롭게 기록해보세요."
            />

            <button className="SubmitBtn" onClick={handleSubmit}>
                {isEditMode ? "수정 완료" : "저장하기"}
            </button>
        </div>
    );
};

export default Editor;
