"use client";
// app/admin/boletins/page.tsx
// ─── Painel de controle dos boletins arquivados ─────────────────────────────
// Permite ver o histórico, arquivar manualmente a semana atual (útil antes de
// sobrescrever cultos/anúncios com a semana seguinte) e remover registros.

import { useEffect, useState, useCallback } from "react";
import {
  Archive,
  CalendarRange,
  ExternalLink,
  Loader2,
  Mic2,
  Bell,
  Trash2,
  History,
} from "lucide-react";

import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import AdminCard from "../../components/admin/ui/AdminCard";
import EmptyState from "../../components/admin/ui/EmptyState";
import { BoletimResumo } from "@/types/boletim";

function formatDatePt(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function AdminBoletinsPage() {
  const [boletins, setBoletins] = useState<BoletimResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchBoletins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boletins");
      const data = await res.json();
      setBoletins(data.boletins ?? []);
    } catch {
      setFeedback("Erro ao carregar boletins.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoletins();
  }, [fetchBoletins]);

  const handleArchiveNow = async () => {
    setArchiving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/boletins", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setFeedback(`Semana "${data.boletim.titulo}" arquivada com sucesso.`);
      fetchBoletins();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erro ao arquivar semana atual.");
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async (semanaReferencia: string, id: number) => {
    if (!confirm("Remover este boletim do arquivo histórico? Essa ação não pode ser desfeita.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/boletins/${encodeURIComponent(semanaReferencia)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao remover");
      setBoletins((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setFeedback("Erro ao remover boletim.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Boletins Anteriores"
        description="Registro histórico das semanas — arquivado automaticamente toda segunda-feira, ou manualmente quando quiser."
        icon={<History size={20} />}
        actions={
          <button
            onClick={handleArchiveNow}
            disabled={archiving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {archiving ? <Loader2 size={16} className="animate-spin" /> : <Archive size={16} />}
            Arquivar semana atual
          </button>
        }
      />

      {feedback && (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {feedback}
        </div>
      )}

      <AdminCard
        title="Histórico de boletins"
        description="Cada linha é uma semana já arquivada. O conteúdo é congelado no momento do arquivamento."
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" /> Carregando...
          </div>
        ) : boletins.length === 0 ? (
          <EmptyState
            icon={<History size={22} />}
            title="Nenhum boletim arquivado ainda"
            description='Clique em "Arquivar semana atual" para criar o primeiro registro histórico, ou aguarde o arquivamento automático de segunda-feira.'
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {boletins.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{b.titulo}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarRange size={12} />
                      {formatDatePt(b.dataInicio)} — {formatDatePt(b.dataFim)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mic2 size={12} /> {b.totalCultos} cultos
                    </span>
                    <span className="flex items-center gap-1">
                      <Bell size={12} /> {b.totalAnuncios} anúncios
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/boletins/${encodeURIComponent(b.semanaReferencia)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink size={13} /> Ver
                  </a>
                  <button
                    onClick={() => handleDelete(b.semanaReferencia, b.id)}
                    disabled={deletingId === b.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === b.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
