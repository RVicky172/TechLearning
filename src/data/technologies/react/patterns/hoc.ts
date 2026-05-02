import type { TopicNode } from "@/data/types";

export const hoc: TopicNode = {
  id: "react-hoc",
  title: "Higher-Order Components",
  iconName: "Layers",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "A Higher-Order Component (HOC) is a function that takes a component and returns a new, enhanced component. It's a pattern for reusing component logic — the HOC wraps the original, injecting extra props, state, or behaviour without modifying the source component.",
  theoryDetail: {
    keyConcepts: [
      "Convention: HOC names start with 'with' — withAuth, withTheme, withLogger",
      "A HOC is a pure function: it takes a component and returns a new component; it never mutates the original",
      "HOCs inject props into the wrapped component — the wrapped component doesn't know it's inside a HOC",
      "Modern React often replaces HOCs with custom hooks — hooks compose logic without adding component layers",
    ],
    whyItMatters:
      "HOCs emerged as the primary code-reuse pattern before hooks existed. You'll encounter them throughout the React ecosystem — React Redux connect(), React Router withRouter(), and many third-party libraries still export HOCs. Understanding them is essential for working with existing codebases.",
    commonPitfalls: [
      "Creating HOCs inside render — this unmounts and remounts the wrapped component on every parent re-render; always define HOCs at module level",
      "Not forwarding refs through the HOC — use React.forwardRef inside the HOC to pass refs to the underlying component",
      "Losing the display name in DevTools — set WrappedComponent.displayName to make HOCs debuggable",
      "Prop name collisions — if the HOC and the wrapped component use the same prop name, one silently wins",
    ],
    examples: [
      {
        title: "withAuth — protect routes",
        description: "Redirect to login if the user is not authenticated; otherwise render the component.",
        code: `import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function withAuth(WrappedComponent) {
  function AuthGuard(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <WrappedComponent {...props} />;
  }

  // Helps React DevTools show a useful name
  AuthGuard.displayName = \`withAuth(\${WrappedComponent.displayName ?? WrappedComponent.name})\`;
  return AuthGuard;
}

// Usage
function Dashboard() {
  return <h1>Private Dashboard</h1>;
}

export default withAuth(Dashboard);`,
        language: "jsx",
      },
      {
        title: "withLogger — log render lifecycle",
        description: "Wrap any component to log when it mounts, updates, and unmounts.",
        code: `import { useEffect, useRef } from 'react';

function withLogger(WrappedComponent) {
  function LoggedComponent(props) {
    const renderCount = useRef(0);
    renderCount.current++;

    useEffect(() => {
      console.log(\`[mount] \${WrappedComponent.name}\`);
      return () => console.log(\`[unmount] \${WrappedComponent.name}\`);
    }, []);

    useEffect(() => {
      console.log(\`[render #\${renderCount.current}] \${WrappedComponent.name}\`, props);
    });

    return <WrappedComponent {...props} />;
  }

  LoggedComponent.displayName = \`withLogger(\${WrappedComponent.name})\`;
  return LoggedComponent;
}

// Wrap any component — zero changes to the original
const LoggedButton = withLogger(Button);`,
        language: "jsx",
      },
      {
        title: "Modern equivalent — custom hook",
        description: "The same auth logic as a custom hook — simpler and composable without adding tree layers.",
        code: `// The hook-based replacement for withAuth
function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return user;
}

// Usage — no wrapper component needed
function Dashboard() {
  const user = useRequireAuth();
  if (!user) return null;
  return <h1>Welcome {user.name}</h1>;
}`,
        language: "jsx",
      },
    ],
  },
};
