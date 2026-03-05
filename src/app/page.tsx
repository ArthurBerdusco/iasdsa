// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Element } from "react-scroll";
import { ComponenteConfig, UseComponentConfigReturn, ApiResponse } from "@/types/components";

// Componentes
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import ProgramacaoCultos from "./components/ProgramacaoSection";
import AnunciosSection from "./components/AnunciosSection";
import PedidoOracao from "./components/PedidoOracao";
import DizimoSection from "./components/DizimoSection";
import FotosBlob from "./components/FotosBlob";
import FotosDaSemana from "./components/FotosDaSemana";
import Footer from "./components/Footer";
import RedesSociais from "./components/CultosSemana";
import MensagemPastoral from "./components/MensagemPastoral";

// ─── Hook de config ────────────────────────────────────────────────
const DEFAULT_CONFIG: ComponenteConfig = {
  cultos: true,
  mensagem_pastoral: false,
  programacao_cultos: true,
  anuncios: true,
  pedido_oracao: true,
  fotos_blob: false,
  fotos_semana: false,
  dizimo: true,
  redes_sociais: true,
};

function useComponentConfig(): UseComponentConfigReturn {
  const [config, setConfig] = useState<ComponenteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/componentes-config");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiResponse<ComponenteConfig> = await res.json();
        if (data.error) throw new Error(data.error);
        if (data.config) setConfig(data.config);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { config, loading, error };
}

// ─── Loading ───────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="flex items-center gap-3 text-[var(--color-text)]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-current" />
        <span className="text-xl">Carregando...</span>
      </div>
    </div>
  );
}

// ─── Seção padronizada ─────────────────────────────────────────────
// Wrapper que garante espaçamento e largura consistentes em todos os componentes
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Element name={id}>
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8 xl:py-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </section>
    </Element>
  );
}

// ─── Page ──────────────────────────────────────────────────────────
export default function Home() {
  const { config, loading, error } = useComponentConfig();

  if (loading) return <LoadingSpinner />;
  if (error) console.warn("Config padrão em uso. Erro:", error);

  return (
    // bg usa a CSS var injetada pelo layout — sem duplicar o tema aqui
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <NavBar />

      <main>
        {config.cultos && (
          <Section id="cultos">
            <HeroSection />
          </Section>
        )}

        {config.mensagem_pastoral && (
          <Section id="mensagem">
            <MensagemPastoral />
          </Section>
        )}

        {config.programacao_cultos && (
          <Section id="programacao">
            <ProgramacaoCultos />
          </Section>
        )}

        {config.anuncios && (
          <Section id="anuncios">
            <AnunciosSection />
          </Section>
        )}

        {config.pedido_oracao && (
          <Section id="oracao">
            <PedidoOracao />
          </Section>
        )}

        {config.fotos_semana && (
          <Section id="fotos">
            <FotosDaSemana />
          </Section>
        )}

        {config.fotos_blob && (
          <Section id="blob">
            <FotosBlob />
          </Section>
        )}

        {config.dizimo && (
          <Section id="dizimo">
            <DizimoSection />
          </Section>
        )}

        {config.redes_sociais && (
          <Section id="redes">
            <RedesSociais />
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}