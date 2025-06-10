import React from "react";
import { useSelector } from "react-redux";
import './DiaryList.css';
import DiaryItem from "./DiaryItem";

const DiaryList = () => {
    const diaryEntries = useSelector((state) => state.diary.diaryEntries); // Redux에서 불러오기

    if (!diaryEntries || diaryEntries.length === 0) {
        return <p className="EmptyMessage">작성된 감정일기가 없어요.</p>;
    }

    return (
        <div className="DiaryList">
            {diaryEntries.map((item) => (
                <DiaryItem
                    key={item.id}
                    id={item.id}
                    emotionId={item.emotionId}
                    date={item.date}
                    content={item.content}
                />
            ))}
        </div>
    );
};

export default DiaryList;
