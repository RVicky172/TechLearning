import type { TopicNode } from "@/data/types";

export const props: TopicNode = {
  id: "react-props",
  title: "Props & Data Flow",
  iconName: "ArrowRightLeft",
  demoComponentKey: "reactProps",
  link: "https://react.dev/learn/passing-props-to-a-component",
  theory:
    "Props are how you pass data from a parent component to a child component. They are immutable and flow in only one direction (downward). React enforces this constraint to make your data flow transparent — you always know where state comes from and how it gets updated.",
  theoryDetail: {
    keyConcepts: [
      "Props are read-only — a component should never modify its own props directly",
      "Destructure props in the function signature for clarity and to reference them by name",
      "children is a special built-in prop for passing nested JSX content between opening and closing tags",
      "Props can be any JavaScript value: strings, numbers, booleans, objects, functions, or React elements",
    ],
    whyItMatters:
      "Unidirectional data flow makes bugs easier to trace — you always know where state originates and how it propagates down the tree. This makes large applications easier to reason about and debug.",
    commonPitfalls: [
      "Prop drilling more than 2–3 levels deep — switch to Context API or state management for global state",
      "Passing new object/array literals as props (e.g., style={{}} or options={[...]}) defeating memoization optimizations",
      "Using props for values that should be local component state — props are for external data",
      "Assuming prop changes trigger updates without understanding that props are only checked on render",
    ],
    examples: [
      {
        title: "Typed props with destructuring",
        description: "Destructure all props in the signature. Default values document intent and prevent undefined errors.",
        code: `function StatusBadge({ label, variant = 'info', size = 'md' }) {
  const variantClass = {
    info:    'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error:   'badge-error',
  }[variant] ?? 'badge-info';

  return (
    <span className={\`badge \${variantClass} badge-\${size}\`}>
      {label}
    </span>
  );
}

// Consumers only need to supply what differs from the default
<StatusBadge label="Active" variant="success" />
<StatusBadge label="Deprecated" variant="warning" size="sm" />`,
        language: "jsx",
      },
      {
        title: "children and slot props — flexible composition",
        description: "Use children for main content and named slot props for optional regions like header and footer.",
        code: `function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Full usage
<Card
  header={<h2>Monthly Report</h2>}
  footer={<button>Download PDF</button>}
>
  <ReportChart />
  <ReportTable />
</Card>

// Body-only usage
<Card>
  <p>Simple note with no header or footer.</p>
</Card>`,
        language: "jsx",
      },
      {
        title: "Lifting state up — callback props",
        description: "Child emits events via callback props; parent owns state. This keeps data flow predictable.",
        code: `function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  return (
    <div className="qty-selector">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        −
      </button>
      <span>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

function CartItem({ product }) {
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  return (
    <div className="cart-item">
      <p>{product.name}</p>
      <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
      <p>Total: \${total.toFixed(2)}</p>
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
