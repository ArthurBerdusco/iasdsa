import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { RouteParams } from "@/types/routeParams";

// Função para buscar um culto específico
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Query specific culto by ID
    const culto = await sql`
      SELECT * FROM cultos_recentes WHERE id = ${id}
    `;

    if (culto.length === 0) {
      return NextResponse.json(
        { error: "Culto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(culto[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar culto" },
      { status: 500 }
    );
  }
}

// Função para atualizar um culto específico
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Parse JSON data from request
    const data = await request.json();

    // Extract culto data
    const { data: dataCulto, hora, titulo, descricao, linkYoutube } = data;

    // Validate required fields
    if (!dataCulto || !hora || !titulo || !linkYoutube) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Update culto in database
    const updatedCulto = await sql`
      UPDATE cultos_recentes
      SET 
        data = ${dataCulto},
        hora = ${hora},
        titulo = ${titulo},
        descricao = ${descricao || ''},
        linkYoutube = ${linkYoutube}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCulto.length === 0) {
      return NextResponse.json(
        { error: "Culto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCulto[0]);
  } catch (error) {
    console.error("Error updating culto:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar culto" },
      { status: 500 }
    );
  }
}

// Função para excluir um culto específico
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Check if culto exists
    const existingCulto = await sql`
      SELECT id FROM cultos_recentes WHERE id = ${id}
    `;

    if (existingCulto.length === 0) {
      return NextResponse.json(
        { error: "Culto não encontrado" },
        { status: 404 }
      );
    }

    // Delete culto from database
    await sql`
      DELETE FROM cultos_recentes WHERE id = ${id}
    `;

    return NextResponse.json(
      { message: "Culto excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting culto:", error);
    return NextResponse.json(
      { error: "Falha ao excluir culto" },
      { status: 500 }
    );
  }
}