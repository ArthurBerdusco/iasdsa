// lib/db/boletins.ts
// ─── Arquivo histórico dos boletins semanais ────────────────────────────────
//
// A home (`/`) sempre mostra os dados ATUAIS de `cultos`, `anuncios` e
// `mensagem_pastoral` — são tabelas "vivas" que o admin atualiza a cada
// semana. Este módulo é responsável por, ao final de cada semana, tirar uma
// "foto" (snapshot) desse conteúdo e guardá-la para sempre em
// `boletins_semanais`, para que a igreja tenha um registro histórico
// consultável em /boletins mesmo depois que o admin sobrescrever os dados
// da semana seguinte.
//
// Ver: db/schema.sql -> tabela `boletins_semanais`

import { neon } from "@neondatabase/serverless";
import {
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  endOfISOWeek,
  format,
} from "date-fns";

import { BoletimSemanal, BoletimResumo, BoletimSnapshot } from "@/types/boletim";
import { getCultos } from "./cultos";
import { getAnuncios } from "./anuncios";
import { getMensagemPastoral } from "./mensagemPastoral";
import { getComponenteConfig } from "./config";

const sql = neon(process.env.DATABASE_URL as string);

// ─── Helpers de semana ISO ───────────────────────────────────────────────────

/** Ex: para 2026-09-13 (domingo) retorna "2026-W37" */
export function getWeekId(date: Date = new Date()): string {
  const year = getISOWeekYear(date);
  const week = String(getISOWeek(date)).padStart(2, "0");
  return `${year}-W${week}`;
}

export function getWeekRange(date: Date = new Date()) {
  return {
    dataInicio: format(startOfISOWeek(date), "yyyy-MM-dd"),
    dataFim: format(endOfISOWeek(date), "yyyy-MM-dd"),
  };
}

function tituloDaSemana(dataInicio: string, dataFim: string): string {
  const [, mi, di] = dataInicio.split("-");
  const [, mf, df] = dataFim.split("-");
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  const inicio = `${di} de ${meses[Number(mi) - 1]}`;
  const fim = `${df} de ${meses[Number(mf) - 1]}`;
  return `Semana de ${inicio} a ${fim}`;
}

function mapRow(row: any): BoletimSemanal {
  return {
    id: row.id,
    semanaReferencia: row.semana_referencia,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim,
    titulo: row.titulo,
    snapshot: row.snapshot as BoletimSnapshot,
    arquivadoAutomaticamente: row.arquivado_automaticamente,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

// ─── Snapshot ────────────────────────────────────────────────────────────────

async function buildSnapshot(): Promise<BoletimSnapshot> {
  const [cultos, anuncios, mensagemPastoral, config] = await Promise.all([
    getCultos(),
    getAnuncios(),
    getMensagemPastoral(),
    getComponenteConfig(),
  ]);

  return {
    cultos,
    anuncios,
    mensagemPastoral: mensagemPastoral?.id ? mensagemPastoral : null,
    config,
    geradoEm: new Date().toISOString(),
  };
}

/**
 * Cria (ou atualiza, se já existir) o registro da semana informada com o
 * conteúdo ATUAL do site. Usado tanto pelo botão manual "Arquivar agora"
 * quanto pelo cron automático.
 */
export async function archiveWeek(
  referenceDate: Date = new Date(),
  { automatico = false }: { automatico?: boolean } = {}
): Promise<BoletimSemanal> {
  const semanaReferencia = getWeekId(referenceDate);
  const { dataInicio, dataFim } = getWeekRange(referenceDate);
  const titulo = tituloDaSemana(dataInicio, dataFim);
  const snapshot = await buildSnapshot();

  const rows = await sql`
    INSERT INTO boletins_semanais
      (semana_referencia, data_inicio, data_fim, titulo, snapshot, arquivado_automaticamente)
    VALUES
      (${semanaReferencia}, ${dataInicio}, ${dataFim}, ${titulo}, ${JSON.stringify(snapshot)}::jsonb, ${automatico})
    ON CONFLICT (semana_referencia)
    DO UPDATE SET
      snapshot      = EXCLUDED.snapshot,
      titulo        = EXCLUDED.titulo,
      atualizado_em = CURRENT_TIMESTAMP
    RETURNING *
  `;

  return mapRow(rows[0]);
}

// ─── Consultas ───────────────────────────────────────────────────────────────

export async function listBoletins(): Promise<BoletimResumo[]> {
  try {
    const rows = await sql`
      SELECT
        id, semana_referencia, data_inicio, data_fim, titulo, criado_em,
        jsonb_array_length(COALESCE(snapshot->'cultos', '[]'::jsonb))    AS total_cultos,
        jsonb_array_length(COALESCE(snapshot->'anuncios', '[]'::jsonb)) AS total_anuncios
      FROM boletins_semanais
      ORDER BY data_inicio DESC
    `;

    return rows.map((row: any) => ({
      id: row.id,
      semanaReferencia: row.semana_referencia,
      dataInicio: row.data_inicio,
      dataFim: row.data_fim,
      titulo: row.titulo,
      totalCultos: Number(row.total_cultos ?? 0),
      totalAnuncios: Number(row.total_anuncios ?? 0),
      criadoEm: row.criado_em,
    }));
  } catch (error) {
    console.error("[listBoletins]", error);
    return [];
  }
}

export async function getBoletimPorSemana(
  semanaReferencia: string
): Promise<BoletimSemanal | null> {
  try {
    const rows = await sql`
      SELECT * FROM boletins_semanais WHERE semana_referencia = ${semanaReferencia}
    `;
    return rows.length > 0 ? mapRow(rows[0]) : null;
  } catch (error) {
    console.error("[getBoletimPorSemana]", error);
    return null;
  }
}

export async function deleteBoletim(id: number): Promise<void> {
  await sql`DELETE FROM boletins_semanais WHERE id = ${id}`;
}
