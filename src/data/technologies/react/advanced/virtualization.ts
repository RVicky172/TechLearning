import type { TopicNode } from "@/data/types";

export const virtualization: TopicNode = {
  id: "react-virtualization",
  title: "List Virtualization",
  iconName: "List",
  link: "https://tanstack.com/virtual/latest",
  theory:
    "List virtualization renders only the items currently visible in the viewport instead of the entire list. This keeps DOM node count constant, making huge lists (thousands of rows) scroll as fast as short ones.",
  theoryDetail: {
    keyConcepts: [
      "Only visible rows are mounted in the DOM — off-screen items are unmounted or never created",
      "A 'virtual' total height maintains correct scrollbar behavior without real DOM nodes",
      "TanStack Virtual (headless) gives full layout control; react-window is a leaner alternative",
      "Fixed-size rows are simpler; dynamic/variable sizes require measuring or estimating item height",
    ],
    whyItMatters:
      "Rendering 10,000 rows in the DOM freezes the browser. Virtualization solves this at the architecture level — no pagination, no lazy loading hacks, just instant scroll performance regardless of dataset size.",
    commonPitfalls: [
      "Forgetting to set a fixed height on the scroll container — virtualization requires a known viewport height",
      "Using index as key with sorted/filtered lists — rows get recycled incorrectly",
      "Skipping memoization on row components — each scroll event remounts visible items without React.memo",
      "Assuming virtualization is always needed — profile first; under ~200 items, plain rendering is faster",
    ],
    examples: [
      {
        title: "TanStack Virtual — fixed-size list",
        description: "Render 10,000 rows with constant DOM size using @tanstack/react-virtual.",
        code: `import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

const items = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));

export function VirtualList() {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // row height in px
  });

  return (
    <div
      ref={parentRef}
      style={{ height: '500px', overflowY: 'auto' }}
    >
      {/* Total spacer keeps scrollbar proportional */}
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={items[vItem.index].id}
            style={{
              position: 'absolute',
              top: vItem.start,
              left: 0,
              width: '100%',
              height: vItem.size,
            }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Memoized row component",
        description: "Wrap the row in React.memo to avoid re-renders on every scroll event.",
        code: `import { memo } from 'react';

const Row = memo(function Row({ name }: { name: string }) {
  return (
    <div className="flex items-center px-4 h-10 border-b border-gray-100">
      {name}
    </div>
  );
});`,
        language: "tsx",
      },
    ],
  },
};
