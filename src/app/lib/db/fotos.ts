// lib/db/fotos.ts
// ─── Fotos da galeria/semana ────────────────────────────────────────────────
// ⚠️ Correção de bug de produção: a versão original salvava arquivos com
// `fs.writeFile` em `public/images/fotos`. Isso funciona em `next dev` mas
// QUEBRA em produção na Vercel, cujo filesystem é somente leitura (exceto
// /tmp, que não é servido publicamente e some a cada invocação). Migrado
// para Vercel Blob, no mesmo padrão usado por anuncios.ts e cultos.ts.

import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";
import { Foto } from "@/types/fotos";

const sql = neon(process.env.DATABASE_URL as string);

async function uploadFoto(foto: File, titulo: string): Promise<string> {
  const timestamp = Date.now();
  const extension = foto.name.split(".").pop();
  const slug = titulo.toLowerCase().replace(/\s+/g, "-").slice(0, 60) || "foto";
  const filename = `fotos/${slug}-${timestamp}.${extension}`;
  const blob = await put(filename, foto, { access: "public" });
  return blob.url;
}

export async function getFotos(): Promise<Foto[]> {
  try {
    const rows = await sql`
      SELECT id, titulo, data, descricao, foto
      FROM fotos
      ORDER BY data ASC
    `;
    return rows as Foto[];
  } catch (error) {
    console.error("[getFotos]", error);
    return [];
  }
}

export async function getFotoById(id: string): Promise<Foto | null> {
  const rows = await sql`SELECT * FROM fotos WHERE id = ${id}`;
  return (rows[0] as Foto) ?? null;
}

export async function createFoto(formData: FormData): Promise<Foto> {
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const data = formData.get("data") as string;
  const foto = formData.get("foto") as File | null;

  if (!foto || foto.size === 0) throw new Error("Arquivo de imagem é obrigatório");

  const fotoUrl = await uploadFoto(foto, titulo);

  const result = await sql`
    INSERT INTO fotos (titulo, descricao, data, foto)
    VALUES (${titulo}, ${descricao}, ${data}, ${fotoUrl})
    RETURNING id, titulo, descricao, data, foto
  `;

  return result[0] as Foto;
}

export async function updateFoto(id: string, formData: FormData): Promise<Foto> {
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const data = formData.get("data") as string;
  const foto = formData.get("foto") as File | null;

  const existing = await sql`SELECT foto FROM fotos WHERE id = ${id}`;
  if (existing.length === 0) throw new Error("Foto não encontrada");

  let fotoUrl = existing[0].foto as string;

  if (foto && foto.size > 0) {
    if (fotoUrl) {
      try {
        await del(fotoUrl);
      } catch {
        /* ignora erro de blob */
      }
    }
    fotoUrl = await uploadFoto(foto, titulo);
  }

  const result = await sql`
    UPDATE fotos
    SET titulo = ${titulo}, descricao = ${descricao}, data = ${data}, foto = ${fotoUrl}
    WHERE id = ${id}
    RETURNING id, titulo, descricao, data, foto
  `;

  return result[0] as Foto;
}

export async function deleteFoto(id: string): Promise<void> {
  const rows = await sql`SELECT foto FROM fotos WHERE id = ${id}`;
  if (rows.length === 0) throw new Error("Foto não encontrada");

  if (rows[0].foto) {
    try {
      await del(rows[0].foto);
    } catch {
      /* ignora erro de blob */
    }
  }

  await sql`DELETE FROM fotos WHERE id = ${id}`;
}
