"use client";

import { memo, type ReactNode } from "react";

export function DemoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 rounded-xl border border-(--border) bg-(--bg-surface) p-6">
      <h3 className="text-lg font-semibold text-(--text-1)">{title} Live Demo</h3>
      <div className="mt-4 space-y-4 text-sm text-(--text-2)">{children}</div>
    </section>
  );
}

export function RenderBadge({ count }: { count: number }) {
  return (
    <p className="inline-flex rounded-full border border-(--border-hover) px-3 py-1 text-xs text-(--text-2)">
      Render count: {count}
    </p>
  );
}

export const SaveButton = memo(function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <button
      type="button"
      onClick={onSave}
      className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
    >
      Save note
    </button>
  );
});
