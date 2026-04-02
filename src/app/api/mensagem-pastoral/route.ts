import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL as string);

    const rows = await sql`
      SELECT * FROM mensagem_pastoral
      ORDER BY id DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar mensagens pastorais" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    let fotoUrl = "/images/mensagem-pastoral/sem-imagem.jpg";

    if (foto && foto.size > 0) {
      const extension = foto.name.split(".").pop();
      const filename = `mensagem-pastoral/${uuidv4().slice(0, 8)}.${extension}`;

      const blob = await put(filename, foto, { access: "public" });
      fotoUrl = blob.url;
    }

    const sql = neon(process.env.DATABASE_URL as string);
    const dataPublicacao = new Date().toISOString().split("T")[0];

    const newMensagem = await sql`
      INSERT INTO mensagem_pastoral (titulo, mensagem, foto, data_publicacao)
      VALUES (${titulo}, ${mensagem}, ${fotoUrl}, ${dataPublicacao})
      RETURNING *
    `;

    return NextResponse.json(newMensagem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating mensagem pastoral:", error);
    return NextResponse.json(
      { error: "Falha ao criar mensagem pastoral" },
      { status: 500 }
    );
  }
}