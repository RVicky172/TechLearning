import type { TopicNode } from "@/data/types";

export const reduxToolkit: TopicNode = {
  id: "react-redux-toolkit",
  title: "Redux & Redux Toolkit",
  iconName: "Box",
  link: "https://redux-toolkit.js.org/",
  theory:
    "Redux is a predictable state container for JavaScript apps. Redux Toolkit (RTK) is the official, opinionated toolset that simplifies Redux with sensible defaults — createSlice for reducers, configureStore for setup, and RTK Query for data fetching. It eliminates the boilerplate that made classic Redux painful while keeping its powerful debugging and middleware ecosystem.",
  theoryDetail: {
    keyConcepts: [
      "Store: single source of truth — the entire app state lives in one object tree",
      "Actions: plain objects describing 'what happened' — { type: 'counter/increment', payload: 5 }",
      "Reducers: pure functions (state, action) → newState — they describe how state changes in response to actions",
      "createSlice() auto-generates action creators and action types from reducer functions — eliminates boilerplate",
      "configureStore() sets up the store with good defaults — Redux DevTools, thunk middleware, and serialization checks",
      "useSelector(selector) reads state, useDispatch() sends actions — these replace connect() from class components",
      "RTK Query (createApi) handles data fetching with automatic caching, invalidation, and loading states",
      "Immer is built into RTK — you can write 'mutating' code in reducers and it creates immutable updates automatically",
    ],
    whyItMatters:
      "Redux is the most widely used state management in production React apps. It provides time-travel debugging, middleware for side effects, and a strict unidirectional data flow that makes complex state predictable. Redux Toolkit made Redux practical by cutting 80% of the boilerplate. Understanding Redux is essential for enterprise React work and most job interviews.",
    commonPitfalls: [
      "Using classic Redux (createStore, switch/case reducers, manual action creators) instead of Redux Toolkit — RTK is the standard",
      "Putting ALL state in Redux — local component state (form inputs, modals) should stay in useState",
      "Not using selectors — subscribing to the entire store causes unnecessary re-renders",
      "Mutating state outside of createSlice reducers — Immer only works inside RTK's createSlice/createReducer",
      "Overusing Redux for server state — RTK Query or TanStack Query handle API data better than manual Redux thunks",
      "Not installing Redux DevTools — you lose the most powerful feature (time-travel debugging, action logging)",
    ],
    examples: [
      {
        title: "Store Setup with configureStore",
        description:
          "One-time setup: create the store, type the hooks, and wrap the app with Provider.",
        code: `// ── store/store.ts ──
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import todosReducer from './todosSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    auth: authReducer,
  },
  // RTK adds these by default:
  // - Redux Thunk middleware (for async actions)
  // - Redux DevTools extension
  // - Serialization check middleware (dev only)
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── store/hooks.ts ── Pre-typed hooks
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// ── app/layout.tsx ── Wrap app with Provider
import { Provider } from 'react-redux';
import { store } from './store/store';

function App({ children }) {
  return <Provider store={store}>{children}</Provider>;
}`,
        language: "tsx",
      },
      {
        title: "createSlice — Reducer + Actions in One",
        description:
          "createSlice generates action creators and types automatically. Immer lets you write mutable-looking code that produces immutable updates.",
        code: `import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodosState = { items: [], filter: 'all' };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      // ✅ Looks like mutation, but Immer makes it immutable
      state.items.push({
        id: crypto.randomUUID(),
        text: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<TodosState['filter']>) => {
      state.filter = action.payload;
    },
  },
});

// Auto-generated action creators
export const { addTodo, toggleTodo, removeTodo, setFilter } = todosSlice.actions;

// Selectors — reusable state access functions
export const selectFilteredTodos = (state: { todos: TodosState }) => {
  const { items, filter } = state.todos;
  switch (filter) {
    case 'active':    return items.filter(t => !t.completed);
    case 'completed': return items.filter(t => t.completed);
    default:          return items;
  }
};

export default todosSlice.reducer;`,
        language: "typescript",
      },
      {
        title: "Using Redux in Components",
        description:
          "Components read state with useAppSelector and dispatch actions with useAppDispatch. Always use selectors to prevent unnecessary re-renders.",
        code: `import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTodo, toggleTodo, removeTodo, selectFilteredTodos } from '../store/todosSlice';

function AddTodo() {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </label>
          <button onClick={() => dispatch(removeTodo(todo.id))}>×</button>
        </li>
      ))}
    </ul>
  );
}`,
        language: "tsx",
      },
      {
        title: "Async Thunks & RTK Query",
        description:
          "createAsyncThunk for manual async logic, or RTK Query for auto-generated hooks with caching.",
        code: `// ── Option 1: createAsyncThunk (manual control) ──
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    const res = await fetch('/api/users');
    if (!res.ok) return rejectWithValue('Failed to fetch');
    return res.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.status = 'ok'; s.items = a.payload; })
      .addCase(fetchUsers.rejected, (s, a) => { s.status = 'error'; s.error = a.payload; });
  },
});

// ── Option 2: RTK Query (recommended for most cases) ──
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => '/posts', providesTags: ['Post'] }),
    createPost: builder.mutation({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Post'],  // Auto-refetch posts after creating
    }),
  }),
});

// Auto-generated hooks!
export const { useGetPostsQuery, useCreatePostMutation } = postsApi;

// Usage: const { data, isLoading, error } = useGetPostsQuery();
// No useState, no useEffect, no manual caching — all automatic`,
        language: "tsx",
      },
    ],
  },
};
