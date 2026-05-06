import type { TopicNode } from "@/data/types";

export const context: TopicNode = {
    id: "react-context",
    title: "Context API",
    iconName: "Share2",
  demoComponentKey: "advancedContext",
    link: "https://react.dev/learn/passing-data-deeply-with-context",
    theory:
        "Context lets you pass data through the component tree without passing props at every level. It's ideal for global state like themes, authentication, or user preferences. Context is consumed with useContext, and updates trigger re-renders of all consumers.",
    theoryDetail: {
        keyConcepts: [
            "createContext() creates a Context object with Provider and Consumer",
            "useContext(MyContext) hooks into the nearest Provider's value up the tree",
            "All Context consumers re-render when the context value changes — wrap the value with useMemo to prevent unnecessary re-renders",
            "Context can hold both state and functions, enabling both data and behavior to be shared globally",
        ],
        whyItMatters:
            "Context eliminates prop drilling for cross-cutting state like authentication, theme, and locale — without requiring an external state management library. This makes components more reusable and reduces boilerplate.",
        commonPitfalls: [
            "Putting too much data in one Context — split by concern (one for theme, one for auth) for better performance",
            "Not memoizing the context value object causing all consumers to re-render on every parent render",
            "Using Context for local state that could simply be lifted to the parent — Context is for truly global state",
        ],
        examples: [
        {
            title: "Theme Context with memoized value",
            description: "Always wrap the context value in useMemo so Provider reference-equality is stable and consumers don't re-render unnecessarily on every parent render.",
            code: `import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // ✅ Memoize so the value object keeps the same reference
  // between renders, preventing every consumer from re-rendering
  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

// Usage — className-based styling, no inline style
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={\`header header--\${theme}\`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}`,
            language: "tsx",
        },
            {
                title: "Authentication Context",
                description: "Share auth state globally. Throw inside the custom hook so consumers always have type-safe access.",
                code: `import { createContext, useState, useCallback, useMemo, useContext } from 'react';

type AuthState = { user: User | null; loading: boolean };
type AuthActions = { login: (email: string, password: string) => Promise<void>; logout: () => void };

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const res  = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}`,
                language: "tsx",
            },
        ],
    },
};
