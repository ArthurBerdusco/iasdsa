// ============================================================
// types/theme.ts
// Tipagem central do sistema de tema
// ============================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
}

export interface ThemeTypography {
  fontHeading: string;
  fontBody: string;
  fontAccent: string;
  sizeBase: number;
  sizeH1: number;
  sizeH2: number;
  sizeH3: number;
  lineHeight: number;
  letterSpacing: string;
  headingWeight: string;
}

export interface ThemeLayout {
  borderRadius: number;
  containerWidth: number;
  sectionPadding: number;
  headerStyle: "transparent" | "white" | "colored";
}

export interface ThemeEffects {
  heroStyle: "gradient" | "solid" | "image-overlay";
  cardShadow: "soft" | "hard" | "none";
  buttonStyle: "rounded" | "pill" | "square";
  animationsEnabled: boolean;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  effects: ThemeEffects;
}

// Tipo retornado pelo banco
export interface ThemeRow {
  id: number;
  chave: string;
  valor: string; // JSON stringificado
  criado_em: string;
  atualizado_em: string;
}
