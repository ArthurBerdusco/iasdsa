// ============================================================
// components/admin/theme/ThemeEditorPage.tsx
// Página principal do editor — junta tudo
// ============================================================

"use client";

import { useState } from "react";
import { ThemeConfig } from "@/types/theme";
import { THEME_PRESETS, GOOGLE_FONTS } from "@/lib/theme-defaults";
import { generateCSSVariables } from "@/lib/theme-repository";
import { useThemeEditor } from "@/hooks/useThemeEditor";
import { ThemePreview } from "./ThemePreview";
import {
  ColorSwatch,
  SliderField,
  SelectField,
  ToggleField,
  CollapsibleSection,
} from "./ThemeEditorControls";

interface ThemeEditorPageProps {
  initialTheme?: ThemeConfig;
}

const TABS = [
  { id: "presets", label: "✨ Presets" },
  { id: "cores", label: "🎨 Cores" },
  { id: "tipografia", label: "Aa Tipografia" },
  { id: "layout", label: "⬜ Layout" },
  { id: "efeitos", label: "✦ Efeitos" },
  { id: "codigo", label: "</> CSS" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ThemeEditorPage({ initialTheme }: ThemeEditorPageProps) {
  const {
    theme,
    saveStatus,
    updateColors,
    updateTypography,
    updateLayout,
    updateEffects,
    applyPreset,
    resetTheme,
    saveTheme,
  } = useThemeEditor(initialTheme);

  const [activeTab, setActiveTab] = useState<TabId>("presets");

  const saveLabel = {
    idle: "💾 Salvar",
    saving: "Salvando...",
    saved: "✓ Salvo!",
    error: "✗ Erro ao salvar",
  }[saveStatus];

  const saveBg = {
    idle: "#1a56db",
    saving: "#94a3b8",
    saved: "#10b981",
    error: "#ef4444",
  }[saveStatus];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      {/* ── LEFT PANEL ── */}
      <div className="w-[380px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-900 m-0">
                🎨 Design do Site
              </h2>
              <p className="text-[12px] text-slate-500 mt-1 mb-0">
                Identidade visual da landing page
              </p>
            </div>
            <button
              onClick={saveTheme}
              disabled={saveStatus === "saving"}
              className="text-white border-none rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer transition-colors duration-300 disabled:opacity-60"
              style={{ background: saveBg }}
            >
              {saveLabel}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="whitespace-nowrap px-3 py-2 border-none bg-transparent text-[12px] cursor-pointer transition-colors"
                style={{
                  borderBottom:
                    activeTab === t.id
                      ? "2px solid #1a56db"
                      : "2px solid transparent",
                  color: activeTab === t.id ? "#1a56db" : "#64748b",
                  fontWeight: activeTab === t.id ? 700 : 500,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* ── PRESETS ── */}
          {activeTab === "presets" && (
            <div>
              <p className="text-[13px] text-slate-500 mb-4">
                Escolha um tema base e personalize depois.
              </p>
              <div className="flex flex-col gap-2.5">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="flex items-center gap-3.5 p-3.5 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer text-left transition-all hover:border-blue-500"
                  >
                    <div className="flex gap-0.5 shrink-0">
                      {p.thumb.map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-9 border border-black/5"
                          style={{
                            background: c,
                            borderRadius:
                              i === 0
                                ? "6px 0 0 6px"
                                : i === p.thumb.length - 1
                                ? "0 6px 6px 0"
                                : 0,
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 m-0">
                        {p.name}
                      </p>
                      <p className="text-[12px] text-slate-500 mt-0.5 mb-0">
                        {p.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CORES ── */}
          {activeTab === "cores" && (
            <>
              <CollapsibleSection title="Cores da Marca" icon="🏷️">
                <div className="grid grid-cols-2 gap-3">
                  <ColorSwatch
                    label="Primária"
                    color={theme.colors.primary}
                    onChange={(v) => updateColors("primary", v)}
                  />
                  <ColorSwatch
                    label="Secundária"
                    color={theme.colors.secondary}
                    onChange={(v) => updateColors("secondary", v)}
                  />
                  <ColorSwatch
                    label="Destaque (Accent)"
                    color={theme.colors.accent}
                    onChange={(v) => updateColors("accent", v)}
                  />
                  <ColorSwatch
                    label="Borda"
                    color={theme.colors.border}
                    onChange={(v) => updateColors("border", v)}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Fundos" icon="🖼️">
                <div className="grid grid-cols-2 gap-3">
                  <ColorSwatch
                    label="Background"
                    color={theme.colors.background}
                    onChange={(v) => updateColors("background", v)}
                  />
                  <ColorSwatch
                    label="Background Alt"
                    color={theme.colors.backgroundAlt}
                    onChange={(v) => updateColors("backgroundAlt", v)}
                  />
                  <ColorSwatch
                    label="Surface (Cards)"
                    color={theme.colors.surface}
                    onChange={(v) => updateColors("surface", v)}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Textos" icon="✍️">
                <div className="grid grid-cols-2 gap-3">
                  <ColorSwatch
                    label="Principal"
                    color={theme.colors.text}
                    onChange={(v) => updateColors("text", v)}
                  />
                  <ColorSwatch
                    label="Secundário"
                    color={theme.colors.textMuted}
                    onChange={(v) => updateColors("textMuted", v)}
                  />
                  <ColorSwatch
                    label="Inverso"
                    color={theme.colors.textInverse}
                    onChange={(v) => updateColors("textInverse", v)}
                  />
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* ── TIPOGRAFIA ── */}
          {activeTab === "tipografia" && (
            <>
              <CollapsibleSection title="Fontes" icon="🔤">
                <SelectField
                  label="Fonte dos Títulos"
                  value={theme.typography.fontHeading}
                  onChange={(v) => updateTypography("fontHeading", v)}
                  options={GOOGLE_FONTS}
                />
                <SelectField
                  label="Fonte do Corpo"
                  value={theme.typography.fontBody}
                  onChange={(v) => updateTypography("fontBody", v)}
                  options={GOOGLE_FONTS}
                />
                <SelectField
                  label="Fonte Decorativa (logo)"
                  value={theme.typography.fontAccent}
                  onChange={(v) => updateTypography("fontAccent", v)}
                  options={GOOGLE_FONTS}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Tamanhos" icon="📐">
                <SliderField
                  label="Base"
                  value={theme.typography.sizeBase}
                  onChange={(v) => updateTypography("sizeBase", v)}
                  min={12}
                  max={22}
                />
                <SliderField
                  label="H1"
                  value={theme.typography.sizeH1}
                  onChange={(v) => updateTypography("sizeH1", v)}
                  min={28}
                  max={96}
                />
                <SliderField
                  label="H2"
                  value={theme.typography.sizeH2}
                  onChange={(v) => updateTypography("sizeH2", v)}
                  min={20}
                  max={72}
                />
                <SliderField
                  label="H3"
                  value={theme.typography.sizeH3}
                  onChange={(v) => updateTypography("sizeH3", v)}
                  min={16}
                  max={48}
                />
                <SliderField
                  label="Altura de Linha"
                  value={theme.typography.lineHeight}
                  onChange={(v) => updateTypography("lineHeight", v)}
                  min={1}
                  max={3}
                  unit="x"
                />
              </CollapsibleSection>

              <CollapsibleSection title="Estilo" icon="🎭">
                <SelectField
                  label="Peso dos Títulos"
                  value={theme.typography.headingWeight}
                  onChange={(v) => updateTypography("headingWeight", v)}
                  options={["400", "500", "600", "700", "800", "900"]}
                />
                <SelectField
                  label="Espaçamento entre Letras"
                  value={theme.typography.letterSpacing}
                  onChange={(v) => updateTypography("letterSpacing", v)}
                  options={["0", "-0.02em", "0.02em", "0.05em", "0.1em"]}
                />
              </CollapsibleSection>
            </>
          )}

          {/* ── LAYOUT ── */}
          {activeTab === "layout" && (
            <>
              <CollapsibleSection title="Estrutura" icon="⬜">
                <SliderField
                  label="Largura Máxima"
                  value={theme.layout.containerWidth}
                  onChange={(v) => updateLayout("containerWidth", v)}
                  min={800}
                  max={1600}
                  unit="px"
                />
                <SliderField
                  label="Espaçamento das Seções"
                  value={theme.layout.sectionPadding}
                  onChange={(v) => updateLayout("sectionPadding", v)}
                  min={20}
                  max={160}
                  unit="px"
                />
                <SliderField
                  label="Arredondamento"
                  value={theme.layout.borderRadius}
                  onChange={(v) => updateLayout("borderRadius", v)}
                  min={0}
                  max={24}
                  unit="px"
                />
              </CollapsibleSection>

              <CollapsibleSection title="Header" icon="📌">
                <SelectField
                  label="Estilo do Header"
                  value={theme.layout.headerStyle}
                  onChange={(v) =>
                    updateLayout(
                      "headerStyle",
                      v as ThemeConfig["layout"]["headerStyle"]
                    )
                  }
                  options={["transparent", "white", "colored"]}
                />
              </CollapsibleSection>
            </>
          )}

          {/* ── EFEITOS ── */}
          {activeTab === "efeitos" && (
            <>
              <CollapsibleSection title="Hero / Banner" icon="🌟">
                <SelectField
                  label="Estilo do Hero"
                  value={theme.effects.heroStyle}
                  onChange={(v) =>
                    updateEffects(
                      "heroStyle",
                      v as ThemeConfig["effects"]["heroStyle"]
                    )
                  }
                  options={["gradient", "solid", "image-overlay"]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Componentes" icon="🃏">
                <SelectField
                  label="Sombra dos Cards"
                  value={theme.effects.cardShadow}
                  onChange={(v) =>
                    updateEffects(
                      "cardShadow",
                      v as ThemeConfig["effects"]["cardShadow"]
                    )
                  }
                  options={["soft", "hard", "none"]}
                />
                <SelectField
                  label="Estilo dos Botões"
                  value={theme.effects.buttonStyle}
                  onChange={(v) =>
                    updateEffects(
                      "buttonStyle",
                      v as ThemeConfig["effects"]["buttonStyle"]
                    )
                  }
                  options={["rounded", "pill", "square"]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Animações" icon="✨">
                <ToggleField
                  label="Animações habilitadas"
                  description="Scroll reveals e hover effects"
                  value={theme.effects.animationsEnabled}
                  onChange={(v) => updateEffects("animationsEnabled", v)}
                />
              </CollapsibleSection>
            </>
          )}

          {/* ── CSS OUTPUT ── */}
          {activeTab === "codigo" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] text-slate-500 m-0">
                  Variáveis CSS geradas automaticamente.
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(generateCSSVariables(theme))
                  }
                  className="text-[12px] bg-blue-50 text-blue-600 border border-blue-200 rounded-md px-3 py-1 cursor-pointer font-semibold"
                >
                  Copiar
                </button>
              </div>
              <pre className="bg-slate-900 text-sky-300 p-4 rounded-xl text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap m-0">
                {generateCSSVariables(theme)}
              </pre>
              <div className="mt-3.5 p-3.5 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-[12px] font-bold text-green-800 m-0 mb-1.5">
                  💡 Como usar no Next.js
                </p>
                <p className="text-[12px] text-green-700 m-0 leading-relaxed">
                  No seu <code>app/layout.tsx</code>, importe{" "}
                  <code>getTheme()</code> e injete o CSS via{" "}
                  <code>generateCSSVariables()</code> em uma tag{" "}
                  <code>&lt;style&gt;</code>. Todos os componentes usam{" "}
                  <code>var(--color-primary)</code> etc.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex gap-2">
          <button
            onClick={resetTheme}
            className="flex-1 py-2 border border-slate-200 rounded-lg bg-white text-[13px] cursor-pointer text-slate-500 font-medium"
          >
            ↺ Resetar
          </button>
          <button
            onClick={saveTheme}
            disabled={saveStatus === "saving"}
            className="flex-[2] py-2 border-none rounded-lg text-white text-[13px] font-bold cursor-pointer transition-colors duration-300 disabled:opacity-60"
            style={{ background: saveBg }}
          >
            {saveLabel}
          </button>
        </div>
      </div>

      {/* ── RIGHT — LIVE PREVIEW ── */}
      <div className="flex-1 p-8 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="m-0 text-[16px] font-bold text-slate-900">
              Preview em Tempo Real
            </h3>
            <p className="m-0 mt-1 text-[12px] text-slate-400">
              As alterações são refletidas instantaneamente
            </p>
          </div>
        </div>

        {/* Browser mockup */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2.5 border-b border-slate-200">
            <div className="flex gap-1.5">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 border border-slate-200">
              🔒 www.igrejadagraca.com.br
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ThemePreview theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
