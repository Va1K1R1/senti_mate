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
        text: action.payload,
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

export const { addTodo, toggleTodo, deleteTodo, setTodoList, setLoading, setError } = todoSlice.actions;

export default todoSlice.reducer;