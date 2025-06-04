import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TodoItem from "./TodoItem";
import "./TodoList.css";
import { addTodo, toggleTodo, deleteTodo } from "../store/slices/todoSlice";

const TodoList = () => {
    const dispatch = useDispatch();
    const { todoList, loading, error } = useSelector((state) => state.todo);
    const [inputText, setInputText] = useState("");

    const onAdd = () => {
        if (inputText.trim() === "") return;
        dispatch(addTodo(inputText));
        setInputText("");
    };

    const handleToggle = (id) => {
        dispatch(toggleTodo(id));
    };

    const handleDelete = (id) => {
        dispatch(deleteTodo(id));
    };

    if (loading) {
        return <div className="TodoList">Loading todos...</div>;
    }

    if (error) {
        return <div className="TodoList">Error loading todos: {error}</div>;
    }

    return (
        <div className="TodoList">
            <h2>📋 오늘의 할 일</h2>
            <div className="todo-input">
                <input
                    value={inputText}
                    placeholder="할 일을 입력하세요"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') onAdd();
                    }}
                />
                <button onClick={onAdd}>추가</button>
            </div>
            <div className="todo-items">
                {todoList.length === 0 ? (
                    <p className="empty-msg">할 일을 추가해보세요!</p>
                ) : (
                    todoList.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            content={todo.text}
                            isDone={todo.isDone}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoList;
