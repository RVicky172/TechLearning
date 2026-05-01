import type { TopicNode } from "@/data/types";

export const context: TopicNode = {
    id: "react-context",
    title: "Context API",
    iconName: "Share2",
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
                title: "Basic Theme Context",
                description: "Create and use a context for global theme state.",
                code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

// Usage
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header style={{
      background: theme === 'light' ? '#fff' : '#1a1a1a'
    }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}`,
                language: "jsx",
            },
            {
                title: "Authentication Context",
                description: "Share authentication state and login/logout functions.",
                code: `import { createContext, useState, useCallback } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}`,
                language: "jsx",
            },
        ],
    },
};
