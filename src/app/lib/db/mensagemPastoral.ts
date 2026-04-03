import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { MensagemPastor } from '@/types/mensagemPastoral';

const sql = neon(process.env.DATABASE_URL as string);

const FOTO_DEFAULT = '/images/mensagem-pastoral/sem-imagem.jpg';

const mensagemVazia: MensagemPastor = {
  id: 0,
  titulo: '',
  mensagem: '',
  foto: '',
  data_publicacao: '',
};

// ─── Helpers ──────────────────────────────────────────────────────

async function uploadFoto(foto: File): Promise<string> {
  const extension = foto.name.split('.').pop();
  const filename = `mensagem-pastoral/${uuidv4().slice(0, 8)}.${extension}`;
  const blob = await put(filename, foto, { access: 'public' });
  return blob.url;
}

function mapRow(row: any): MensagemPastor {
  return {
    id:               row.id ?? 0,
    titulo:           row.titulo ?? '',
    mensagem:         row.mensagem ?? '',
    foto:             row.foto ?? '',
    data_publicacao:  row.data_publicacao ?? '',
  };
}

// ─── Queries ──────────────────────────────────────────────────────

export async function getMensagemPastoral(): Promise<MensagemPastor> {
  try {
    const rows = await sql`
      SELECT * FROM mensagem_pastoral
      ORDER BY id DESC
      LIMIT 1
    `;
    return rows.length > 0 ? mapRow(rows[0]) : mensagemVazia;
  } catch (error) {
    console.error('[getMensagemPastoral]', error);
    return mensagemVazia;
  }
}

export async function getMensagemPastoralById(id: string): Promise<MensagemPastor | null> {
  const rows = await sql`SELECT * FROM mensagem_pastoral WHERE id = ${id}`;
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

export async function getMensagensPastorais(): Promise<MensagemPastor[]> {
  const rows = await sql`SELECT * FROM mensagem_pastoral ORDER BY id DESC`;
  return rows.map(mapRow);
}

export async function createMensagemPastoral(formData: FormData): Promise<MensagemPastor> {
  const titulo   = formData.get('titulo') as string;
  const mensagem = formData.get('mensagem') as string;
  const foto     = formData.get('foto') as File | null;

  if (!mensagem?.trim()) throw new Error('Mensagem é obrigatória');

  const fotoUrl = foto && foto.size > 0 ? await uploadFoto(foto) : FOTO_DEFAULT;
  const dataPublicacao = new Date().toISOString().split('T')[0];

  const result = await sql`
    INSERT INTO mensagem_pastoral (titulo, mensagem, foto, data_publicacao)
    VALUES (${titulo}, ${mensagem}, ${fotoUrl}, ${dataPublicacao})
    RETURNING *
  `;

  return mapRow(result[0]);
}

export async function updateMensagemPastoral(id: string, formData: FormData): Promise<MensagemPastor> {
  const titulo   = formData.get('titulo') as string;
  const mensagem = formData.get('mensagem') as string;
  const foto     = formData.get('foto') as File | null;

  if (!mensagem?.trim()) throw new Error('Mensagem é obrigatória');

  const existing = await sql`SELECT * FROM mensagem_pastoral WHERE id = ${id}`;
  if (existing.length === 0) throw new Error('Mensagem pastoral não encontrada');

  let fotoUrl = existing[0].foto as string;

  if (foto && foto.size > 0) {
    if (fotoUrl && !fotoUrl.includes('sem-imagem')) {
      try { await del(fotoUrl); } catch { /* ignora erro de blob */ }
    }
    fotoUrl = await uploadFoto(foto);
  }

  const result = await sql`
    UPDATE mensagem_pastoral
    SET titulo = ${titulo}, mensagem = ${mensagem}, foto = ${fotoUrl}
    WHERE id = ${id}
    RETURNING *
  `;

  return mapRow(result[0]);
}

export async function deleteMensagemPastoral(id: string): Promise<void> {
  const existing = await sql`SELECT foto FROM mensagem_pastoral WHERE id = ${id}`;
  if (existing.length === 0) throw new Error('Mensagem pastoral não encontrada');

  const fotoUrl = existing[0].foto as string;
  if (fotoUrl && !fotoUrl.includes('sem-imagem')) {
    try { await del(fotoUrl); } catch { /* ignora erro de blob */ }
  }

  await sql`DELETE FROM mensagem_pastoral WHERE id = ${id}`;
}