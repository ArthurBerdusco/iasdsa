import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { Culto } from '@/types/cultos';

const sql = neon(process.env.DATABASE_URL as string);

// ─── Helpers ──────────────────────────────────────────────────────
function getMonthName(month: number): string {
  const names = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  return names[month - 1];
}

function getWeekRange(day: number): string {
  if (day <= 7)  return '1_1_7';
  if (day <= 14) return '2_8_14';
  if (day <= 21) return '3_15_21';
  return '4_22_31';
}

async function uploadArte(arte: File, diasemana: string): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const extension = arte.name.split('.').pop();
  const filename = `cultos/${year}/${month}_${getMonthName(month)}/Semana_${getWeekRange(today.getDate())}/culto-${diasemana.toLowerCase()}-${uuidv4().slice(0, 6)}.${extension}`;
  const blob = await put(filename, arte, { access: 'public' });
  return blob.url;
}

// ─── Queries ──────────────────────────────────────────────────────
export async function getCultos(): Promise<Culto[]> {
  try {
    const rows = await sql`
      SELECT 
        c.id, c.titulo, c.diasemana, c.data, c.hora, c.arte, c.cordestaque,
        o.id as orador_id, o.nome as orador_nome, o.foto as orador_foto
      FROM cultos c
      LEFT JOIN oradores o ON c.orador_id = o.id
      ORDER BY c.data ASC
    `;

    return rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      diasemana: row.diasemana,
      data: row.data,
      hora: row.hora,
      arte: row.arte,
      cordestaque: row.cordestaque??'',
      orador: {
        id: row.orador_id,
        nome: row.orador_nome,
        foto: row.orador_foto??'',
      },
    }));
  } catch (error) {
    console.error('[getCultos]', error);
    return [];
  }
}

export async function getCultoById(id: string) {
  const rows = await sql`SELECT * FROM cultos WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createCulto(formData: FormData) {
  const titulo     = formData.get('titulo') as string;
  const diasemana  = formData.get('diasemana') as string;
  const data       = formData.get('data') as string;
  const hora       = formData.get('hora') as string;
  const cordestaque = formData.get('cordestaque') as string;
  const oradorId   = parseInt(formData.get('oradorId') as string);
  const arte       = formData.get('arte') as File | null;

  if (isNaN(oradorId) || oradorId <= 0) throw new Error('ID do orador inválido');

  const imagemUrl = arte && arte.size > 0
    ? await uploadArte(arte, diasemana)
    : '/images/default-banner.jpg';

  const result = await sql`
    INSERT INTO cultos (titulo, diasemana, data, hora, orador_id, arte, cordestaque)
    VALUES (${titulo}, ${diasemana}, ${data}, ${hora}, ${oradorId}, ${imagemUrl}, ${cordestaque})
    RETURNING *
  `;

  return result[0];
}

export async function updateCulto(id: string, formData: FormData) {
  const titulo      = formData.get('titulo') as string;
  const diasemana   = formData.get('diasemana') as string;
  const data        = formData.get('data') as string;
  const hora        = formData.get('hora') as string;
  const cordestaque = formData.get('cordestaque') as string;
  const oradorId    = parseInt(formData.get('oradorId') as string);
  const arte        = formData.get('arte') as File | null;

  if (!titulo || !diasemana || !data || !hora) throw new Error('Campos obrigatórios não preenchidos');
  if (isNaN(oradorId) || oradorId <= 0) throw new Error('ID do orador inválido');

  const existing = await sql`SELECT arte FROM cultos WHERE id = ${id}`;
  if (existing.length === 0) throw new Error('Culto não encontrado');

  let imagemUrl = existing[0].arte;

  if (arte && arte.size > 0) {
    if (imagemUrl && !imagemUrl.includes('default')) {
      try { await del(imagemUrl); } catch { /* ignora erro de blob */ }
    }
    imagemUrl = await uploadArte(arte, diasemana);
  }

  const result = await sql`
    UPDATE cultos
    SET titulo = ${titulo}, diasemana = ${diasemana}, data = ${data},
        hora = ${hora}, orador_id = ${oradorId}, arte = ${imagemUrl}, cordestaque = ${cordestaque}
    WHERE id = ${id}
    RETURNING *
  `;

  return result[0];
}

export async function deleteCulto(id: string) {
  const rows = await sql`SELECT * FROM cultos WHERE id = ${id}`;
  if (rows.length === 0) throw new Error('Culto não encontrado');

  const culto = rows[0];

  if (culto.arte && !culto.arte.includes('default')) {
    try { await del(culto.arte); } catch { /* ignora erro de blob */ }
  }

  await sql`DELETE FROM cultos WHERE id = ${id}`;
}