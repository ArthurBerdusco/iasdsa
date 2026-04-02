import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { RouteParams } from "@/types/routeParams";

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const sql = neon(process.env.DATABASE_URL as string);

    const rows = await sql`
      SELECT * FROM mensagem_pastoral WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Mensagem pastoral não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar mensagem pastoral" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const titulo = formData.get("titulo") as string;
    const mensagem = formData.get("mensagem") as string;
    const foto = formData.get("foto") as File | null;

    if (!mensagem || mensagem.trim() === "") {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);

    const existing = await sql`
      SELECT * FROM mensagem_pastoral WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Mensagem pastoral não encontrada" },
        { status: 404 }
      );
    }

    let fotoUrl = existing[0].foto as string;

    if (foto && foto.size > 0) {
      // Deletar imagem antiga do Blob se não for a padrão
      if (fotoUrl && !fotoUrl.includes("sem-imagem")) {
        try {
          await del(fotoUrl);
        } catch (error) {
          console.error("Erro ao deletar imagem antiga do blob:", error);
        }
      }

      const extension = foto.name.split(".").pop();
      const filename = `mensagem-pastoral/${uuidv4().slice(0, 8)}.${extension}`;

      const blob = await put(filename, foto, { access: "public" });
      fotoUrl = blob.url;
    }

    const updated = await sql`
      UPDATE mensagem_pastoral
      SET titulo = ${titulo},
          mensagem = ${mensagem},
          foto = ${fotoUrl}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating mensagem pastoral:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar mensagem pastoral" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const sql = neon(process.env.DATABASE_URL as string);

    const existing = await sql`
      SELECT * FROM mensagem_pastoral WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Mensagem pastoral não encontrada" },
        { status: 404 }
      );
    }

    // Deletar imagem do Blob se não for a padrão
    const fotoUrl = existing[0].foto as string;
    if (fotoUrl && !fotoUrl.includes("sem-imagem")) {
      try {
        await del(fotoUrl);
      } catch (error) {
        console.error("Erro ao deletar imagem do blob:", error);
      }
    }

    await sql`DELETE FROM mensagem_pastoral WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mensagem pastoral:", error);
    return NextResponse.json(
      { error: "Falha ao excluir mensagem pastoral" },
      { status: 500 }
    );
  }
}