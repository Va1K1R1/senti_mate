import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import TodoItem from "./TodoItem";
import Button from "./Button";
import Modal from "./Modal";
import "./TodoList.css";
import { addTodo, toggleTodo, deleteTodo, toggleAllTodos, deleteCompletedTodos, editTodo, clearAllTodos } from "../store/slices/todoSlice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

// Category options
const categoryOptions = [
    { value: "all", label: "모든 카테고리" },
    { value: "work", label: "업무" },
    { value: "personal", label: "개인" },
    { value: "health", label: "건강" },
    { value: "study", label: "공부" },
    { value: "other", label: "기타" }
];

// Priority options
const priorityOptions = [
    { value: 0, label: "우선순위 없음" },
    { value: 1, label: "낮음" },
    { value: 2, label: "중간" },
    { value: 3, label: "높음" }
];

/**
 * Enhanced TodoList component with support for categories and priorities
 */
const TodoList = () => {
    const dispatch = useDispatch();
    const { todoList, loading, error } = useSelector((state) => state.todo);

    // State for input fields
    const [inputText, setInputText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("other");
    const [selectedPriority, setSelectedPriority] = useState(0);
    const [dueDate, setDueDate] = useState("");

    // State for filters
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState(0);
    const [showCompleted, setShowCompleted] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [sortBy, setSortBy] = useState("default"); // default, dueDate, priority, alphabetical

    // State for filtered todos
    const [filteredTodos, setFilteredTodos] = useState([]);

    // Use memoization for filtered todos to optimize performance
    const filteredTodosMemo = useMemo(() => {
        let result = [...todoList];

        // Filter by category
        if (categoryFilter !== "all") {
            result = result.filter(todo => todo.category === categoryFilter);
        }

        // Filter by priority
        if (priorityFilter !== 0) {
            result = result.filter(todo => todo.priority >= priorityFilter);
        }

        // Filter by completion status
        if (!showCompleted) {
            result = result.filter(todo => !todo.isDone);
        }

        // Filter by search text
        if (searchText.trim() !== "") {
            const searchLower = searchText.toLowerCase();
            result = result.filter(todo => 
                todo.text.toLowerCase().includes(searchLower)
            );
        }

        // Sort based on selected sort criteria
        result.sort((a, b) => {
            // First sort by completion status
            if (a.isDone !== b.isDone) {
                return a.isDone ? 1 : -1;
            }

            // Then sort based on selected criteria
            switch (sortBy) {
                case "dueDate":
                    // Sort by due date (earliest first)
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    // Items with due dates come before those without
                    if (a.dueDate && !b.dueDate) return -1;
                    if (!a.dueDate && b.dueDate) return 1;
                    // If no due dates, fall back to priority
                    return b.priority - a.priority;

                case "priority":
                    // Sort by priority (highest first)
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority;
                    }
                    // If same priority, sort by due date
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    if (a.dueDate && !b.dueDate) return -1;
                    if (!a.dueDate && b.dueDate) return 1;
                    return 0;

                case "alphabetical":
                    // Sort alphabetically by text
                    return a.text.localeCompare(b.text);

                case "default":
                default:
                    // Default sorting: priority then due date
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority;
                    }
                    if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    }
                    if (a.dueDate && !b.dueDate) return -1;
                    if (!a.dueDate && b.dueDate) return 1;
                    return 0;
            }
        });

        return result;
    }, [todoList, categoryFilter, priorityFilter, showCompleted, searchText, sortBy]);

    // Update filteredTodos state when memoized value changes
    useEffect(() => {
        setFilteredTodos(filteredTodosMemo);
    }, [filteredTodosMemo]);

    const onAdd = () => {
        if (inputText.trim() === "") return;

        dispatch(addTodo({
            text: inputText,
            category: selectedCategory,
            priority: selectedPriority,
            dueDate: dueDate || null
        }));

        setInputText("");
        setDueDate("");
    };

    const handleToggle = useCallback((id) => {
        dispatch(toggleTodo(id));
    }, [dispatch]);

    // State for confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [showDeleteCompletedModal, setShowDeleteCompletedModal] = useState(false);

    // Reference for the delete button to restore focus after modal closes
    const deleteButtonRef = useRef(null);

    const handleEdit = useCallback((id, newText) => {
        dispatch(editTodo({ id, text: newText }));
    }, [dispatch]);

    const handleDelete = useCallback((id) => {
        setTodoToDelete(id);
        setShowDeleteModal(true);
    }, []);

    const confirmDelete = () => {
        if (todoToDelete) {
            dispatch(deleteTodo(todoToDelete));
            setTodoToDelete(null);
        }
        setShowDeleteModal(false);
        // Restore focus to the delete button
        if (deleteButtonRef.current) {
            deleteButtonRef.current.focus();
        }
    };

    const cancelDelete = () => {
        setTodoToDelete(null);
        setShowDeleteModal(false);
        // Restore focus to the delete button
        if (deleteButtonRef.current) {
            deleteButtonRef.current.focus();
        }
    };

    const handleToggleAll = () => {
        dispatch(toggleAllTodos());
    };

    const handleDeleteCompleted = () => {
        setShowDeleteCompletedModal(true);
    };

    // State for clear all confirmation modal
    const [showClearAllModal, setShowClearAllModal] = useState(false);

    const handleClearAll = () => {
        setShowClearAllModal(true);
    };

    const confirmClearAll = () => {
        dispatch(clearAllTodos());
        setShowClearAllModal(false);
    };

    const cancelClearAll = () => {
        setShowClearAllModal(false);
    };

    const confirmDeleteCompleted = () => {
        dispatch(deleteCompletedTodos());
        setShowDeleteCompletedModal(false);
    };

    const cancelDeleteCompleted = () => {
        setShowDeleteCompletedModal(false);
    };

    const resetFilters = () => {
        setCategoryFilter("all");
        setPriorityFilter(0);
        setShowCompleted(true);
        setSearchText("");
        setSortBy("default");
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

            {/* Todo input form */}
            <div className="todo-input-container">
                <div className="todo-input">
                    <input
                        value={inputText}
                        placeholder="할 일을 입력하세요"
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') onAdd();
                        }}
                        aria-label="할 일 입력"
                    />
                    <button onClick={onAdd} aria-label="할 일 추가">추가</button>
                </div>

                <div className="todo-options">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                        aria-label="카테고리 선택"
                    >
                        {categoryOptions.filter(option => option.value !== "all").map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(Number(e.target.value))}
                        className="priority-select"
                        aria-label="우선순위 선택"
                    >
                        {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="due-date-input"
                        aria-label="마감일 선택"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="todo-filters">
                <div className="search-container">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="할 일 검색..."
                        className="search-input"
                        aria-label="할 일 검색"
                    />
                </div>

                <div className="filter-controls">
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-filter"
                        aria-label="카테고리 필터"
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(Number(e.target.value))}
                        className="priority-filter"
                        aria-label="우선순위 필터"
                    >
                        <option value={0}>모든 우선순위</option>
                        {priorityOptions.filter(option => option.value > 0).map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label} 이상
                            </option>
                        ))}
                    </select>

                    <label className="show-completed-label">
                        <input 
                            type="checkbox" 
                            checked={showCompleted}
                            onChange={(e) => setShowCompleted(e.target.checked)}
                            aria-label="완료된 항목 표시 여부"
                        />
                        완료된 항목 표시
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                        aria-label="정렬 기준"
                    >
                        <option value="default">기본 정렬</option>
                        <option value="dueDate">마감일순</option>
                        <option value="priority">우선순위순</option>
                        <option value="alphabetical">가나다순</option>
                    </select>
                </div>

                <Button 
                    text="필터 초기화" 
                    onClick={resetFilters}
                    type="default"
                    className="reset-filters-btn"
                />
            </div>

            {/* Todo count and batch actions */}
            <div className="todo-header">
                <div className="todo-count">
                    총 {filteredTodos.length}개의 할 일
                    {!showCompleted && todoList.filter(todo => todo.isDone).length > 0 && 
                        ` (${todoList.filter(todo => todo.isDone).length}개 완료 항목 숨김)`
                    }
                </div>

                <div className="batch-actions">
                    <Button 
                        text="모두 완료/미완료" 
                        onClick={handleToggleAll}
                        type="default"
                        className="toggle-all-btn"
                        disabled={todoList.length === 0}
                        aria-label="모든 할 일 완료/미완료 상태 전환"
                    />
                    <Button 
                        text="완료 항목 삭제" 
                        onClick={handleDeleteCompleted}
                        type="negative"
                        className="delete-completed-btn"
                        disabled={todoList.filter(todo => todo.isDone).length === 0}
                        aria-label="완료된 할 일 모두 삭제"
                    />
                    <Button 
                        text="모두 삭제" 
                        onClick={handleClearAll}
                        type="negative"
                        className="clear-all-btn"
                        disabled={todoList.length === 0}
                        aria-label="모든 할 일 삭제"
                    />
                </div>
            </div>

            {/* Todo items */}
            <div className="todo-items">
                {filteredTodos.length === 0 ? (
                    <p className="empty-msg">
                        {todoList.length === 0 
                            ? "할 일을 추가해보세요!" 
                            : "필터에 맞는 할 일이 없습니다."}
                    </p>
                ) : (
                    filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            content={todo.text}
                            isDone={todo.isDone}
                            category={todo.category}
                            priority={todo.priority}
                            dueDate={todo.dueDate}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <Modal
                    title="할 일 삭제"
                    content="이 할 일을 삭제하시겠습니까?"
                    confirmText="삭제"
                    cancelText="취소"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    type="warning"
                />
            )}

            {/* Delete completed confirmation modal */}
            {showDeleteCompletedModal && (
                <Modal
                    title="완료된 할 일 삭제"
                    content="완료된 모든 할 일을 삭제하시겠습니까?"
                    confirmText="삭제"
                    cancelText="취소"
                    onConfirm={confirmDeleteCompleted}
                    onCancel={cancelDeleteCompleted}
                    type="warning"
                />
            )}

            {/* Clear all confirmation modal */}
            {showClearAllModal && (
                <Modal
                    title="모든 할 일 삭제"
                    content="모든 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                    confirmText="삭제"
                    cancelText="취소"
                    onConfirm={confirmClearAll}
                    onCancel={cancelClearAll}
                    type="danger"
                />
            )}
        </div>
    );
};

export default TodoList;
