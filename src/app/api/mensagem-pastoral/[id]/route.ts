import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { RouteParams } from "@/types/routeParams";

/**
 * GET handler - Busca uma mensagem pastoral específica pelo ID
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams  // ✅ Corrigido - usando RouteParams
) {

    try {
        const { id } = await params;
        // Connect to database using neon
        const sql = neon(process.env.DATABASE_URL as string);

        // Query the specific mensagem_pastoral
        const rows = await sql`
      SELECT * FROM mensagem_pastoral WHERE id = ${id}
    `;

        // Check if mensagem_pastoral exists
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

/**
 * PUT handler - Atualiza uma mensagem pastoral existente
 */
export async function PUT(
    request: NextRequest,
    { params }: RouteParams  // ✅ Corrigido - usando RouteParams
) {
    const { id } = await params;

    try {
        const formData = await request.formData();

        const titulo = formData.get("titulo") as string;

        const mensagem = formData.get("mensagem") as string;
        const ativo = formData.has("ativo") ?
            (formData.get("ativo") === "true" || formData.get("ativo") === "1") :
            null;
        const destaque = formData.has("destaque") ?
            (formData.get("destaque") === "true" || formData.get("destaque") === "1") :
            null;

        if (!mensagem || mensagem.trim() === "") {
            return NextResponse.json(
                { error: "Mensagem é obrigatória" },
                { status: 400 }
            );
        }

        const sql = neon(process.env.DATABASE_URL as string);

        const existingMensagem = await sql`
        SELECT * FROM mensagem_pastoral WHERE id = ${id}
      `;

        if (existingMensagem.length === 0) {
            return NextResponse.json(
                { error: "Mensagem pastoral não encontrada" },
                { status: 404 }
            );
        }

        const updatedMensagem = await sql`
        UPDATE mensagem_pastoral
        SET
          titulo = ${titulo},
          mensagem = ${mensagem},
          ativo = COALESCE(${ativo}, ativo),
          destaque = COALESCE(${destaque}, destaque)
        WHERE id = ${id}
        RETURNING *
      `;

        return NextResponse.json(updatedMensagem[0]);
    } catch (error) {
        console.error("Error updating mensagem pastoral:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar mensagem pastoral" },
            { status: 500 }
        );
    }
}


/**
 * DELETE handler - Remove uma mensagem pastoral
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;

    try {
        // Connect to database using neon
        const sql = neon(process.env.DATABASE_URL as string);

        // Check if the mensagem exists
        const existingMensagem = await sql`
      SELECT id FROM mensagem_pastoral WHERE id = ${id}
    `;

        if (existingMensagem.length === 0) {
            return NextResponse.json(
                { error: "Mensagem pastoral não encontrada" },
                { status: 404 }
            );
        }

        // Delete mensagem pastoral from database
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