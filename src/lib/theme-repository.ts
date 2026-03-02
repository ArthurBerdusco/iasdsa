// ============================================================
// lib/theme-repository.ts
// Camada de acesso ao banco — Neon PostgreSQL via @vercel/postgres
// ============================================================

import { neon } from "@neondatabase/serverless";
import { ThemeConfig } from "@/types/theme";
import { DEFAULT_THEME } from "./theme-defaults";

const THEME_KEY = "site_theme";

// Mesma forma que você usa no resto do projeto


/**
 * Busca o tema atual do banco.
 * Retorna o DEFAULT_THEME se não houver registro.
 */
export async function getTheme(): Promise<ThemeConfig> {
  const sql = neon(process.env.DATABASE_URL as string);
  try {
    const rows = await sql`
      SELECT valor FROM theme_config
      WHERE chave = ${THEME_KEY}
      LIMIT 1
    `;

    if (rows.length === 0) return DEFAULT_THEME;

    return JSON.parse(rows[0].valor) as ThemeConfig;
  } catch (error) {
    console.error("[theme-repository] Erro ao buscar tema:", error);
    return DEFAULT_THEME;
  }
}

/**
 * Salva ou atualiza o tema no banco (upsert).
 */
export async function saveTheme(theme: ThemeConfig): Promise<boolean> {
  const sql = neon(process.env.DATABASE_URL as string);
  try {
    const valor = JSON.stringify(theme);

    await sql`
      INSERT INTO theme_config (chave, valor)
      VALUES (${THEME_KEY}, ${valor})
      ON CONFLICT (chave)
      DO UPDATE SET
        valor         = EXCLUDED.valor,
        atualizado_em = CURRENT_TIMESTAMP
    `;

    return true;
  } catch (error) {
    console.error("[theme-repository] Erro ao salvar tema:", error);
    return false;
  }
}

/**
 * Gera o bloco de CSS variables a partir de um ThemeConfig.
 * Usado no layout.tsx do Next.js para injetar via SSR.
 */
export function generateCSSVariables(theme: ThemeConfig): string {
  const { colors, typography, layout } = theme;

  return `
:root {
  /* Cores da marca */
  --color-primary:        ${colors.primary};
  --color-secondary:      ${colors.secondary};
  --color-accent:         ${colors.accent};
  --color-background:     ${colors.background};
  --color-background-alt: ${colors.backgroundAlt};
  --color-surface:        ${colors.surface};
  --color-text:           ${colors.text};
  --color-text-muted:     ${colors.textMuted};
  --color-text-inverse:   ${colors.textInverse};
  --color-border:         ${colors.border};

  /* Tipografia */
  --font-heading:       '${typography.fontHeading}', serif;
  --font-body:          '${typography.fontBody}', sans-serif;
  --font-accent:        '${typography.fontAccent}', cursive;
  --font-size-base:     ${typography.sizeBase}px;
  --font-size-h1:       ${typography.sizeH1}px;
  --font-size-h2:       ${typography.sizeH2}px;
  --font-size-h3:       ${typography.sizeH3}px;
  --line-height:        ${typography.lineHeight};
  --heading-weight:     ${typography.headingWeight};
  --letter-spacing:     ${typography.letterSpacing};

  /* Layout */
  --border-radius:      ${layout.borderRadius}px;
  --container-width:    ${layout.containerWidth}px;
  --section-padding:    ${layout.sectionPadding}px;
}`.trim();
}

/**
 * Gera a URL de import do Google Fonts baseado nas fontes do tema.
 */
export function generateGoogleFontsURL(theme: ThemeConfig): string {
  const fonts = [
    theme.typography.fontHeading,
    theme.typography.fontBody,
    theme.typography.fontAccent,
  ]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700;800`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
}