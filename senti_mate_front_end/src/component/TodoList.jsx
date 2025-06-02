import React from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

const TodoList = ({ todoList, addTodo, toggleTodo, deleteTodo }) => {
    // input 값을 로컬 변수로 관리(컴포넌트 상태가 아닌 단순 변수 사용)
    let input = "";

    const onAdd = () => {
        if (input.trim() === "") return;
        addTodo(input);
        input = "";
        document.getElementById("todoInput").value = "";
    };

    return (
        <div className="TodoList">
            <h2>오늘의 할 일</h2>
            <div className="todo-input">
                <input
                    id="todoInput"
                    placeholder="할 일을 입력하세요"
                    onChange={(e) => (input = e.target.value)}
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
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoList;
