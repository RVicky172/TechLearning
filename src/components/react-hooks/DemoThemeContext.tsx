"use client";

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type DemoTheme = "sunrise" | "mint";

type DemoThemeValue = {
  theme: DemoTheme;
  setTheme: Dispatch<SetStateAction<DemoTheme>>;
};

const DemoThemeContext = createContext<DemoThemeValue | null>(null);

export function DemoThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<DemoTheme>("sunrise");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <DemoThemeContext.Provider value={value}>{children}</DemoThemeContext.Provider>;
}

export function useDemoTheme() {
  const value = useContext(DemoThemeContext);
  if (!value) {
    throw new Error("useDemoTheme must be used within DemoThemeProvider");
  }
  return value;
}
