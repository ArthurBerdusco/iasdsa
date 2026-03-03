// context/ThemeContext.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
import { ThemeConfig } from "@/types/theme";

const ThemeContext = createContext<ThemeConfig | null>(null);

export function ThemeProvider({ theme, children }: { 
  theme: ThemeConfig; 
  children: ReactNode 
}) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeConfig {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}