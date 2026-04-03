// app/page.tsx
// ─── SERVER COMPONENT — sem "use client", sem useState, sem useEffect ───────
// A config é buscada no servidor durante o render, eliminando o spinner de loading.

import { ComponenteConfig } from "@/types/components";
import ScrollSection from "./components/ScrollSection";

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
import { Suspense } from "react";
import { MensagemPastoralSkeleton } from "./components/skeletons/MensagemPastoralSkeleton";

import { getCultos } from "./components/lib/cultos";
import ProgramacaoCultosSkeleton from "./components/skeletons/ProgramacaoCultosSkeleton";
import { getAnuncios } from "./components/lib/anuncios";
import CultosSkeleton from "./components/skeletons/HeroSectionSkeleton";
import { AnunciosSkeleton } from "./components/skeletons/AnunciosSectionSkeleton";
import { getMensagemPastoral } from "./components/lib/mensagemPastoral";

// ─── Config padrão (fallback se a API falhar) ──────────────────────
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

// ─── Busca no servidor (zero latência no cliente) ──────────────────
// Roda em tempo de build (SSG) ou a cada requisição (SSR).
// Para SSG com revalidação periódica, adicione: { next: { revalidate: 60 } }
async function getComponentConfig(): Promise<ComponenteConfig> {
  try {
    // Em Server Components, use a URL absoluta ou a env var da base URL.
    // process.env.NEXT_PUBLIC_BASE_URL deve estar configurada no .env
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/componentes-config`, {
      // Revalida a config a cada 60 segundos (ISR).
      // Troque por cache: "no-store" se precisar sempre do valor mais recente.
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    return data.config ?? DEFAULT_CONFIG;
  } catch (err) {
    // API indisponível: usa config padrão silenciosamente.
    // Em produção, considere logar no servidor: console.error(err)
    console.warn("[page] Usando config padrão. Erro:", err);
    return DEFAULT_CONFIG;
  }
}

// ─── Page (Server Component) ───────────────────────────────────────
export default async function Home() {
  const config = await getComponentConfig();

  const cultos = await getCultos();
  const mensagem = await getMensagemPastoral();
  const anuncios = await getAnuncios();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <NavBar />

      <main>
        {config.cultos && (
          <ScrollSection id="cultos">
            <Suspense fallback={<CultosSkeleton />}>
              <HeroSection cultos={cultos} />
            </Suspense>
          </ScrollSection>
        )}

        {config.mensagem_pastoral && (
          <ScrollSection id="mensagem">
            <Suspense fallback={<MensagemPastoralSkeleton />}>
              <MensagemPastoral mensagem={mensagem}/>
            </Suspense>
          </ScrollSection>
        )}

        {config.programacao_cultos && (
          <ScrollSection id="programacao">
            <Suspense fallback={<ProgramacaoCultosSkeleton/>}>
              <ProgramacaoCultos />
            </Suspense>
          </ScrollSection>
        )}

        
        {config.anuncios && (
          <ScrollSection id="anuncios">
            <Suspense fallback={<AnunciosSkeleton/>}>
              <AnunciosSection anuncios={anuncios}/>
              </Suspense>
          </ScrollSection>
        )}


        {config.pedido_oracao && (
          <ScrollSection id="oracao">
            <PedidoOracao />
          </ScrollSection>
        )}

        {config.fotos_semana && (
          <ScrollSection id="fotos">
            <FotosDaSemana />
          </ScrollSection>
        )}

        {config.fotos_blob && (
          <ScrollSection id="blob">
            <FotosBlob />
          </ScrollSection>
        )}

        {config.dizimo && (
          <ScrollSection id="dizimo">
            <DizimoSection />
          </ScrollSection>
        )}

        {config.redes_sociais && (
          <ScrollSection id="redes">
            <RedesSociais />
          </ScrollSection>
        )}
        
      </main>

      <Footer />
    </div>
  );
}