// app/page.tsx
// ─── SERVER COMPONENT — sem "use client", sem useState, sem useEffect ───────
// A config é buscada no servidor durante o render, eliminando o spinner de loading.

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

import { getCultos } from "./lib/db/cultos";
import ProgramacaoCultosSkeleton from "./components/skeletons/ProgramacaoCultosSkeleton";
import { getAnuncios } from "./lib/db/anuncios";
import CultosSkeleton from "./components/skeletons/HeroSectionSkeleton";
import { AnunciosSkeleton } from "./components/skeletons/AnunciosSectionSkeleton";
import { getMensagemPastoral } from "./lib/db/mensagemPastoral";
import { getComponenteConfig } from "./lib/db/config";



// ─── Page (Server Component) ───────────────────────────────────────
export default async function Home() {
  const config = await getComponenteConfig();
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
              <MensagemPastoral mensagem={mensagem} />
            </Suspense>
          </ScrollSection>
        )}

        {config.programacao_cultos && (
          <ScrollSection id="programacao">
            <Suspense fallback={<ProgramacaoCultosSkeleton />}>
              <ProgramacaoCultos />
            </Suspense>
          </ScrollSection>
        )}


        {config.anuncios && (
          <ScrollSection id="anuncios">
            <Suspense fallback={<AnunciosSkeleton />}>
              <AnunciosSection anuncios={anuncios} />
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