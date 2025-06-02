import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home.jsx";
import Diary from "./pages/Diary.jsx";
import Todo from "./pages/Todo.jsx";

function App() {
    // --------------------------------------------------------
    // TodoList 전역 상태 관리 (Home / Todo 두 화면에서 공유)
    // --------------------------------------------------------
    const [todoList, setTodoList] = useState([]);

    const addTodo = (text) => {
        const newTodo = {
            id: Date.now(),
            text,
            isDone: false,
        };
        setTodoList([newTodo, ...todoList]);
    };

    const toggleTodo = (id) => {
        setTodoList(
            todoList.map((todo) =>
                todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodoList(todoList.filter((todo) => todo.id !== id));
    };

    // --------------------------------------------------------
    // 라우팅 설정: /   → Home (감정일기 + Todo 통합)
    //             /diary → Diary (감정일기 전용 상세 뷰)
    //             /todo  → Todo (Todo 전용 뷰)
    // --------------------------------------------------------
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Home
                        todoList={todoList}
                        addTodo={addTodo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                }
            />
            <Route path="/diary" element={<Diary />} />
            <Route
                path="/todo"
                element={
                    <Todo
                        todoList={todoList}
                        addTodo={addTodo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                }
            />
        </Routes>
    );
}

export default App;
