import React from "react";
import { Link } from "react-router-dom";

import Header from "../component/Header.jsx";
import TodoList from "../component/TodoList.jsx";

const Todo = () => {
    return (
        <div>
            <Header
                title="To do List"
                leftChild={<Link to="/">← 홈으로</Link>}
                rightChild={null}
            />

            <div style={{ padding: "20px" }}>
                <TodoList />
            </div>
        </div>
    );
};

export default Todo;
