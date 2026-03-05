// context/ThemeContext.tsx
"use client";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { ThemeConfig } from "@/types/theme";

interface ThemeContextValue {
  theme: ThemeConfig;
  /** Gera inline style com CSS var — útil quando Tailwind não alcança */
  themeStyle: (property: string, varName: string) => React.CSSProperties;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ theme, children }: { theme: ThemeConfig; children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    themeStyle: (property, varName) => ({ [property]: `var(${varName})` }),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}