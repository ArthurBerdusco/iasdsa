// ============================================================
// lib/theme-defaults.ts
// Valores padrão e presets de tema
// ============================================================

import { ThemeConfig } from "@/types/theme";

export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: "#1a56db",
    secondary: "#7c3aed",
    accent: "#f59e0b",
    background: "#ffffff",
    backgroundAlt: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    textMuted: "#64748b",
    textInverse: "#ffffff",
    border: "#e2e8f0",
  },
  typography: {
    fontHeading: "Playfair Display",
    fontBody: "Lato",
    fontAccent: "Dancing Script",
    sizeBase: 16,
    sizeH1: 48,
    sizeH2: 36,
    sizeH3: 24,
    lineHeight: 1.6,
    letterSpacing: "0",
    headingWeight: "700",
  },
  layout: {
    borderRadius: 8,
    containerWidth: 1200,
    sectionPadding: 80,
    headerStyle: "transparent",
  },
  effects: {
    heroStyle: "gradient",
    cardShadow: "soft",
    buttonStyle: "rounded",
    animationsEnabled: true,
  },
};

export interface ThemePreset {
  name: string;
  description: string;
  thumb: string[];
  colors: Partial<ThemeConfig["colors"]>;
  typography: Partial<ThemeConfig["typography"]>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Clássico Sagrado",
    description: "Azul real e dourado",
    thumb: ["#1a3a6b", "#c9a84c", "#fafaf8"],
    colors: {
      primary: "#1a3a6b",
      secondary: "#c9a84c",
      accent: "#c9a84c",
      background: "#fafaf8",
      backgroundAlt: "#f0ede6",
      text: "#1a1a2e",
      textMuted: "#6b6b7a",
    },
    typography: {
      fontHeading: "Cormorant Garamond",
      fontBody: "Lato",
    },
  },
  {
    name: "Moderno Vivo",
    description: "Roxo e magenta vibrante",
    thumb: ["#6d28d9", "#db2777", "#f9fafb"],
    colors: {
      primary: "#6d28d9",
      secondary: "#db2777",
      accent: "#f59e0b",
      background: "#ffffff",
      backgroundAlt: "#faf5ff",
      text: "#1e1b4b",
      textMuted: "#6d28d9",
    },
    typography: {
      fontHeading: "Josefin Sans",
      fontBody: "Nunito",
    },
  },
  {
    name: "Terra & Vida",
    description: "Verde esmeralda e bege",
    thumb: ["#065f46", "#d97706", "#fefce8"],
    colors: {
      primary: "#065f46",
      secondary: "#d97706",
      accent: "#10b981",
      background: "#fefce8",
      backgroundAlt: "#ecfdf5",
      text: "#1a2e1a",
      textMuted: "#4a6741",
    },
    typography: {
      fontHeading: "Lora",
      fontBody: "Source Sans Pro",
    },
  },
  {
    name: "Minimalista",
    description: "Preto, branco e cinza",
    thumb: ["#18181b", "#a1a1aa", "#fafafa"],
    colors: {
      primary: "#18181b",
      secondary: "#52525b",
      accent: "#a1a1aa",
      background: "#fafafa",
      backgroundAlt: "#f4f4f5",
      text: "#09090b",
      textMuted: "#71717a",
    },
    typography: {
      fontHeading: "Raleway",
      fontBody: "Open Sans",
    },
  },
];

export const GOOGLE_FONTS = [
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Cormorant Garamond",
  "Libre Baskerville",
  "EB Garamond",
  "Crimson Text",
  "Lato",
  "Nunito",
  "Raleway",
  "Poppins",
  "Montserrat",
  "Source Sans Pro",
  "Open Sans",
  "Josefin Sans",
  "Dancing Script",
  "Great Vibes",
  "Pacifico",
  "Sacramento",
];
