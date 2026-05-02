import type { TopicNode } from "@/data/types";

export const hookUseContext: TopicNode = {
  id: "hook-usecontext",
  title: "useContext",
  iconName: "Share2",
  link: "https://react.dev/reference/react/useContext",
  theory:
    "useContext reads the current value of a React Context without needing to pass it down as a prop at every level. Any component in the tree below the Provider can call useContext(MyContext) to subscribe — it re-renders whenever the context value changes.",
  theoryDetail: {
    keyConcepts: [
      "createContext(defaultValue) creates a context object — the default is only used when there is no matching Provider above",
      "<MyContext.Provider value={...}> wraps the subtree that should have access",
      "useContext(MyContext) returns the current value — components using it re-render when value changes",
      "Wrap the Provider value in useMemo to avoid re-rendering all consumers when the parent re-renders for unrelated reasons",
    ],
    whyItMatters:
      "Prop drilling — passing data through many layers of components that don't need it — is a common pain point in large trees. Context eliminates this for genuinely global or widely-shared data like theme, locale, auth state, or feature flags.",
    commonPitfalls: [
      "Using Context for every shared state — Context re-renders ALL consumers; consider Zustand/Jotai for frequently changing values",
      "Placing the Provider too high in the tree — it forces large subtrees to re-render on each update",
      "Forgetting to memoize the context value object — a new object reference on every render re-renders every consumer",
      "Consuming context outside a Provider — the default value is returned, which is often null/undefined and crashes",
    ],
    examples: [
      {
        title: "Theme context",
        description: "Share a theme value and toggle function across the whole app.",
        code: `import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // ✅ Memoize so consumers don't re-render when ThemeProvider's
  //    parent re-renders for an unrelated reason
  const value = useMemo(
    () => ({ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for ergonomic access
export function useTheme() {
  return useContext(ThemeContext);
}

// Any component anywhere in the tree
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>Current: {theme}</button>;
}`,
        language: "jsx",
      },
      {
        title: "Auth context",
        description: "Provide the current user to the whole app and protect routes.",
        code: `import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function Dashboard() {
  const { user, logout } = useAuth();
  if (!user) return <p>Please log in.</p>;
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
