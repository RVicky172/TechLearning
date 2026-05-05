"use client";

import { useState } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";
import { DemoThemeProvider, useDemoTheme } from "../DemoThemeContext";

function UseContextContent() {
  const renderCount = useRenderCount();
  const { theme, setTheme } = useDemoTheme();

  return (
    <>
      <RenderBadge count={renderCount} />
      <p>Read and update shared state through context without prop drilling.</p>
      <button
        type="button"
        onClick={() => setTheme(current => (current === "sunrise" ? "mint" : "sunrise"))}
        className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
      >
        Toggle Theme ({theme})
      </button>
    </>
  );
}

export function UseContextDemo() {
  return (
    <DemoCard title="useContext">
      <DemoThemeProvider>
        <UseContextContent />
      </DemoThemeProvider>
    </DemoCard>
  );
}
