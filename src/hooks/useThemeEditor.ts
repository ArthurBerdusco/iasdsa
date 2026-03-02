// ============================================================
// hooks/useThemeEditor.ts
// Hook central — gerencia estado e persistência do tema
// ============================================================

import { useState, useCallback } from "react";
import { ThemeConfig } from "@/types/theme";
import { DEFAULT_THEME, ThemePreset } from "@/lib/theme-defaults";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useThemeEditor(initialTheme?: ThemeConfig) {
  const [theme, setTheme] = useState<ThemeConfig>(
    initialTheme ?? DEFAULT_THEME
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // ── Updaters granulares ─────────────────────────────────
  const updateColors = useCallback(
    (key: keyof ThemeConfig["colors"], value: string) => {
      setTheme((t) => ({ ...t, colors: { ...t.colors, [key]: value } }));
    },
    []
  );

  const updateTypography = useCallback(
    (key: keyof ThemeConfig["typography"], value: string | number) => {
      setTheme((t) => ({
        ...t,
        typography: { ...t.typography, [key]: value },
      }));
    },
    []
  );

  const updateLayout = useCallback(
    (key: keyof ThemeConfig["layout"], value: string | number) => {
      setTheme((t) => ({ ...t, layout: { ...t.layout, [key]: value } }));
    },
    []
  );

  const updateEffects = useCallback(
    (key: keyof ThemeConfig["effects"], value: string | boolean) => {
      setTheme((t) => ({ ...t, effects: { ...t.effects, [key]: value } }));
    },
    []
  );

  // ── Preset ──────────────────────────────────────────────
  const applyPreset = useCallback((preset: ThemePreset) => {
    setTheme((t) => ({
      ...t,
      colors: { ...t.colors, ...preset.colors },
      typography: { ...t.typography, ...preset.typography },
    }));
  }, []);

  // ── Reset ────────────────────────────────────────────────
  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
  }, []);

  // ── Salvar no banco via API ──────────────────────────────
  const saveTheme = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("[useThemeEditor] Erro ao salvar:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }, [theme]);

  return {
    theme,
    saveStatus,
    updateColors,
    updateTypography,
    updateLayout,
    updateEffects,
    applyPreset,
    resetTheme,
    saveTheme,
  };
}
