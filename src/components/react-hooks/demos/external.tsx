"use client";

import { useSyncExternalStore, useDebugValue } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

function createClockStore() {
  let value = new Date().toLocaleTimeString();
  const listeners = new Set<() => void>();

  setInterval(() => {
    value = new Date().toLocaleTimeString();
    listeners.forEach(listener => listener());
  }, 1000);

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => value,
  };
}

const clockStore = createClockStore();

export function UseSyncExternalStoreDemo() {
  const renderCount = useRenderCount();
  const now = useSyncExternalStore(clockStore.subscribe, clockStore.getSnapshot, () => "00:00:00");

  return (
    <DemoCard title="useSyncExternalStore">
      <RenderBadge count={renderCount} />
      <p>Subscribes to an external clock store.</p>
      <p>Current time: {now}</p>
    </DemoCard>
  );
}

function useOnlineStatus() {
  const online = useSyncExternalStore(
    notify => {
      window.addEventListener("online", notify);
      window.addEventListener("offline", notify);
      return () => {
        window.removeEventListener("online", notify);
        window.removeEventListener("offline", notify);
      };
    },
    () => navigator.onLine,
    () => true
  );

  useDebugValue(online ? "Online" : "Offline");
  return online;
}

export function UseDebugValueDemo() {
  const renderCount = useRenderCount();
  const online = useOnlineStatus();

  return (
    <DemoCard title="useDebugValue">
      <RenderBadge count={renderCount} />
      <p>Useful for labeling custom hooks in React DevTools.</p>
      <p>Network: {online ? "Online" : "Offline"}</p>
    </DemoCard>
  );
}
