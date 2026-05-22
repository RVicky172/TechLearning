import type { TopicNode } from "@/data/types";

export const reduxPatterns: TopicNode = {
  id: "redux-patterns",
  title: "Patterns & Best Practices",
  iconName: "Star",
  children: [
    {
      id: "redux-selectors",
      title: "Selectors & Reselect",
      theory:
        "Selectors are functions that derive data from the store. Memoised selectors via createSelector prevent expensive recomputations on every render.",
      theoryDetail: {
        keyConcepts: [
          "`createSelector` — composes input selectors and memoises the output function",
          "Recomputes only when at least one input selector's result changes",
          "Included in Redux Toolkit: `import { createSelector } from '@reduxjs/toolkit'`",
          "Co-locate selectors with the slice they read from for discoverability",
        ],
        commonPitfalls: [
          "Defining selectors inside components — creates a new memoised instance per render, defeating the cache",
          "Chaining too many selectors into a deeply nested hierarchy, making debugging harder",
        ],
        examples: [
          {
            title: "Memoised selector with createSelector",
            description: "Filtering and sorting products without recomputing on unrelated state changes.",
            code: `import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

// Input selectors — simple field reads
const selectAllProducts = (state: RootState) => state.products.items;
const selectCategoryFilter = (state: RootState) => state.products.filter;

// Memoised result selector
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectCategoryFilter],
  (products, filter) =>
    products
      .filter((p) => filter === "all" || p.category === filter)
      .sort((a, b) => a.name.localeCompare(b.name))
);

// In a component — only re-renders when products or filter change
const filtered = useAppSelector(selectFilteredProducts);`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "redux-normalization",
      title: "State Normalization",
      theory:
        "Normalising state stores collections as dictionaries keyed by ID, eliminating data duplication and enabling O(1) lookups.",
      theoryDetail: {
        keyConcepts: [
          "`createEntityAdapter` from RTK generates normalised CRUD reducers automatically",
          "Stores entities as `{ ids: string[], entities: Record<string, T> }`",
          "Pre-built selectors: `selectAll`, `selectById`, `selectIds`, `selectTotal`",
          "Pass a `sortComparer` to keep `ids` ordered without extra sorting logic",
        ],
        examples: [
          {
            title: "Entity adapter for a users collection",
            description: "Full normalized slice with auto-generated CRUD reducers and selectors.",
            code: `import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

interface User { id: string; name: string; role: "admin" | "user"; }

const usersAdapter = createEntityAdapter<User>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser: usersAdapter.addOne,
    updateUser: usersAdapter.updateOne,
    removeUser: usersAdapter.removeOne,
    setAllUsers: usersAdapter.setAll,
  },
});

export const { addUser, updateUser, removeUser, setAllUsers } = usersSlice.actions;
export default usersSlice.reducer;

// Auto-generated, typed selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectTotal: selectUserCount,
} = usersAdapter.getSelectors((state: RootState) => state.users);`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "redux-state-design",
      title: "State Shape Design",
      theory:
        "Good Redux state keeps data flat and minimal, avoids redundancy, and separates server cache from UI state.",
      theoryDetail: {
        keyConcepts: [
          "Minimise state — derive everything possible in selectors instead of storing computed values",
          "Separate server cache (RTK Query) from client UI state (slices)",
          "Never store non-serialisable values: JSX nodes, class instances, or functions",
          "Co-locate slice reducers and selectors for the same data domain",
        ],
        comparisons: [
          {
            title: "What belongs where",
            points: [
              "Redux slice: user session, shopping cart, global notification queue, feature flags",
              "Local component state: form inputs, hover/focus flags, modal open state",
              "RTK Query: server data with caching (posts, products, users from an API)",
              "URL params: current page, search query, selected tab, sort order",
            ],
          },
        ],
      },
    },
  ],
};
