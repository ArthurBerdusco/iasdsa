// app/boletins/[semana]/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarRange, History } from "lucide-react";

import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Container from "../../components/ui/Container";
import HeroSection from "../../components/HeroSection";
import MensagemPastoral from "../../components/MensagemPastoral";
import AnunciosSection from "../../components/AnunciosSection";
import { getBoletimPorSemana } from "../../lib/db/boletins";

type Props = { params: Promise<{ semana: string }> };

function formatDatePt(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { semana } = await params;
  const boletim = await getBoletimPorSemana(decodeURIComponent(semana));

  return {
    title: boletim
      ? `${boletim.titulo} | Boletim IASD Santo Amaro`
      : "Boletim não encontrado",
    description: "Registro histórico de um boletim semanal da Igreja Adventista de Santo Amaro.",
  };
}

export default async function BoletimDetalhePage({ params }: Props) {
  noStore();
  const { semana } = await params;
  const boletim = await getBoletimPorSemana(decodeURIComponent(semana));

  if (!boletim) notFound();

  const { snapshot } = boletim;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <NavBar />

      <main className="pt-24 pb-20">
        <Container size="lg">
          <Link
            href="/boletins"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={15} />
            Voltar para todos os boletins
          </Link>

          {/* Banner de contexto — deixa claro que é um registro histórico */}
          <div
            className="mb-8 flex flex-wrap items-center gap-3 rounded-[var(--border-radius)] border px-5 py-4"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-background-alt)",
            }}
          >
            <History size={18} style={{ color: "var(--color-accent)" }} />
            <div>
              <p className="text-sm font-semibold">{boletim.titulo}</p>
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <CalendarRange size={12} />
                {formatDatePt(boletim.dataInicio)} a {formatDatePt(boletim.dataFim)} · registro
                histórico, não reflete a programação atual
              </p>
            </div>
          </div>
        </Container>

        {snapshot.config.cultos && snapshot.cultos.length > 0 && (
          <HeroSection cultos={snapshot.cultos} />
        )}

        {snapshot.config.mensagem_pastoral && snapshot.mensagemPastoral && (
          <MensagemPastoral mensagem={snapshot.mensagemPastoral} />
        )}

        {snapshot.config.anuncios && snapshot.anuncios.length > 0 && (
          <AnunciosSection anuncios={snapshot.anuncios} />
        )}
      </main>

      <Footer />
    </div>
  );
}
