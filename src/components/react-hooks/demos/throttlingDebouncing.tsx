"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

// ── useDebounce hook (inline for the demo) ──
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── useThrottle hook (inline for the demo) ──
function useThrottle<T>(value: T, interval: number): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastUpdated = useRef<number>(0);
  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastUpdated.current);
    if (remaining <= 0) {
      lastUpdated.current = now;
      setThrottled(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottled(value);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [value, interval]);
  return throttled;
}

export function ThrottlingDebouncingDemo() {
  const renderCount = useRenderCount();

  // ── Debounce section ──
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500);
  const [apiCallLog, setApiCallLog] = useState<string[]>([]);
  const [keystrokeCount, setKeystrokeCount] = useState(0);

  useEffect(() => {
    if (!debouncedValue) return;
    const time = new Date().toLocaleTimeString();
    setApiCallLog((prev) => [`[${time}] API called with: "${debouncedValue}"`, ...prev].slice(0, 5));
  }, [debouncedValue]);

  // ── Throttle section ──
  const [scrollPos, setScrollPos] = useState(0);
  const throttledScrollPos = useThrottle(scrollPos, 300);
  const [scrollEventCount, setScrollEventCount] = useState(0);
  const [throttledEventCount, setThrottledEventCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    setScrollEventCount((c) => c + 1);
    setScrollPos(scrollRef.current?.scrollTop ?? 0);
  }, []);

  useEffect(() => {
    setThrottledEventCount((c) => c + 1);
  }, [throttledScrollPos]);

  const btnClass =
    "rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated) transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-(--text-3)";
  const valueClass = "font-mono text-sm px-2 py-1 rounded bg-(--bg-code) text-(--accent-fg)";

  return (
    <DemoCard title="Throttling & Debouncing">
      <RenderBadge count={renderCount} />

      {/* ── DEBOUNCE SECTION ── */}
      <div className="mb-5">
        <p className={labelClass}>🔵 Debounce — API search (500ms delay)</p>
        <p className="text-xs text-(--text-3) mb-2">
          Type quickly — the API is only called 500ms after you stop typing.
        </p>
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setKeystrokeCount((c) => c + 1);
          }}
          placeholder="Type to search..."
          className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-sm text-(--text-1) mb-2"
        />
        <div className="flex flex-wrap gap-4 text-sm mb-2">
          <span>
            Keystrokes fired:{" "}
            <span className={valueClass}>{keystrokeCount}</span>
          </span>
          <span>
            API calls made:{" "}
            <span className={valueClass}>{apiCallLog.length}</span>
          </span>
          <span>
            Pending:{" "}
            <span className={valueClass}>
              {inputValue !== debouncedValue ? "⏳ waiting..." : "✅ settled"}
            </span>
          </span>
        </div>
        {apiCallLog.length > 0 && (
          <div className="rounded-lg bg-(--bg-code) p-3 text-xs font-mono space-y-1">
            {apiCallLog.map((log, i) => (
              <div key={i} className="text-(--text-2)">
                {log}
              </div>
            ))}
          </div>
        )}
        <button
          className={`${btnClass} mt-2 text-xs`}
          onClick={() => {
            setInputValue("");
            setApiCallLog([]);
            setKeystrokeCount(0);
          }}
        >
          Reset
        </button>
      </div>

      <div className="h-px bg-(--border) mb-5" />

      {/* ── THROTTLE SECTION ── */}
      <div>
        <p className={labelClass}>🟢 Throttle — Scroll tracker (300ms interval)</p>
        <p className="text-xs text-(--text-3) mb-2">
          Scroll the box below — raw events fire on every pixel, throttled updates at most every 300ms.
        </p>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-32 overflow-y-auto rounded-lg border border-(--border) bg-(--bg-code) p-3 mb-2"
        >
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i} className="text-xs text-(--text-3) py-0.5">
              Line {i + 1} — scroll me to see throttle in action
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            Raw scroll events:{" "}
            <span className={valueClass}>{scrollEventCount}</span>
          </span>
          <span>
            Throttled updates:{" "}
            <span className={valueClass}>{throttledEventCount}</span>
          </span>
          <span>
            Scroll position:{" "}
            <span className={valueClass}>{Math.round(throttledScrollPos)}px</span>
          </span>
        </div>
        <p className="text-xs text-(--text-3) mt-2">
          💡 Notice how <strong>Throttled updates</strong> grows much slower than <strong>Raw scroll events</strong> — that&apos;s throttle saving renders.
        </p>
        <button
          className={`${btnClass} mt-2 text-xs`}
          onClick={() => {
            setScrollEventCount(0);
            setThrottledEventCount(0);
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
          }}
        >
          Reset counters
        </button>
      </div>
    </DemoCard>
  );
}
