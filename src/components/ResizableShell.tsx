"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "./Sidebar";

const MIN_W = 180;
const MAX_W = 520;
const DEFAULT_W = 256;
const STORAGE_KEY = "sidebar-width";

export function ResizableShell({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_W);
  const dragging = useRef(false);
  const widthRef = useRef(DEFAULT_W);

  // Keep ref in sync so event listeners can read the latest value
  useEffect(() => { widthRef.current = width; }, [width]);

  // Restore persisted width on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const n = Math.min(MAX_W, Math.max(MIN_W, Number(saved)));
      if (!Number.isNaN(n)) setWidth(n);
    }
  }, []);

  const startDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const next = Math.min(MAX_W, Math.max(MIN_W, ev.clientX));
      setWidth(next);
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      localStorage.setItem(STORAGE_KEY, String(widthRef.current));
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, []);

  const resetWidth = useCallback(() => {
    setWidth(DEFAULT_W);
    localStorage.setItem(STORAGE_KEY, String(DEFAULT_W));
  }, []);

  return (
    <div
      className="flex flex-1 min-h-0"
      style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}
    >
      <Sidebar />

      {/* Drag handle — visible only on md+ where the sidebar is shown */}
      <div
        className="fixed top-14 z-50 hidden md:flex h-[calc(100vh-3.5rem)] w-3 -translate-x-1/2 items-center justify-center cursor-col-resize select-none group"
        style={{ left: width }}
        onPointerDown={startDrag}
        onDoubleClick={resetWidth}
        title="Drag to resize · Double-click to reset"
      >
        {/* Visual pill */}
        <div className="w-0.5 h-10 rounded-full bg-transparent group-hover:bg-(--border-hover) group-active:bg-(--accent) transition-colors duration-150" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 md:ml-(--sidebar-w)">
        {children}
      </div>
    </div>
  );
}
