import React from "react";
import "./DiaryItem.css";
import { Link } from "react-router-dom";

/**
 * DiaryItem component for displaying individual diary entries
 * @param {number} id - The unique identifier of the diary entry
 * @param {number} emotionId - The emotion ID associated with the diary entry (1-5)
 * @param {number} date - The timestamp of the diary entry
 * @param {string} content - The content of the diary entry
 * @returns {JSX.Element} The rendered DiaryItem component
 */
const DiaryItem = ({ id, emotionId, date, content = "" }) => {
    // Map emotion IDs to emojis
    const emotionEmojiMap = {
        1: "😁", // Very happy
        2: "🙂", // Happy
        3: "😐", // Neutral
        4: "😢", // Sad
        5: "😭", // Very sad
    };

    // Get the appropriate emoji or fallback to a default
    const emoji = emotionEmojiMap[emotionId] || "❓";

    // Format the date consistently
    const formatDate = (timestamp) => {
        try {
            return new Date(timestamp).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "날짜 없음";
        }
    };

    // Truncate content at word boundaries
    const truncateContent = (text, maxLength = 25) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;

        // Find the last space within the maxLength
        const lastSpace = text.substring(0, maxLength).lastIndexOf(" ");

        // If no space found, just cut at maxLength
        const truncated = lastSpace > 0 ? text.substring(0, lastSpace) : text.substring(0, maxLength);

        return truncated + "...";
    };

    return (
        <div className="DiaryItem">
            <Link to={`/diary/${id}`}>
                <div className="info">
                    <span className="emotion-emoji" title={`Emotion level: ${emotionId}`}>{emoji}</span>
                    <span className="diary-date">{formatDate(date)}</span>
                </div>
                <div className="content">{truncateContent(content)}</div>
            </Link>
        </div>
    );
};

export default DiaryItem;
