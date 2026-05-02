import type { TopicNode } from "@/data/types";

export const errorBoundaries: TopicNode = {
  id: "react-error-boundaries",
  title: "Error Boundaries",
  iconName: "AlertTriangle",
  link: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
  theory:
    "An Error Boundary is a class component that catches JavaScript errors in its child tree during rendering, in lifecycle methods, and in constructors. It prevents a single broken component from crashing the entire app by rendering a fallback UI instead.",
  theoryDetail: {
    keyConcepts: [
      "Error Boundaries must be class components — they use getDerivedStateFromError and componentDidCatch lifecycle methods",
      "getDerivedStateFromError(error) updates state to trigger a fallback render",
      "componentDidCatch(error, info) is used for logging — info.componentStack shows which component threw",
      "Error Boundaries do NOT catch errors in: event handlers, async code (setTimeout), or server-side rendering — only rendering errors",
    ],
    whyItMatters:
      "A JavaScript error in one widget shouldn't take down your entire banking dashboard. Error Boundaries let you define recovery zones — if the chart crashes, the sidebar and navigation still work. Combined with React.lazy, they also catch failed dynamic imports.",
    commonPitfalls: [
      "Expecting Error Boundaries to catch event handler errors — those must be caught with try/catch manually",
      "Placing one giant Error Boundary at the app root — this hides all errors behind one fallback; use multiple granular boundaries",
      "Not logging to an error reporting service in componentDidCatch — caught errors are invisible without explicit reporting",
      "Forgetting a reset mechanism — users need a way to recover (retry button, navigate away) not just a static error message",
    ],
    examples: [
      {
        title: "Basic Error Boundary class component",
        description: "Catch any render error in children and show a friendly fallback.",
        code: `import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows the fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to your error monitoring service (Sentry, Datadog, etc.)
    console.error('Caught by ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <WidgetThatMightCrash />
    </ErrorBoundary>
  );
}`,
        language: "jsx",
      },
      {
        title: "Granular boundaries per section",
        description: "Isolate failures so one broken section doesn't affect the rest of the page.",
        code: `function Dashboard() {
  return (
    <div className="dashboard">
      {/* If the chart crashes, the table still works */}
      <ErrorBoundary fallback={<p>Chart failed to render.</p>}>
        <RevenueChart />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Table failed to render.</p>}>
        <SalesTable />
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Map failed to render.</p>}>
        <RegionMap />
      </ErrorBoundary>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "react-error-boundary library",
        description: "The community package adds a functional API with reset and fallback render prop.",
        code: `import { ErrorBoundary } from 'react-error-boundary';

function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={(error, info) => logToSentry(error, info)}
      onReset={() => { /* optional: clear state, refetch, etc. */ }}
    >
      <ComplexWidget />
    </ErrorBoundary>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
