'use client';

import { useState, useEffect } from 'react';
import { CultoYoutube } from '@/types/ultimosCultos';
import { formatDateForDisplay } from '@/utils/formatoData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SyncResult {
  success: boolean;
  message: string;
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCultosSync() {
  const [cultos, setCultos] = useState<CultoYoutube[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [maxResults, setMaxResults] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadCultos();
  }, []);

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadCultos = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/ultimos-cultos');
      if (!res.ok) throw new Error('Falha ao carregar');
      const data = await res.json();
      setCultos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  // ── Sync ────────────────────────────────────────────────────────────────────

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/ultimos-cultos/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sync-secret': 'AIzaSyB9BI4dDqjC3AKHQ587lebtM27FMM9lKPc',
          // Se você configurou SYNC_SECRET no .env, passe-o aqui como variável de ambiente pública:
          // 'x-sync-secret': process.env.NEXT_PUBLIC_SYNC_SECRET ?? '',
        },
        body: JSON.stringify({ maxResults }),
      });

      const data: SyncResult = await res.json();
      setSyncResult(data);

      if (data.success) {
        await loadCultos(); // Recarrega a lista após sincronização
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message ?? 'Erro desconhecido',
        total: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [err.message],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/ultimos-cultos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      setCultos((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Gerenciar Cultos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sincronize automaticamente as últimas lives do canal com um clique.
          </p>
        </div>

        {/* ── Sync Controls ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <label className="text-sm text-blue-700 font-medium whitespace-nowrap">
              Últimas
            </label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="bg-transparent text-sm text-blue-900 font-semibold outline-none cursor-pointer"
            >
              {[3, 4, 5, 6, 8, 10].map((n) => (
                <option key={n} value={n}>{n} lives</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400
              text-white font-semibold text-sm rounded-lg
              shadow-sm transition-all duration-200
              disabled:cursor-not-allowed
            "
          >
            {isSyncing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sincronizando…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sincronizar YouTube
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Sync Result Banner ────────────────────────────────────────────────── */}
      {syncResult && (
        <div className={`rounded-xl border p-4 ${
          syncResult.success
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            {syncResult.success ? (
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{syncResult.message}</p>
              {syncResult.success && (
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <span>📥 {syncResult.inserted} inseridos</span>
                  <span>✏️ {syncResult.updated} atualizados</span>
                  <span>⏭️ {syncResult.skipped} ignorados</span>
                  <span>🎬 {syncResult.total} encontrados</span>
                </div>
              )}
              {syncResult.errors.length > 0 && (
                <ul className="mt-2 text-xs space-y-1 list-disc list-inside opacity-80">
                  {syncResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
            <button onClick={() => setSyncResult(null)} className="shrink-0 opacity-60 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Cultos List ────────────────────────────────────────────────────────── */}
      {isFetching ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-blue-600 font-medium">Carregando cultos…</div>
        </div>
      ) : cultos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">Nenhum culto cadastrado.</p>
          <p className="text-sm mt-1">Clique em "Sincronizar YouTube" para importar os últimos cultos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{cultos.length} culto{cultos.length !== 1 ? 's' : ''} cadastrado{cultos.length !== 1 ? 's' : ''}</p>

          {cultos.map((culto) => (
            <div
              key={culto.id}
              className="flex items-center gap-4 bg-white border border-gray-200 hover:border-blue-200 rounded-xl p-4 transition-all group"
            >
              {/* Thumbnail do YouTube */}
              <div className="shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={`https://img.youtube.com/vi/${extractVideoIdFromIframe(culto.iframe)}/mqdefault.jpg`}
                  alt={culto.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-video.png';
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{culto.titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDateForDisplay(culto.data)} às {culto.hora}
                </p>
                {culto.descricao && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{culto.descricao}</p>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={culto.linkyoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                  title="Ver no YouTube"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {deleteConfirm === culto.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-red-600 font-medium">Confirmar?</span>
                    <button
                      onClick={() => handleDelete(culto.id)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded font-semibold hover:bg-red-700"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-semibold hover:bg-gray-300"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(culto.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                    title="Excluir culto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Util local ───────────────────────────────────────────────────────────────

function extractVideoIdFromIframe(iframeSrc: string): string {
  const match = iframeSrc.match(/embed\/([^?/\s]{11})/);
  return match?.[1] ?? '';
}