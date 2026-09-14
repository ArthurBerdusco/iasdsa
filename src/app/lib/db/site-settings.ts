// lib/db/site-settings.ts
// ─── Configurações gerais do site (chave/valor) ─────────────────────────────
// Tabela genérica `configuracoes_site` para pequenas configurações de conteúdo
// que não são nem "tema visual" (theme_config) nem "on/off de seção"
// (componentes_visualizacao) — ex: URL do vídeo institucional do hero.
//
// Ver: db/schema.sql -> tabela `configuracoes_site`

import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";
import {
  SiteSettings,
  SiteSettingsKey,
  DEFAULT_SITE_SETTINGS,
} from "@/types/siteSettings";

const sql = neon(process.env.DATABASE_URL as string);

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await sql`SELECT chave, valor FROM configuracoes_site`;

    const settings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
    for (const row of rows) {
      const key = row.chave as SiteSettingsKey;
      if (key in settings) {
        (settings as any)[key] = row.valor ?? "";
      }
    }
    return settings;
  } catch (error) {
    console.error("[getSiteSettings]", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSetting(
  chave: SiteSettingsKey,
  valor: string
): Promise<void> {
  await sql`
    INSERT INTO configuracoes_site (chave, valor)
    VALUES (${chave}, ${valor})
    ON CONFLICT (chave)
    DO UPDATE SET valor = EXCLUDED.valor, atualizado_em = CURRENT_TIMESTAMP
  `;
}

/** Faz upload do novo vídeo institucional para o Blob e salva a URL. */
export async function uploadVideoInstitucional(file: File): Promise<string> {
  const current = await getSiteSettings();

  if (current.video_institucional_url) {
    try {
      await del(current.video_institucional_url);
    } catch {
      /* ignora erro de blob (arquivo pode já não existir) */
    }
  }

  const extension = file.name.split(".").pop();
  const filename = `institucional/video-hero-${Date.now()}.${extension}`;
  const blob = await put(filename, file, { access: "public" });

  await updateSiteSetting("video_institucional_url", blob.url);
  return blob.url;
}

/** Faz upload de um novo poster (imagem de capa) para o vídeo institucional. */
export async function uploadPosterInstitucional(file: File): Promise<string> {
  const current = await getSiteSettings();

  if (current.video_institucional_poster) {
    try {
      await del(current.video_institucional_poster);
    } catch {
      /* ignora erro de blob */
    }
  }

  const extension = file.name.split(".").pop();
  const filename = `institucional/poster-hero-${Date.now()}.${extension}`;
  const blob = await put(filename, file, { access: "public" });

  await updateSiteSetting("video_institucional_poster", blob.url);
  return blob.url;
}
