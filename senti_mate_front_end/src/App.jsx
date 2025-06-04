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
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ThemeToggle from "./component/ThemeToggle.jsx";

import store from "./store/store";
import { addTodo, toggleTodo, deleteTodo } from "./store/slices/todoSlice";
import { ThemeProvider } from "./styles/theme.jsx";

function AppContent() {
    // Use Redux for state management
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

    // --------------------------------------------------------
    // Routing Configuration:
    // /                → Home (Diary + Todo integrated view)
    // /dashboard       → Dashboard (Comprehensive health view)
    // /diary/:id       → Diary (Detailed view for a specific diary entry)
    // /diary/new       → New (Create a new diary entry)
    // /diary/edit/:id  → Edit (Edit an existing diary entry)
    // /todo            → Todo (Dedicated todo management view)
    // /login           → Login (User authentication)
    // /register        → Register (User registration)
    // /forgot-password → ForgotPassword (Password recovery)
    // /health-data     → HealthData (Samsung Health integration)
    // /recommendations → Recommendations (ChatGPT recommendations)
    // /emotions        → Emotions (Emotion tracking and analysis)
    // /settings        → Settings (Application settings)
    // /profile         → Profile (User profile information)
    // /error           → ErrorPage (General error handling)
    // *                → NotFound (404 page for non-existent routes)
    // --------------------------------------------------------
    return (
        <>
            <Routes>
                {/* Home route */}
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

                {/* Dashboard route */}
                <Route
                    path="/dashboard"
                    element={
                        <Dashboard
                            todoList={todoList}
                            addTodo={handleAddTodo}
                            toggleTodo={handleToggleTodo}
                            deleteTodo={handleDeleteTodo}
                        />
                    }
                />

                {/* Diary routes */}
                <Route path="/diary/:id" element={<Diary />} />
                <Route path="/diary/new" element={<New />} />
                <Route path="/diary/edit/:id" element={<Edit />} />

                {/* Todo route */}
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

                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Health data and analysis routes */}
                <Route path="/health-data" element={<HealthData />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/emotions" element={<Emotions />} />

                {/* User settings and profile routes */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />

                {/* Error handling routes */}
                <Route path="/error" element={<ErrorPage />} />

                {/* 404 route - must be last */}
                <Route path="*" element={<NotFound />} />
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
