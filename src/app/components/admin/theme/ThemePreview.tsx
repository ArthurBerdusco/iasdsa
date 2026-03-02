// ============================================================
// components/admin/theme/ThemePreview.tsx
// Preview em tempo real da landing page com o tema aplicado
// ============================================================

"use client";

import { ThemeConfig } from "@/types/theme";
import { generateGoogleFontsURL } from "@/lib/theme-repository";

interface ThemePreviewProps {
  theme: ThemeConfig;
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const { colors, typography, layout, effects } = theme;

  const heroGradient =
    effects.heroStyle === "gradient"
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : effects.heroStyle === "image-overlay"
      ? `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.secondary}99 100%)`
      : colors.primary;

  const btnRadius =
    effects.buttonStyle === "pill"
      ? 50
      : effects.buttonStyle === "rounded"
      ? layout.borderRadius
      : 2;

  const cardShadow =
    effects.cardShadow === "soft"
      ? "0 4px 24px rgba(0,0,0,0.08)"
      : effects.cardShadow === "hard"
      ? "4px 4px 0 rgba(0,0,0,0.2)"
      : "none";

  const fontsURL = generateGoogleFontsURL(theme);

  const cultos = [
    { dia: "Domingo", hora: "9:00", tipo: "Culto Matutino" },
    { dia: "Quarta", hora: "19:30", tipo: "Culto de Oração" },
    { dia: "Sábado", hora: "18:00", tipo: "Jovens" },
  ];

  return (
    <div
      style={{
        fontFamily: `var(--preview-font-body, ${typography.fontBody})`,
        fontSize: typography.sizeBase,
        color: colors.text,
        background: colors.background,
        borderRadius: 12,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Carrega as fontes do Google */}
      <link rel="stylesheet" href={fontsURL} />

      {/* ── Header ── */}
      <header
        style={{
          background:
            layout.headerStyle === "transparent"
              ? "transparent"
              : layout.headerStyle === "white"
              ? "#fff"
              : colors.primary,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color:
            layout.headerStyle === "white" ? colors.text : colors.textInverse,
          position: "relative",
          zIndex: 2,
          boxShadow:
            layout.headerStyle === "white"
              ? "0 2px 8px rgba(0,0,0,0.06)"
              : "none",
        }}
      >
        <span
          style={{
            fontFamily: typography.fontAccent,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          ⛪ Igreja
        </span>
        <nav style={{ display: "flex", gap: 18, fontSize: 12, fontWeight: 600 }}>
          {["Cultos", "Sobre", "Contato"].map((n) => (
            <a
              key={n}
              style={{ color: "inherit", textDecoration: "none", opacity: 0.9 }}
            >
              {n}
            </a>
          ))}
        </nav>
      </header>

      {/* ── Hero ── */}
      <div
        style={{
          background: heroGradient,
          padding: "44px 24px 40px",
          textAlign: "center",
          color: colors.textInverse,
          marginTop: layout.headerStyle === "transparent" ? -52 : 0,
          paddingTop: layout.headerStyle === "transparent" ? 84 : 44,
        }}
      >
        <p
          style={{
            fontFamily: typography.fontAccent,
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 8,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Bem-vindo à
        </p>
        <h1
          style={{
            fontFamily: typography.fontHeading,
            fontSize: typography.sizeH1 * 0.52,
            fontWeight: Number(typography.headingWeight),
            lineHeight: 1.15,
            marginBottom: 14,
            textShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          Igreja da Graça
        </h1>
        <p
          style={{
            fontSize: 13,
            opacity: 0.85,
            maxWidth: 320,
            margin: "0 auto 22px",
            lineHeight: typography.lineHeight,
          }}
        >
          Um lugar de fé, amor e esperança para toda a família.
        </p>
        <button
          style={{
            background: colors.accent,
            color: "#000",
            border: "none",
            borderRadius: btnRadius,
            padding: "9px 24px",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          Programação →
        </button>
      </div>

      {/* ── Cards Section ── */}
      <div
        style={{
          background: colors.backgroundAlt,
          padding: "24px 18px",
          flex: 1,
        }}
      >
        <h2
          style={{
            fontFamily: typography.fontHeading,
            fontSize: typography.sizeH2 * 0.52,
            color: colors.text,
            textAlign: "center",
            marginBottom: 18,
            fontWeight: Number(typography.headingWeight),
          }}
        >
          Próximos Cultos
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {cultos.map((c) => (
            <div
              key={c.dia}
              style={{
                background: colors.surface,
                borderRadius: layout.borderRadius,
                padding: "12px 10px",
                boxShadow: cardShadow,
                borderTop: `3px solid ${colors.primary}`,
              }}
            >
              <p
                style={{
                  fontFamily: typography.fontHeading,
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.primary,
                  marginBottom: 2,
                }}
              >
                {c.dia}
              </p>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: colors.text,
                  fontFamily: typography.fontHeading,
                }}
              >
                {c.hora}
              </p>
              <p style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                {c.tipo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
