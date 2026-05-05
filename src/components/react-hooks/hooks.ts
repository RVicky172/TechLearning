import { useId, useRef, useCallback, useState, useEffect } from "react";

const renderCountStore = new Map<string, number>();

export function useRenderCount() {
  const id = useId();
  const nextCount = (renderCountStore.get(id) ?? 0) + 1;
  renderCountStore.set(id, nextCount);

  useEffect(() => {
    return () => {
      renderCountStore.delete(id);
    };
  }, [id]);

  return nextCount;
}

export function useCounter(initialValue = 0) {
  const renderCount = useRenderCount();
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(value => value + 1), []);
  const decrement = useCallback(() => setCount(value => value - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return {
    renderCount,
    count,
    increment,
    decrement,
    reset,
  };
}

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return initialValue;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
