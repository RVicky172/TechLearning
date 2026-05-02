import type { TopicNode } from "@/data/types";

export const components: TopicNode = {
  id: "react-components",
  title: "Components & JSX",
  iconName: "Layers",
  link: "https://react.dev/learn/your-first-component",
  theory:
    "Components are JavaScript functions that return JSX — a syntax extension that looks like HTML but compiles to React.createElement() calls. JSX makes component code more readable and closely mirrors the HTML you're describing. React treats component names as special: uppercase names are components, lowercase names are HTML elements.",
  theoryDetail: {
    keyConcepts: [
      "JSX compiles to React.createElement(Component, props, children) — the HTML-like syntax is just sugar",
      "Component names must be PascalCase (uppercase first letter); lowercase names are treated as HTML tags",
      "Return a single root element — use fragments <> to wrap multiple children without adding an extra DOM node",
      "JSX is evaluated as expressions, so you can use them inside arrays, conditionals, and variables",
    ],
    whyItMatters:
      "Components are the fundamental building block of React. JSX's HTML-like syntax makes your code intuitive even for non-programmers. Treating components as reusable functions lets you compose complex UIs from simple pieces and test them independently.",
    commonPitfalls: [
      "Using lowercase for component names — React will render them as HTML tags and ignore them as components",
      "Returning multiple sibling elements without a wrapper; React needs a single root (use <> fragments)",
      "Embedding complex logic or state management directly in JSX — extract to variables or custom hooks",
      "Creating components inside other components — this causes them to be redefined on every render, losing state",
    ],
    examples: [
      {
        title: "Real-world component — UserCard",
        description: "A realistic component that destructures props, computes derived values, and handles conditional rendering.",
        code: `function UserCard({ name, role, avatarUrl, isOnline }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <article className="user-card">
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="avatar" />
        : <span className="avatar-fallback">{initials}</span>
      }
      <div className="info">
        <h3>{name}</h3>
        <p>{role}</p>
        <span className={isOnline ? 'badge-online' : 'badge-offline'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </article>
  );
}

// Usage
<UserCard
  name="Sarah Connor"
  role="Engineering Lead"
  isOnline={true}
/>`,
        language: "jsx",
      },
      {
        title: "JSX is JavaScript — expressions and computation",
        description: "JSX evaluates any JS expression inside {}. Extract complex logic into variables before the return.",
        code: `function InvoiceRow({ item, taxRate }) {
  const subtotal  = item.qty * item.unitPrice;
  const tax       = subtotal * taxRate;
  const total     = subtotal + tax;
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.qty}</td>
      <td>{formatter.format(item.unitPrice)}</td>
      <td>{formatter.format(tax)}</td>
      <td className={total > 1000 ? 'highlight' : ''}>
        {formatter.format(total)}
      </td>
    </tr>
  );
}`,
        language: "jsx",
      },
      {
        title: "Composition with Fragments",
        description: "Build larger UIs from small, focused components. Use <> to avoid extra wrapper DOM nodes.",
        code: `function PageLayout({ title, children, sidebar }) {
  return (
    <>
      <header className="page-header">
        <h1>{title}</h1>
      </header>
      <div className="page-body">
        <aside className="page-sidebar">{sidebar}</aside>
        <main className="page-content">{children}</main>
      </div>
    </>
  );
}

// Usage — no unnecessary wrapper div in the DOM
function App() {
  return (
    <PageLayout
      title="Dashboard"
      sidebar={<NavMenu />}
    >
      <ReportGrid />
    </PageLayout>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
