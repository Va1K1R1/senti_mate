// App.jsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector, useDispatch } from "react-redux";

import Home from "./pages/Home.jsx";
import Diary from "./pages/Diary.jsx";
import New from "./pages/New.jsx";
import Edit from "./pages/Edit.jsx";
import Todo from "./pages/Todo.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import HealthData from "./pages/HealthData.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Emotions from "./pages/Emotions.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import ThemeToggle from "./component/ThemeToggle.jsx";

import store from "./store/store";
import { addTodo, toggleTodo, deleteTodo } from "./store/slices/todoSlice";
import { ThemeProvider } from "./styles/theme.jsx";
import DiaryPage from "./component/DiaryPage.jsx";

function AppContent() {
    const todoList = useSelector((state) => state.todo.todoList);
    const dispatch = useDispatch();

    const handleAddTodo = (text) => {
        dispatch(addTodo(text));
    };

    const handleToggleTodo = (id) => {
        dispatch(toggleTodo(id));
    };

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id));
    };

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            todoList={todoList}
                            addTodo={handleAddTodo}
                            toggleTodo={handleToggleTodo}
                            deleteTodo={handleDeleteTodo}
                        />
                    }
                />
                <Route
                    path="/diary/:id"
                    element={
                        <Diary
                            />} />
                <Route path="/diarypage" element={<DiaryPage />} />
                <Route path="/diary/edit/:id" element={<Edit />} />
                <Route
                    path="/todo"
                    element={
                        <Todo
                            todoList={todoList}
                            addTodo={handleAddTodo}
                            toggleTodo={handleToggleTodo}
                            deleteTodo={handleDeleteTodo}
                        />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/health-data" element={<HealthData />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/emotions" element={<Emotions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <ThemeToggle />
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Provider store={store}>
                <AppContent />
            </Provider>
        </ThemeProvider>
    );
}

export default App;
