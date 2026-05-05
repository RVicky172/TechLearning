"use client";

import { useState, useRef, useId, useImperativeHandle, forwardRef, memo } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

export function UseIdDemo() {
  const renderCount = useRenderCount();
  const fieldId = useId();

  return (
    <DemoCard title="useId">
      <RenderBadge count={renderCount} />
      <p>Generate stable IDs for accessible form controls.</p>
      <label htmlFor={`${fieldId}-name`} className="text-(--text-1)">
        Name
      </label>
      <input
        id={`${fieldId}-name`}
        placeholder="Accessible input"
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
    </DemoCard>
  );
}

type FocusApi = {
  focus: () => void;
  clear: () => void;
};

const FancyInput = memo(
  forwardRef<FocusApi, { value: string; onChange: (value: string) => void }>(function FancyInputComponent(
    { value, onChange },
    ref
  ) {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => innerRef.current?.focus(),
        clear: () => {
          onChange("");
          innerRef.current?.focus();
        },
      }),
      [onChange]
    );

    return (
      <input
        ref={innerRef}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Expose methods to parent"
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
    );
  })
);

export function UseImperativeHandleDemo() {
  const renderCount = useRenderCount();
  const [value, setValue] = useState("Parent can focus or clear me");
  const apiRef = useRef<FocusApi>(null);

  return (
    <DemoCard title="useImperativeHandle">
      <RenderBadge count={renderCount} />
      <p>Child exposes a tiny imperative API through a ref.</p>
      <FancyInput ref={apiRef} value={value} onChange={setValue} />
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
          onClick={() => apiRef.current?.clear()}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Clear
        </button>
      </div>
    </DemoCard>
  );
}
