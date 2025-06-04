import React from "react";
import ReactMarkdown from "react-markdown";
import "./Viewer.css";

// Emotion data with text and icons
const emotionData = {
    1: { text: "매우 기뻐요", icon: "😄", color: "#27ae60" },
    2: { text: "기뻐요", icon: "🙂", color: "#2ecc71" },
    3: { text: "보통이에요", icon: "😐", color: "#f39c12" },
    4: { text: "슬퍼요", icon: "😔", color: "#e67e22" },
    5: { text: "매우 슬퍼요", icon: "😢", color: "#e74c3c" },
};

/**
 * Enhanced Viewer component with markdown support and emotion icons
 * @param {string} content - Diary entry content (supports markdown)
 * @param {number} emotionId - Emotion ID (1-5)
 * @param {string} date - Date of the diary entry
 */
const Viewer = ({ content, emotionId, date }) => {
    const emotion = emotionData[emotionId] || { text: "알 수 없음", icon: "❓", color: "#95a5a6" };

    // Format date if provided
    const formattedDate = date ? new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }) : null;

    return (
        <div className="Viewer">
            <div className="viewer-header">
                <h2>내 감정 기록</h2>
                {formattedDate && <p className="viewer-date">{formattedDate}</p>}
            </div>

            <div 
                className="emotion-badge"
                style={{ backgroundColor: `${emotion.color}20`, color: emotion.color }}
            >
                <span className="emotion-icon">{emotion.icon}</span>
                <span className="emotion-text">{emotion.text}</span>
            </div>

            <div className="content-container">
                <ReactMarkdown className="markdown-content">
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Viewer;
