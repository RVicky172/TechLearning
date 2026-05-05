"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

export function UseLayoutEffectDemo() {
  const renderCount = useRenderCount();
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!boxRef.current) {
      return;
    }
    setWidth(Math.round(boxRef.current.getBoundingClientRect().width));
  }, []);

  return (
    <DemoCard title="useLayoutEffect">
      <RenderBadge count={renderCount} />
      <p>Reads layout synchronously after DOM updates.</p>
      <div ref={boxRef} className="rounded-lg border border-(--border) bg-(--bg-code) px-3 py-3 text-(--text-1)">
        Measured width: {width}px
      </div>
    </DemoCard>
  );
}
