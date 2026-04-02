"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ExternalLink, Star, Calendar } from "lucide-react";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Anuncio {
  id: string;
  titulo: string;
  texto: string;
  arte: string;
  dataEvento: string;
  ativo: boolean;
  destaque: boolean;
  links?: Array<{ tipo_link: string; url: string; textoBotao?: string }>;
}

interface GrupoMensal {
  mes: string;
  ano: number;
  anuncios: Anuncio[];
}

type CardVariant = "mobile" | "desktop-destaque" | "desktop-regular";

enum TipoLink {
  FORMS = "forms",
  WHATSAPP = "whatsapp",
  INSTAGRAM = "instagram",
  FACEBOOK = "facebook",
  WEBSITE = "website",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLinkPrincipal(anuncio: Anuncio): string {
  if (!anuncio.links?.length) return "#";
  const prioridade = [TipoLink.FORMS, TipoLink.WHATSAPP, TipoLink.WEBSITE, TipoLink.INSTAGRAM, TipoLink.FACEBOOK];
  for (const tipo of prioridade) {
    const found = anuncio.links.find((l) => l.tipo_link === tipo);
    if (found) return found.url;
  }
  return anuncio.links[0].url;
}

function agruparPorMes(anuncios: Anuncio[]): GrupoMensal[] {
  const grupos: Record<string, GrupoMensal> = {};
  anuncios.forEach((anuncio) => {
    const data = new Date(anuncio.dataEvento);
    const mes = data.toLocaleString("pt-BR", { month: "long" });
    const ano = data.getFullYear();
    const chave = `${mes}-${ano}`;
    if (!grupos[chave]) grupos[chave] = { mes, ano, anuncios: [] };
    grupos[chave].anuncios.push(anuncio);
  });
  return Object.values(grupos).sort(
    (a, b) => new Date(a.anuncios[0].dataEvento).getTime() - new Date(b.anuncios[0].dataEvento).getTime()
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MonthDivider({ month, year }: { month: string; year: number }) {
  return (
    <div className="relative my-6 flex items-center">
      <div className="h-px flex-grow bg-[var(--color-border)]" />
      <span className="mx-4 flex shrink-0 items-center gap-2 text-sm font-semibold tracking-wide text-[var(--color-text-muted)]">
        <Calendar className="h-4 w-4" style={{ color: "var(--color-accent)" }} />
        {month} {year}
      </span>
      <div className="h-px flex-grow bg-[var(--color-border)]" />
    </div>
  );
}

function AnuncioCard({ anuncio, variant = "mobile" }: { anuncio: Anuncio; variant?: CardVariant }) {
  const href = getLinkPrincipal(anuncio);

  // aspect ratio por variante
  const aspectClass =
    variant === "desktop-destaque" ? "aspect-[16/10]" : "aspect-video";

  // hover border color por variante
  const hoverBorder =
    variant === "desktop-destaque"
      ? "group-hover:border-[var(--color-accent)]"
      : "group-hover:border-[var(--color-primary)]";

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block group">
      <div
        className={`
          relative overflow-hidden bg-[var(--color-surface)]
          rounded-[var(--border-radius)] border border-[var(--color-border)]
          shadow-md transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl
        `}
      >
        {/* External link icon */}
        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-black/60 p-1.5 backdrop-blur-sm">
            <ExternalLink className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Image */}
        <div className={`relative w-full ${aspectClass} bg-[var(--color-background-alt)]`}>
          <img
            src={anuncio.arte}
            alt={anuncio.titulo}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
          
        </div>

        {/* Hover border */}
        <div
          className={`absolute inset-0 rounded-[var(--border-radius)] border-2 border-transparent transition-colors duration-300 ${hoverBorder}`}
        />
      </div>
    </Link>
  );
}

// ─── States: Loading / Error / Empty ─────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        />
        <p className="text-[var(--color-text-muted)]">Carregando anúncios...</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="mx-auto max-w-sm px-4 text-center">
        <div className="mb-4 text-5xl">😢</div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">Algo deu errado</h3>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">{message}</p>
        <button onClick={onRetry} className="btn btn-primary">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mb-3 text-5xl">🔍</div>
      <h3 className="mb-1 text-base font-semibold text-[var(--color-text)]">
        Nenhum anúncio encontrado
      </h3>
      <p className="text-sm text-[var(--color-text-muted)]">Tente usar termos diferentes na busca</p>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (total <= 1) return null;

  const btnBase =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] transition-all duration-200";
  const btnActive =
    "bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:opacity-90 hover:scale-105";
  const btnDisabled =
    "bg-[var(--color-background-alt)] text-[var(--color-text-muted)] cursor-not-allowed opacity-50";

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button onClick={onPrev} disabled={page === 1} className={`${btnBase} ${page === 1 ? btnDisabled : btnActive}`}>
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-text)]">
        <span className="font-semibold">{page}</span>
        <span className="mx-1.5 text-[var(--color-text-muted)]">de</span>
        <span className="font-semibold">{total}</span>
      </span>

      <button onClick={onNext} disabled={page === total} className={`${btnBase} ${page === total ? btnDisabled : btnActive}`}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

export default function Anuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);

  const fetchAnuncios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/anuncios");
      if (!res.ok) throw new Error("Falha ao carregar anúncios");
      setAnuncios(await res.json());
    } catch (e) {
      setError("Não foi possível carregar os anúncios. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAnuncios(); }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchAnuncios} />;

  // ── Derived data ───────────────────────────────────────────────────────────

  const ativos = anuncios.filter((a) => a.ativo);
  const filtrados = ativos.filter(
    (a) =>
      a.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      a.texto.toLowerCase().includes(filtro.toLowerCase())
  );

  const destaques = filtrados.filter((a) => a.destaque);
  const regulares = [...filtrados.filter((a) => !a.destaque)].sort(
    (a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
  );

  const grupos = agruparPorMes(regulares);
  const totalPaginas = Math.max(1, Math.ceil(grupos.length / ITEMS_PER_PAGE));
  const gruposPaginados = grupos.slice((pagina - 1) * ITEMS_PER_PAGE, pagina * ITEMS_PER_PAGE);

  const handlePrev = () => { if (pagina > 1) { setPagina((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const handleNext = () => { if (pagina < totalPaginas) { setPagina((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* Header */}
      <SectionHeader title="QUADRO DE ANÚNCIOS" />

      {/* Search */}
      <div className="relative mx-auto mb-12 max-w-md">
        <input
          type="text"
          placeholder="Buscar anúncios..."
          value={filtro}
          onChange={(e) => { setFiltro(e.target.value); setPagina(1); }}
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-all focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
      </div>

      {/* ── Mobile layout ── */}
      <div className="lg:hidden">
        {destaques.length > 0 && (
          <div className="mb-12">
            <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-[var(--color-text)]">
              <Star className="h-4 w-4" style={{ color: "var(--color-accent)" }} fill="currentColor" />
              Anúncios em Destaque
            </h3>
            <div className="space-y-6">
              {destaques.map((a) => <AnuncioCard key={a.id} anuncio={a} variant="mobile" />)}
            </div>
          </div>
        )}

        {grupos.length > 0 ? (
          grupos.map((g) => (
            <div key={`${g.mes}-${g.ano}`}>
              <MonthDivider month={capitalize(g.mes)} year={g.ano} />
              <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {g.anuncios.map((a) => <AnuncioCard key={a.id} anuncio={a} variant="mobile" />)}
              </div>
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">

        {/* Destaques — col 4 */}
        <div className="col-span-4">
          <div className="sticky top-6">
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-[var(--color-text)]">
              <Star className="h-4 w-4" style={{ color: "var(--color-accent)" }} fill="currentColor" />
              Anúncios em Destaque
            </h3>
            {destaques.length > 0 ? (
              <div className="space-y-4">
                {destaques.map((a) => <AnuncioCard key={a.id} anuncio={a} variant="desktop-destaque" />)}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
                <Star className="mx-auto mb-2 h-10 w-10 opacity-30" />
                Nenhum anúncio em destaque
              </div>
            )}
          </div>
        </div>

        {/* Divider — col 1 */}
        <div className="col-span-1 flex justify-center">
          <div className="w-px bg-[var(--color-border)]" />
        </div>

        {/* Calendário — col 7 */}
        <div className="col-span-7">
          <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-[var(--color-text)]">
            <Calendar className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
            Calendário
          </h3>

          {gruposPaginados.length > 0 ? (
            gruposPaginados.map((g) => (
              <div key={`${g.mes}-${g.ano}`} className="mb-10">
                <MonthDivider month={capitalize(g.mes)} year={g.ano} />
                <div className="grid grid-cols-2 gap-4">
                  {g.anuncios.map((a) => <AnuncioCard key={a.id} anuncio={a} variant="desktop-regular" />)}
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}

          <Pagination page={pagina} total={totalPaginas} onPrev={handlePrev} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
}