import type { TopicNode } from "@/data/types";

export const reduxToolkit: TopicNode = {
  id: "redux-toolkit",
  title: "Redux Toolkit (RTK)",
  iconName: "Package",
  children: [
    {
      id: "rtk-create-slice",
      title: "createSlice",
      theory:
        "createSlice generates action creators and action type strings from a reducer map, eliminating all Redux boilerplate. Each key in `reducers` becomes both a reducer case and an auto-generated action creator.",
      theoryDetail: {
        keyConcepts: [
          "`name` — prefix for all generated action types, e.g. `'cart/addItem'`",
          "`initialState` — the default state value used before any action is dispatched",
          "`reducers` — map of Immer-powered case reducer functions",
          "Exports `actions` (action creators) and `reducer` (the slice reducer function)",
        ],
        commonPitfalls: [
          "Forgetting to add the slice reducer to `configureStore`'s reducer map",
          "Importing actions from the wrong slice file",
          "Placing async logic inside slice reducers — use `createAsyncThunk` instead",
        ],
        examples: [
          {
            title: "Cart slice",
            description: "Full createSlice example with typed state and PayloadAction.",
            code: `import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem { id: string; qty: number; }
interface CartState { items: CartItem[]; }

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "rtk-configure-store",
      title: "configureStore",
      theory:
        "configureStore creates the Redux store with sensible defaults: redux-thunk middleware, Redux DevTools Extension integration, and development-only serialisability checks.",
      theoryDetail: {
        keyConcepts: [
          "`reducer` — map of slice reducers combined automatically via combineReducers",
          "Includes `redux-thunk` by default so async thunks work out of the box",
          "Redux DevTools Extension is wired up automatically in development",
          "`middleware` option lets you append custom middleware alongside the defaults",
        ],
        examples: [
          {
            title: "Store setup with typed hooks",
            description: "Combining multiple slices and exporting RootState and AppDispatch types.",
            code: `import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import { postsApi } from "./postsApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(postsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "rtk-create-async-thunk",
      title: "createAsyncThunk",
      theory:
        "createAsyncThunk handles async operations and automatically dispatches three lifecycle actions: pending, fulfilled, and rejected.",
      theoryDetail: {
        keyConcepts: [
          "Returns a thunk action creator whose result can be dispatched",
          "`pending` — dispatched immediately when the thunk starts",
          "`fulfilled` — dispatched when the promise resolves with its value as the payload",
          "`rejected` — dispatched when the promise rejects or `rejectWithValue` is called",
          "Handle lifecycle actions in `extraReducers` using the builder callback pattern",
        ],
        commonPitfalls: [
          "Not handling the `rejected` case, leaving errors completely silent in the UI",
          "Throwing directly inside the payload creator instead of using `rejectWithValue` for user-facing errors",
          "Scattering loading state across multiple slices instead of co-locating it with the data it guards",
        ],
        examples: [
          {
            title: "Async thunk with loading state",
            description: "Fetching a user with full pending/fulfilled/rejected handling.",
            code: `import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
  data: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const fetchUser = createAsyncThunk(
  "user/fetchById",
  async (userId: string, { rejectWithValue }) => {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) return rejectWithValue("Failed to fetch user");
    return res.json() as Promise<User>;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle", error: null } as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "rtk-query",
      title: "RTK Query",
      theory:
        "RTK Query is a powerful data-fetching and caching layer built into Redux Toolkit. It eliminates hand-written thunks, loading flags, and cache invalidation logic.",
      theoryDetail: {
        keyConcepts: [
          "`createApi` — defines all endpoints and the base configuration for your API",
          "`fetchBaseQuery` — a thin fetch wrapper for setting base URL, headers, and credentials",
          "Auto-generated React hooks: `useGetXQuery`, `useUpdateXMutation`, etc.",
          "Automatic cache deduplication, background refetching, and request coalescing",
          "Tags — declarative cache invalidation: mutations `invalidatesTags`, queries `providesTags`",
        ],
        commonPitfalls: [
          "Forgetting to add the API slice reducer AND middleware to `configureStore`",
          "Defining tags inconsistently, causing stale data after mutations",
          "Using RTK Query and `createAsyncThunk` for the same endpoint — pick one",
        ],
        examples: [
          {
            title: "Posts API with cache invalidation",
            description: "Full CRUD API definition with tag-based cache invalidation.",
            code: `import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post { id: string; title: string; body: string; }

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Post"],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: \`/posts/\${id}\`, method: "DELETE" }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} = postsApi;`,
            language: "typescript",
          },
        ],
      },
    },
  ],
};
