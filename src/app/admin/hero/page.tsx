"use client";
// app/admin/hero/page.tsx
// ─── Configuração do vídeo institucional do hero ────────────────────────────

import { useEffect, useState, FormEvent } from "react";
import { Clapperboard, Loader2, Upload, Save, CheckCircle2 } from "lucide-react";

import AdminPageHeader from "../../components/admin/ui/AdminPageHeader";
import AdminCard from "../../components/admin/ui/AdminCard";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "@/types/siteSettings";

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => data.settings && setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const formData = new FormData();
    formData.set("video_institucional_titulo", settings.video_institucional_titulo);
    formData.set("video_institucional_subtitulo", settings.video_institucional_subtitulo);
    if (videoFile) formData.set("video", videoFile);
    if (posterFile) formData.set("poster", posterFile);

    try {
      const res = await fetch("/api/site-settings", { method: "PUT", body: formData });
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      setSaved(true);
      setVideoFile(null);
      setPosterFile(null);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Carregando...
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Vídeo Institucional"
        description="Vídeo exibido em tela cheia no topo da home, logo abaixo do menu."
        icon={<Clapperboard size={20} />}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard title="Vídeo" description="Formatos recomendados: .mp4, até ~30s, sem áudio essencial (inicia mudo).">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Arquivo de vídeo
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 hover:border-blue-300 hover:bg-blue-50/50">
            <Upload size={16} />
            {videoFile ? videoFile.name : "Clique para selecionar um vídeo"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {settings.video_institucional_url && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-slate-500">Vídeo atual:</p>
              <video
                src={settings.video_institucional_url}
                controls
                className="max-h-56 rounded-lg border border-slate-200"
              />
            </div>
          )}
        </AdminCard>

        <AdminCard title="Imagem de capa (poster)" description="Exibida enquanto o vídeo carrega, ou caso nenhum vídeo esteja cadastrado.">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 hover:border-blue-300 hover:bg-blue-50/50">
            <Upload size={16} />
            {posterFile ? posterFile.name : "Clique para selecionar uma imagem"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {settings.video_institucional_poster && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={settings.video_institucional_poster}
              alt="Poster atual"
              className="mt-4 max-h-40 rounded-lg border border-slate-200 object-cover"
            />
          )}
        </AdminCard>

        <AdminCard title="Texto sobreposto">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
              <input
                type="text"
                value={settings.video_institucional_titulo}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, video_institucional_titulo: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subtítulo</label>
              <input
                type="text"
                value={settings.video_institucional_subtitulo}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, video_institucional_subtitulo: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </AdminCard>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar alterações
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={16} /> Salvo com sucesso
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
