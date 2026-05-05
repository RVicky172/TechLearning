"use client";

import { useState, useRef, type Ref } from "react";
import { createPortal } from "react-dom";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

type InputApi = {
  focus: () => void;
  selectAll: () => void;
};

function SmartInput({ value, onChange, ref }: { value: string; onChange: (value: string) => void; ref: Ref<InputApi> }) {
  const innerRef = useRef<HTMLInputElement>(null);

  // In React 19, ref can be a prop directly
  if (ref && typeof ref === "object" && "current" in ref) {
    (ref as React.MutableRefObject<InputApi | null>).current = {
      focus: () => innerRef.current?.focus(),
      selectAll: () => innerRef.current?.select(),
    };
  }

  return (
    <input
      ref={innerRef}
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder="React 19 lets ref come as a prop"
      className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
    />
  );
}

export function RefAsPropDemo() {
  const renderCount = useRenderCount();
  const [value, setValue] = useState("No forwardRef needed in React 19.");
  const apiRef = useRef<InputApi>(null);

  return (
    <DemoCard title="ref as a prop">
      <RenderBadge count={renderCount} />
      <p>Function components can receive ref as a prop in React 19.</p>
      <SmartInput ref={apiRef} value={value} onChange={setValue} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => apiRef.current?.focus()}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Focus
        </button>
        <button
          type="button"
          onClick={() => apiRef.current?.selectAll()}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Select all
        </button>
      </div>
    </DemoCard>
  );
}

export function PortalDemo() {
  const renderCount = useRenderCount();
  const [open, setOpen] = useState(false);

  return (
    <DemoCard title="createPortal">
      <RenderBadge count={renderCount} />
      <p>Renders a modal outside the normal DOM subtree.</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
      >
        Open modal
      </button>
      {open &&
        createPortal(
          <div
            role="presentation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={event => event.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-(--border) bg-(--bg-surface) p-5"
            >
              <h4 className="text-base font-semibold text-(--text-1)">Portal Modal</h4>
              <p className="mt-2 text-sm text-(--text-2)">This is rendered in document.body using createPortal.</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </DemoCard>
  );
}
