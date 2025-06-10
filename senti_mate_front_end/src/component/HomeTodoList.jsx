import React from "react";
import "./HomeTodoList.css";

const pastelColors = [
    "#fffcb8", // 노랑
    "#ffd5ec", // 핑크
    "#c5f6f7", // 민트
    "#e0caff", // 연보라
    "#ffeaa7", // 살구
    "#dcedc8", // 연초록
    "#ffe2b3", // 연주황
];

const HomeTodoList = ({ todoList, toggleTodo }) => {
    return (
        <div className="HomeTodoList">
            <h2>📋 오늘의 할 일</h2>
            <div className="postit-container">
                {todoList.length === 0 ? (
                    <p className="empty-msg">할 일이 없어요!</p>
                ) : (
                    todoList.map((todo, index) => {
                        const color = pastelColors[index % pastelColors.length]; // 순환적으로 색 적용
                        return (
                            <div
                                key={todo.id}
                                className={`postit ${todo.isDone ? "done" : ""}`}
                                onClick={() => toggleTodo(todo.id)}
                                style={{ backgroundColor: todo.isDone ? "#e0ffc2" : color }}
                            >
                                {todo.isDone && (
                                    <div className="done-overlay">✓complete!</div>
                                )}
                                <span>· {todo.text}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HomeTodoList;
