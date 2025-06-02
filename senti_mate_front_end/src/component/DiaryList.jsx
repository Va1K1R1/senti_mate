import React from "react";
import './DiaryList.css';
import DiaryItem from "./DiaryItem";

const dummyData = [
    { id: 1, date: new Date().getTime(), emotionId: 2, content: "오늘은 기분 좋았다. React 공부함." },
    { id: 2, date: new Date().getTime() - 86400000, emotionId: 4, content: "어제는 좀 우울했지만 친구 덕분에 괜찮아졌다." },
    // 실제 프로젝트에서는 API 호출/DB 연동해서 가져오기
];

const DiaryList = () => {
    return (
        <div className="DiaryList">
            {dummyData.map((item) => (
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
