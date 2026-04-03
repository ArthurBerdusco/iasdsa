import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { Anuncio } from '@/types/anuncios';

const sql = neon(process.env.DATABASE_URL as string);

// ─── Helpers ──────────────────────────────────────────────────────

async function uploadArte(arte: File, titulo: string): Promise<string> {
  const timestamp = Date.now();
  const extension = arte.name.split('.').pop();
  const filename = `anuncios/${titulo.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.${extension}`;
  const blob = await put(filename, arte, { access: 'public' });
  return blob.url;
}

const ANUNCIO_SELECT = `
  a.id,
  a.titulo,
  a.texto,
  a.arte,
  a.data_evento     as "dataEvento",
  a.data_publicacao as "dataPublicacao",
  a.data_expiracao  as "dataExpiracao",
  a.destaque,
  a.ativo,
  COALESCE(
    json_agg(
      json_build_object(
        'id',          l.id,
        'tipo_link',   l.tipo_link,
        'url',         l.url,
        'texto_botao', l.texto_botao
      )
    ) FILTER (WHERE l.id IS NOT NULL),
    '[]'
  ) as links
`;

// ─── Queries ──────────────────────────────────────────────────────

export async function getAnuncios(): Promise<Anuncio[]> {
  try {
    const rows = await sql`
      SELECT ${sql.unsafe(ANUNCIO_SELECT)}
      FROM anuncios a
      LEFT JOIN anuncio_links l ON a.id = l.anuncio_id
      GROUP BY a.id
      ORDER BY a.data_evento ASC
    `;

    return rows as Anuncio[];
  } catch (error) {
    console.error('[getAnuncios]', error);
    return [];
  }
}

export async function getAnuncioById(id: string): Promise<Anuncio | null> {
  const rows = await sql`
    SELECT ${sql.unsafe(ANUNCIO_SELECT)}
    FROM anuncios a
    LEFT JOIN anuncio_links l ON a.id = l.anuncio_id
    WHERE a.id = ${id}
    GROUP BY a.id
  `;

  return (rows[0] as Anuncio) ?? null;
}

export async function createAnuncio(formData: FormData): Promise<Anuncio> {
  const titulo     = formData.get('titulo') as string;
  const texto      = formData.get('texto') as string;
  const dataEvento = formData.get('dataEvento') as string;
  const ativo      = formData.get('ativo') === 'true';
  const destaque   = formData.get('destaque') === 'true';
  const links      = JSON.parse((formData.get('links') as string) || '[]');
  const arte       = formData.get('arte') as File | null;

  const arteUrl = arte && arte.size > 0 ? await uploadArte(arte, titulo) : null;

  const result = await sql`
    INSERT INTO anuncios (titulo, texto, arte, data_evento, data_publicacao, destaque, ativo)
    VALUES (${titulo}, ${texto}, ${arteUrl}, ${dataEvento}, ${new Date().toISOString()}, ${destaque}, ${ativo})
    RETURNING id
  `;

  const anuncioId = result[0].id;

  await insertLinks(anuncioId, links);

  return (await getAnuncioById(anuncioId))!;
}

export async function updateAnuncio(id: string, formData: FormData): Promise<Anuncio> {
  const titulo     = formData.get('titulo') as string;
  const texto      = formData.get('texto') as string;
  const dataEvento = formData.get('dataEvento') as string;
  const destaque   = formData.get('destaque') === 'true';
  const ativo      = formData.get('ativo') === 'true';
  const links      = JSON.parse((formData.get('links') as string) || '[]');
  const arte       = formData.get('arte') as File | null;

  const existing = await sql`SELECT arte FROM anuncios WHERE id = ${id}`;
  if (existing.length === 0) throw new Error('Anúncio não encontrado');

  let arteUrl = existing[0].arte;

  if (arte && arte.size > 0) {
    if (arteUrl) {
      try { await del(arteUrl); } catch { /* ignora erro de blob */ }
    }
    arteUrl = await uploadArte(arte, titulo);
  }

  await sql`
    UPDATE anuncios
    SET titulo = ${titulo}, texto = ${texto}, arte = ${arteUrl},
        data_evento = ${dataEvento}, destaque = ${destaque}, ativo = ${ativo}
    WHERE id = ${id}
  `;

  await sql`DELETE FROM anuncio_links WHERE anuncio_id = ${id}`;
  await insertLinks(id, links);

  return (await getAnuncioById(id))!;
}

export async function deleteAnuncio(id: string): Promise<void> {
  const rows = await sql`SELECT arte FROM anuncios WHERE id = ${id}`;
  if (rows.length === 0) throw new Error('Anúncio não encontrado');

  if (rows[0].arte) {
    try { await del(rows[0].arte); } catch { /* ignora erro de blob */ }
  }

  await sql`DELETE FROM anuncio_links WHERE anuncio_id = ${id}`;
  await sql`DELETE FROM anuncios WHERE id = ${id}`;
}

// ─── Private ──────────────────────────────────────────────────────

async function insertLinks(anuncioId: string | number, links: any[]) {
  for (const link of links) {
    await sql`
      INSERT INTO anuncio_links (anuncio_id, tipo_link, url, texto_botao)
      VALUES (${anuncioId}, ${link.tipo_link}, ${link.url}, ${link.texto_botao || 'Acessar'})
    `;
  }
}