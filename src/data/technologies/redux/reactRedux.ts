import type { TopicNode } from "@/data/types";

export const reduxReactIntegration: TopicNode = {
  id: "redux-react-integration",
  title: "React-Redux",
  iconName: "Plug",
  children: [
    {
      id: "redux-provider",
      title: "Provider & Store Setup",
      theory:
        "The <Provider> component makes the Redux store available to all nested components via React context. In Next.js App Router, wrap it in a dedicated client component.",
      theoryDetail: {
        keyConcepts: [
          "`Provider` passes the store down the component tree via React context",
          "Wrap your app root or layout with `<Provider store={store}>`",
          "In Next.js App Router, create a `StoreProvider` client component to avoid server/client boundary issues",
        ],
        examples: [
          {
            title: "Next.js App Router store provider",
            description: "Creating a client-side provider and wiring it into the root layout.",
            code: `// app/StoreProvider.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// app/layout.tsx
import { StoreProvider } from "./StoreProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "redux-use-selector",
      title: "useSelector",
      theory:
        "useSelector subscribes a component to the Redux store and re-renders it only when the selected slice of state changes (by reference equality).",
      theoryDetail: {
        keyConcepts: [
          "Takes a selector function `(state: RootState) => T`",
          "Re-renders only when the selector's return value changes by reference",
          "Use `createSelector` from Reselect for expensive derivations to prevent unnecessary re-renders",
          "Prefer typed hooks: `useSelector.withTypes<RootState>()`",
        ],
        commonPitfalls: [
          "Returning a new inline object or array literal from the selector on every call — causes infinite re-renders",
          "Selecting the entire state object (`state => state`) — all changes trigger re-renders",
          "Forgetting to memoise selectors that compute derived or transformed data",
        ],
        examples: [
          {
            title: "Typed useAppSelector hook",
            description: "Creating a typed hook and using it in a component.",
            code: `// store/hooks.ts
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// components/CartBadge.tsx
import { useAppSelector } from "@/store/hooks";

export function CartBadge() {
  const itemCount = useAppSelector(
    (state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );
  return <span className="badge">{itemCount}</span>;
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "redux-use-dispatch",
      title: "useDispatch",
      theory:
        "useDispatch returns the store's dispatch function, letting components send actions and trigger state changes.",
      theoryDetail: {
        keyConcepts: [
          "Call once at the top of the component — the reference is stable",
          "Dispatch action creators from slices or async thunks",
          "Use the typed `AppDispatch` so TypeScript infers thunk return types correctly",
        ],
        examples: [
          {
            title: "Dispatching slice actions",
            description: "Combining useAppSelector and useAppDispatch in a single component.",
            code: `import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addItem, removeItem } from "@/store/cartSlice";

interface Props { productId: string; }

export function CartToggle({ productId }: Props) {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(
    (state) => state.cart.items.some((i) => i.id === productId)
  );

  return inCart ? (
    <button onClick={() => dispatch(removeItem(productId))}>
      Remove from Cart
    </button>
  ) : (
    <button onClick={() => dispatch(addItem({ id: productId, qty: 1 }))}>
      Add to Cart
    </button>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
  ],
};
