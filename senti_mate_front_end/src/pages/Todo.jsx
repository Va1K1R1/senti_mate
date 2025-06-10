import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header.jsx";
import TodoList from "../component/TodoList.jsx";
import TodoService from "../services/TodoService";

const Todo = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        TodoService.getAllTodos()
            .then(setTodos)
            .catch(console.error);
    }, []);

    const addTodo = async text => {
        try {
            const newT = await TodoService.createTodo({ text, completed: false });
            setTodos(prev => [...prev, newT]);
        } catch (err) {
            console.error(err);
        }
    };
    const toggleTodo = async id => {
        try {
            const t = todos.find(t => t.id === id);
            const updated = await TodoService.updateTodo(id, { ...t, completed: !t.completed });
            setTodos(prev => prev.map(x => x.id===id?updated:x));
        } catch (err) {
            console.error(err);
        }
    };
    const deleteTodo = async id => {
        try {
            await TodoService.deleteTodo(id);
            setTodos(prev => prev.filter(x => x.id!==id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Header
                title="To do List"
                leftChild={<Link to="/">← 홈으로</Link>}
                rightChild={null}
            />
            <div style={{ padding: 20 }}>
                <TodoList
                    todoList={todos}
                    addTodo={addTodo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
            </div>
        </div>
    );
};

export default Todo;
