import React from "react";
import "./TodoItem.css";

const TodoItem = ({ id, content, isDone, onToggle, onDelete }) => {
    return (
        <div className={`TodoItem ${isDone ? "done" : ""}`}>
            <input
                type="checkbox"
                checked={isDone}
                onChange={() => onToggle(id)}
            />
            <span>{content}</span>
            <button className="delete-btn" onClick={() => onDelete(id)}>
                삭제
            </button>
        </div>
    );
};

export default TodoItem;
