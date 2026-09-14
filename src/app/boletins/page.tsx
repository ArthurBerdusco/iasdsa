// app/boletins/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarRange, Mic2, Bell, ArrowRight, ScrollText } from "lucide-react";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Container from "../components/ui/Container";
import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";
import { listBoletins } from "../lib/db/boletins";

export const metadata: Metadata = {
  title: "Boletins Anteriores | Igreja Adventista de Santo Amaro",
  description: "Registro histórico dos boletins semanais da Igreja Adventista de Santo Amaro.",
};

function formatDatePt(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default async function BoletinsPage() {
  noStore();
  const boletins = await listBoletins();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <NavBar />

      <main className="pt-28 pb-20">
        <Container size="lg">
          <SectionHeader
            eyebrow="Registro da Igreja"
            title="Boletins Anteriores"
            subtitle="Todo boletim semanal fica guardado aqui — um registro histórico do que viveu a nossa igreja, semana após semana."
          />

          {boletins.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-[var(--border-radius)] border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
              <ScrollText size={32} style={{ color: "var(--color-text-muted)" }} />
              <h3 className="mt-4 text-lg font-semibold">Ainda não há boletins arquivados</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Assim que a primeira semana for arquivada pelo admin (ou automaticamente
                toda segunda-feira), ela aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boletins.map((b) => (
                <Link key={b.id} href={`/boletins/${encodeURIComponent(b.semanaReferencia)}`}>
                  <Card hover className="group h-full">
                    <p
                      className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--color-accent)" }}
                    >
                      <CalendarRange size={13} />
                      {formatDatePt(b.dataInicio)} — {formatDatePt(b.dataFim)}
                    </p>
                    <h3 className="text-lg font-bold leading-snug">{b.titulo}</h3>

                    <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Mic2 size={13} /> {b.totalCultos} culto{b.totalCultos === 1 ? "" : "s"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell size={13} /> {b.totalAnuncios} anúncio{b.totalAnuncios === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div
                      className="mt-4 flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Ver boletim completo
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
