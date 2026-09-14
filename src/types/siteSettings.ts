// types/siteSettings.ts

export interface SiteSettings {
  /** URL do vídeo institucional (mp4) hospedado no Vercel Blob */
  video_institucional_url: string;
  /** Imagem exibida enquanto o vídeo carrega ou caso não haja vídeo definido */
  video_institucional_poster: string;
  /** Texto curto sobreposto ao vídeo no hero */
  video_institucional_titulo: string;
  video_institucional_subtitulo: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  video_institucional_url: "",
  video_institucional_poster: "",
  video_institucional_titulo: "Igreja Adventista de Santo Amaro",
  video_institucional_subtitulo: "Uma família de fé, esperança e amor",
};

export type SiteSettingsKey = keyof SiteSettings;
