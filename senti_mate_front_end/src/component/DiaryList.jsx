import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import './DiaryList.css';
import DiaryItem from "./DiaryItem";
import { setDiaryEntries } from "../store/slices/diarySlice";

// Fallback data in case the Redux store is empty
const dummyData = [
    { id: 1, date: new Date().getTime(), emotionId: 2, content: "오늘은 기분 좋았다. React 공부함." },
    { id: 2, date: new Date().getTime() - 86400000, emotionId: 4, content: "어제는 좀 우울했지만 친구 덕분에 괜찮아졌다." },
];

const DiaryList = () => {
    const dispatch = useDispatch();
    const { diaryEntries, loading, error } = useSelector((state) => state.diary);

    useEffect(() => {
        // If diaryEntries is empty, initialize with dummy data
        // In a real application, this would be an API call
        if (diaryEntries.length === 0) {
            dispatch(setDiaryEntries(dummyData));
        }
    }, [dispatch, diaryEntries.length]);

    if (loading) {
        return <div className="DiaryList">Loading diary entries...</div>;
    }

    if (error) {
        return <div className="DiaryList">Error loading diary entries: {error}</div>;
    }

    return (
        <div className="DiaryList">
            {diaryEntries.length === 0 ? (
                <div className="empty-diary">No diary entries yet. Start writing!</div>
            ) : (
                diaryEntries.map((item) => (
                    <DiaryItem
                        key={item.id}
                        id={item.id}
                        emotionId={item.emotionId}
                        date={item.date}
                        content={item.content}
                    />
                ))
            )}
        </div>
    );
};

export default DiaryList;
