import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import './DiaryList.css';
import DiaryItem from "./DiaryItem";
import Button from "./Button";
import { setDiaryEntries } from "../store/slices/diarySlice";

// Fallback data in case the Redux store is empty
const dummyData = [
    { id: 1, date: new Date().getTime(), emotionId: 2, content: "오늘은 기분 좋았다. React 공부함." },
    { id: 2, date: new Date().getTime() - 86400000, emotionId: 4, content: "어제는 좀 우울했지만 친구 덕분에 괜찮아졌다." },
    { id: 3, date: new Date().getTime() - 172800000, emotionId: 1, content: "그저께는 정말 행복했다. 가족과 함께 시간을 보냈다." },
    { id: 4, date: new Date().getTime() - 259200000, emotionId: 3, content: "그저께 전날은 평범했다. 특별한 일은 없었다." },
];

// Emotion filter options
const emotionFilterOptions = [
    { value: 0, text: "모든 감정" },
    { value: 1, text: "매우 기뻐요" },
    { value: 2, text: "기뻐요" },
    { value: 3, text: "보통이에요" },
    { value: 4, text: "슬퍼요" },
    { value: 5, text: "매우 슬퍼요" },
];

// Sort options
const sortOptions = [
    { value: "latest", text: "최신순" },
    { value: "oldest", text: "오래된순" },
];


/**
 * Enhanced DiaryList component with filtering, sorting, and date range capabilities
 */
const DiaryList = () => {
    const dispatch = useDispatch();
    const { diaryEntries, loading, error } = useSelector((state) => state.diary);

    // State for filters and sorting
    const [emotionFilter, setEmotionFilter] = useState(0); // 0 means all emotions
    const [sortType, setSortType] = useState("latest");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isDateRangeActive, setIsDateRangeActive] = useState(false);
    const [filteredAndSortedEntries, setFilteredAndSortedEntries] = useState([]);

    useEffect(() => {
        // If diaryEntries is empty, initialize with dummy data
        // In a real application, this would be an API call
        if (diaryEntries.length === 0) {
            dispatch(setDiaryEntries(dummyData));
        }
    }, [dispatch, diaryEntries.length]);

    // Apply filters and sorting whenever dependencies change
    const processedEntries = useMemo(() => {
        let result = [...diaryEntries];

        // Apply emotion filter
        if (emotionFilter !== 0) {
            result = result.filter(item => item.emotionId === emotionFilter);
        }

        // Apply date range filter
        if (isDateRangeActive) {
            if (startDate) {
                const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
                result = result.filter(item => item.date >= startTimestamp);
            }

            if (endDate) {
                const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
                result = result.filter(item => item.date <= endTimestamp);
            }
        }

        // Apply search filter
        if (searchText.trim() !== "") {
            const searchLower = searchText.toLowerCase();
            result = result.filter(item => 
                item.content.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortType === "latest") {
                return b.date - a.date;
            } else {
                return a.date - b.date;
            }
        });

        return result;
    }, [diaryEntries, emotionFilter, sortType, startDate, endDate, isDateRangeActive, searchText]);

    // Update filtered entries when processed entries change
    useEffect(() => {
        setFilteredAndSortedEntries(processedEntries);
    }, [processedEntries]);

    // Handle emotion filter change
    const handleEmotionFilterChange = (e) => {
        setEmotionFilter(Number(e.target.value));
    };

    // Handle sort type change
    const handleSortTypeChange = (e) => {
        setSortType(e.target.value);
    };

    // Handle date range toggle
    const toggleDateRange = () => {
        setIsDateRangeActive(!isDateRangeActive);
    };

    // Reset all filters
    const resetFilters = () => {
        setEmotionFilter(0);
        setSortType("latest");
        setStartDate("");
        setEndDate("");
        setSearchText("");
        setIsDateRangeActive(false);
    };

    if (loading) {
        return <div className="DiaryList">Loading diary entries...</div>;
    }

    if (error) {
        return <div className="DiaryList">Error loading diary entries: {error}</div>;
    }

    return (
        <div className="DiaryList">
            <div className="DiaryList_search">
                <input
                    type="text"
                    placeholder="일기 내용 검색..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="DiaryList_controls">
                <div className="DiaryList_filters">
                    <select 
                        value={emotionFilter} 
                        onChange={handleEmotionFilterChange}
                        className="emotion-filter"
                    >
                        {emotionFilterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={sortType} 
                        onChange={handleSortTypeChange}
                        className="sort-type"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>

                    <Button 
                        text={isDateRangeActive ? "날짜 범위 숨기기" : "날짜 범위 표시"} 
                        onClick={toggleDateRange}
                        type="default"
                        size="small"
                        className="date-range-toggle-btn"
                    />
                </div>

                <Button 
                    text="필터 초기화" 
                    onClick={resetFilters}
                    type="default"
                    className="reset-filters-btn"
                />
            </div>

            {isDateRangeActive && (
                <div className="DiaryList_date_range">
                    <div className="date-range-inputs">
                        <div className="date-input-group">
                            <label htmlFor="start-date">시작 날짜:</label>
                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || undefined}
                            />
                        </div>
                        <div className="date-input-group">
                            <label htmlFor="end-date">종료 날짜:</label>
                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                            />
                        </div>
                    </div>
                </div>
            )}

            {filteredAndSortedEntries.length === 0 ? (
                <div className="empty-diary">
                    {(emotionFilter !== 0 || isDateRangeActive || searchText.trim() !== "")
                        ? "필터 조건에 맞는 일기가 없습니다." 
                        : "일기가 없습니다. 새 일기를 작성해보세요!"}
                </div>
            ) : (
                <>
                    <div className="DiaryList_count">
                        총 {filteredAndSortedEntries.length}개의 일기
                    </div>
                    <div className="DiaryList_items">
                        {filteredAndSortedEntries.map((item) => (
                            <DiaryItem
                                key={item.id}
                                id={item.id}
                                emotionId={item.emotionId}
                                date={item.date}
                                content={item.content}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DiaryList;
