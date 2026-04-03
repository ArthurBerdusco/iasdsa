// lib/db/config.ts
import { neon } from '@neondatabase/serverless';
import { ComponenteConfig, ComponenteChave } from '@/types/components';

const sql = neon(process.env.DATABASE_URL as string);

export const DEFAULT_CONFIG: ComponenteConfig = {
  cultos: true,
  mensagem_pastoral: true,
  programacao_cultos: true,
  anuncios: true,
  pedido_oracao: true,
  fotos_blob: false,
  fotos_semana: false,
  dizimo: true,
  redes_sociais: true,
};

// ─── Helper ───────────────────────────────────────────────────────

function mapRows(rows: any[]): ComponenteConfig {
  return rows.reduce<ComponenteConfig>((acc, row) => {
    acc[row.componente_chave as ComponenteChave] = row.habilitado;
    return acc;
  }, { ...DEFAULT_CONFIG }); // fallback por chave se alguma linha faltar
}

// ─── Queries ──────────────────────────────────────────────────────

export async function getComponenteConfig(): Promise<ComponenteConfig> {
  try {
    const rows = await sql`
      SELECT componente_chave, habilitado
      FROM componentes_visualizacao
      ORDER BY ordem_exibicao
    `;
    return rows.length > 0 ? mapRows(rows) : DEFAULT_CONFIG;
  } catch (error) {
    console.error('[getComponenteConfig]', error);
    return DEFAULT_CONFIG;
  }
}

export async function updateComponenteConfig(
  componente_chave: ComponenteChave,
  habilitado: boolean
): Promise<void> {
  const existing = await sql`
    SELECT componente_chave FROM componentes_visualizacao
    WHERE componente_chave = ${componente_chave}
  `;

  if (existing.length === 0) throw new Error('Componente não encontrado');

  await sql`
    UPDATE componentes_visualizacao
    SET habilitado = ${habilitado}
    WHERE componente_chave = ${componente_chave}
  `;
}

export async function createComponente(
  componente_chave: ComponenteChave,
  habilitado: boolean,
  ordem_exibicao?: number
): Promise<void> {
  const existing = await sql`
    SELECT componente_chave FROM componentes_visualizacao
    WHERE componente_chave = ${componente_chave}
  `;

  if (existing.length > 0) throw new Error('Componente já existe');

  await sql`
    INSERT INTO componentes_visualizacao (componente_chave, habilitado, ordem_exibicao)
    VALUES (${componente_chave}, ${habilitado}, ${ordem_exibicao ?? 999})
  `;
}