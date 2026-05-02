import type { TopicNode } from "@/data/types";

export const portals: TopicNode = {
  id: "react-portals",
  title: "Portals",
  iconName: "Globe",
  link: "https://react.dev/reference/react-dom/createPortal",
  theory:
    "A Portal renders children into a DOM node that exists outside the parent component's DOM hierarchy while keeping the component fully inside the React tree. Events still bubble through the React tree, context still works — only the physical DOM position changes.",
  theoryDetail: {
    keyConcepts: [
      "createPortal(children, domNode) — renders children into domNode regardless of where the component is in the React tree",
      "The React tree (events, context, state) is unchanged — only the DOM tree changes",
      "The classic use-case: modals, tooltips, and dropdowns that need to escape an overflow:hidden or z-index parent",
      "Event bubbling follows the React tree, not the DOM tree — a click inside a portal bubbles to the portal's React parent",
    ],
    whyItMatters:
      "overflow:hidden, z-index stacking contexts, and fixed positioning often make modals and tooltips render incorrectly when nested inside a component. Portals escape that constraint by mounting directly under document.body, guaranteeing correct stacking without CSS hacks.",
    commonPitfalls: [
      "Forgetting to clean up portal containers — when using a ref to create a div, ensure it's removed in the cleanup effect",
      "Assuming keyboard and focus trapping happen automatically — modals still need explicit focus management and aria attributes for accessibility",
      "Rendering into a non-existent DOM node — the target element must exist before createPortal is called",
    ],
    examples: [
      {
        title: "Modal with createPortal",
        description: "Render a modal directly into document.body to escape any parent overflow/z-index constraints.",
        code: `import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}   // prevent overlay click
        role="dialog"
        aria-modal="true"
      >
        <button onClick={onClose} aria-label="Close">✕</button>
        {children}
      </div>
    </div>,
    document.body    // renders outside any parent DOM node
  );
}

// Usage — can be inside a deeply nested, overflow:hidden component
function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2>Hello from the portal!</h2>
      </Modal>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Tooltip portal",
        description: "Anchor a tooltip to a button while rendering it at the document root.",
        code: `import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [coords,  setCoords]  = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!visible || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + window.scrollY + 4, left: rect.left });
  }, [visible]);

  return (
    <>
      <span ref={ref}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}>
        {children}
      </span>
      {visible && createPortal(
        <div className="tooltip"
             style={{ position: 'absolute', top: coords.top, left: coords.left }}>
          {text}
        </div>,
        document.body
      )}
    </>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
