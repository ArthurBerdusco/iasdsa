// types/boletim.ts
import { Culto } from "./cultos";
import { Anuncio } from "./anuncios";
import { MensagemPastor } from "./mensagemPastoral";
import { ComponenteConfig } from "./components";

/** Conteúdo congelado de uma semana, guardado em `boletins_semanais.snapshot` */
export interface BoletimSnapshot {
  cultos: Culto[];
  anuncios: Anuncio[];
  mensagemPastoral: MensagemPastor | null;
  config: ComponenteConfig;
  geradoEm: string; // ISO datetime
}

export interface BoletimSemanal {
  id: number;
  semanaReferencia: string; // ex: "2026-W37" (ano ISO + semana ISO)
  dataInicio: string; // YYYY-MM-DD (segunda-feira da semana)
  dataFim: string; // YYYY-MM-DD (domingo da semana)
  titulo: string;
  snapshot: BoletimSnapshot;
  arquivadoAutomaticamente: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

/** Versão enxuta usada em listagens (sem o snapshot completo) */
export interface BoletimResumo {
  id: number;
  semanaReferencia: string;
  dataInicio: string;
  dataFim: string;
  titulo: string;
  totalCultos: number;
  totalAnuncios: number;
  criadoEm: string;
}
