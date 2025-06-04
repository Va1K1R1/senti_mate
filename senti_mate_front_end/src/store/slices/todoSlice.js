import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todoList: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload.text || action.payload,
        category: action.payload.category || "other",
        priority: action.payload.priority || 0,
        dueDate: action.payload.dueDate || null,
        isDone: false,
      };
      state.todoList = [newTodo, ...state.todoList];
    },
    toggleTodo: (state, action) => {
      state.todoList = state.todoList.map((todo) =>
        todo.id === action.payload ? { ...todo, isDone: !todo.isDone } : todo
      );
    },
    deleteTodo: (state, action) => {
      state.todoList = state.todoList.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action) => {
      state.todoList = state.todoList.map((todo) =>
        todo.id === action.payload.id 
          ? { ...todo, text: action.payload.text }
          : todo
      );
    },
    toggleAllTodos: (state) => {
      // If all todos are done, mark all as not done
      // Otherwise, mark all as done
      const allDone = state.todoList.every(todo => todo.isDone);
      state.todoList = state.todoList.map(todo => ({
        ...todo,
        isDone: !allDone
      }));
    },
    deleteCompletedTodos: (state) => {
      state.todoList = state.todoList.filter(todo => !todo.isDone);
    },
    clearAllTodos: (state) => {
      state.todoList = [];
    },
    setTodoList: (state, action) => {
      state.todoList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  editTodo, 
  toggleAllTodos, 
  deleteCompletedTodos, 
  clearAllTodos,
  setTodoList, 
  setLoading, 
  setError 
} = todoSlice.actions;

export default todoSlice.reducer;
