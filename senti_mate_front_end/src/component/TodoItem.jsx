import React, { useState } from "react";
import "./TodoItem.css";

// Category icons mapping with descriptions
const categoryIcons = {
    work: { icon: "💼", label: "업무" },
    personal: { icon: "👤", label: "개인" },
    health: { icon: "💪", label: "건강" },
    study: { icon: "📚", label: "공부" },
    other: { icon: "📌", label: "기타" }
};

// Priority indicators with descriptions
const priorityLabels = {
    0: { label: "", description: "우선순위 없음" },
    1: { label: "낮음", description: "낮은 우선순위", icon: "🟢" },
    2: { label: "중간", description: "중간 우선순위", icon: "🟠" },
    3: { label: "높음", description: "높은 우선순위", icon: "🔴" }
};

/**
 * Enhanced TodoItem component with support for categories, priorities, due dates, and editing
 * @param {string} id - Todo item ID
 * @param {string} content - Todo item content
 * @param {boolean} isDone - Whether the todo item is completed
 * @param {string} category - Todo item category
 * @param {number} priority - Todo item priority (0-3)
 * @param {string} dueDate - Todo item due date (optional)
 * @param {function} onToggle - Function to toggle completion status
 * @param {function} onDelete - Function to delete the todo item
 * @param {function} onEdit - Function to edit the todo item (optional)
 * @returns {JSX.Element} The rendered TodoItem component
 */
const TodoItem = ({ 
    id, 
    content = "", 
    isDone = false, 
    category = "other", 
    priority = 0, 
    dueDate = null,
    onToggle, 
    onDelete,
    onEdit 
}) => {
    // State for editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    // Get category icon and label
    const categoryInfo = categoryIcons[category] || categoryIcons.other;

    // Get priority info
    const priorityInfo = priorityLabels[priority] || priorityLabels[0];

    // Handle edit button click
    const handleEditClick = () => {
        if (!isDone) { // Only allow editing for incomplete todos
            setIsEditing(true);
        }
    };

    // Handle save button click
    const handleSaveClick = () => {
        if (editedContent.trim() !== "") {
            if (onEdit) {
                onEdit(id, editedContent);
            }
            setIsEditing(false);
        }
    };

    // Handle cancel button click
    const handleCancelClick = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    // Handle key press in edit input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveClick();
        } else if (e.key === 'Escape') {
            handleCancelClick();
        }
    };

    return (
        <div className={`TodoItem ${isDone ? "done" : ""} priority-${priority}`}>
            <div className="TodoItem-left">
                <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggle(id)}
                    className="todo-checkbox"
                    aria-label={`Mark "${content}" as ${isDone ? "incomplete" : "complete"}`}
                />
                <div className="todo-content">
                    {isEditing ? (
                        <div className="todo-edit">
                            <input
                                type="text"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="todo-edit-input"
                                autoFocus
                                aria-label="Edit todo content"
                            />
                            <div className="todo-edit-buttons">
                                <button 
                                    onClick={handleSaveClick}
                                    className="todo-save-btn"
                                    aria-label="Save changes"
                                    title="Save changes"
                                >
                                    저장
                                </button>
                                <button 
                                    onClick={handleCancelClick}
                                    className="todo-cancel-btn"
                                    aria-label="Cancel editing"
                                    title="Cancel editing"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span 
                                className="todo-text"
                                onDoubleClick={handleEditClick}
                                title={isDone ? "Completed task" : "Double-click to edit"}
                            >
                                {content}
                            </span>
                            <div className="todo-meta">
                                {category && (
                                    <span 
                                        className={`todo-category category-${category}`}
                                        title={`Category: ${categoryInfo.label}`}
                                    >
                                        {categoryInfo.icon} {categoryInfo.label}
                                    </span>
                                )}
                                {priority > 0 && (
                                    <span 
                                        className={`todo-priority priority-${priority}`}
                                        title={priorityInfo.description}
                                    >
                                        {priorityInfo.icon} {priorityInfo.label}
                                    </span>
                                )}
                                {dueDate && (
                                    <span 
                                        className="todo-due-date"
                                        title={`Due date: ${new Date(dueDate).toLocaleDateString()}`}
                                    >
                                        📅 {new Date(dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="TodoItem-actions">
                {!isEditing && !isDone && onEdit && (
                    <button 
                        className="edit-btn" 
                        onClick={handleEditClick}
                        aria-label="Edit todo"
                        title="Edit todo"
                    >
                        수정
                    </button>
                )}
                <button 
                    className="delete-btn" 
                    onClick={() => onDelete(id)}
                    aria-label="Delete todo"
                    title="Delete todo"
                >
                    삭제
                </button>
            </div>
        </div>
    );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(TodoItem, (prevProps, nextProps) => {
    // Only re-render if any of these props change
    return (
        prevProps.id === nextProps.id &&
        prevProps.content === nextProps.content &&
        prevProps.isDone === nextProps.isDone &&
        prevProps.category === nextProps.category &&
        prevProps.priority === nextProps.priority &&
        prevProps.dueDate === nextProps.dueDate
    );
});
