import type { TopicNode } from "@/data/types";

export const reduxMiddleware: TopicNode = {
  id: "redux-middleware",
  title: "Middleware",
  iconName: "GitBranch",
  children: [
    {
      id: "redux-thunk",
      title: "Redux Thunk",
      theory:
        "redux-thunk allows action creators to return functions instead of plain objects, enabling async logic such as API calls or conditional dispatches.",
      theoryDetail: {
        keyConcepts: [
          "Included in Redux Toolkit's `configureStore` by default — no extra install needed",
          "Thunk functions receive `(dispatch, getState)` as arguments",
          "Prefer `createAsyncThunk` from RTK over writing manual thunks",
          "Thunks can dispatch multiple actions and read current state before deciding what to dispatch",
        ],
        examples: [
          {
            title: "Manual thunk action creator",
            description: "Writing a conditional thunk without createAsyncThunk.",
            code: `import type { ThunkAction, Action } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Shared AppThunk type — define once, reuse everywhere
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;

// Thunk that only increments when the current count is odd
export function incrementIfOdd(): AppThunk {
  return (dispatch, getState) => {
    const { count } = getState().counter;
    if (count % 2 !== 0) {
      dispatch({ type: "counter/increment" });
    }
  };
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "redux-custom-middleware",
      title: "Custom Middleware",
      theory:
        "Middleware is a composable extension point for the Redux dispatch pipeline. Each middleware can intercept, transform, log, or delay actions before they reach the reducer.",
      theoryDetail: {
        keyConcepts: [
          "Curried signature: `(store) => (next) => (action) => { ... }`",
          "Call `next(action)` to pass the action down the chain to the next middleware or reducer",
          "Use `store.dispatch` to fire new actions from within middleware",
          "Use `store.getState()` to inspect the current state during processing",
        ],
        commonPitfalls: [
          "Forgetting to call `next(action)` — stops the action from ever reaching the reducer",
          "Blocking the middleware chain with synchronous heavy computation",
        ],
        examples: [
          {
            title: "Logger middleware",
            description: "Logging every action with the state before and after.",
            code: `import type { Middleware } from "@reduxjs/toolkit";

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  const typedAction = action as { type: string };
  console.group(typedAction.type);
  console.log("prev state", store.getState());
  console.log("action    ", action);
  const result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

// Register in configureStore
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});`,
            language: "typescript",
          },
        ],
      },
    },
  ],
};
