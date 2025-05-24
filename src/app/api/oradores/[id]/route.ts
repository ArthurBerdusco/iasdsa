import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import { RouteParams } from "@/types/routeParams";


export async function GET(
    request: NextRequest,
    { params }: RouteParams

) {
    const { id } = await params;

    try {
        const sql = neon(process.env.DATABASE_URL as string);

        const rows = await sql`SELECT * FROM oradores WHERE id = ${id}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: "Orador não encontrado" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Falha ao buscar Orador" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams

) {
    try {
        const { id } = await params;

        // Parse form data
        const formData = await request.formData();

        const nome = formData.get("nome") as string;

        // Get the current orador to check if we need to delete old image
        const sql = neon(process.env.DATABASE_URL as string);
        const currentOradores = await sql`SELECT * FROM oradores WHERE id = ${id}`;

        if (currentOradores.length === 0) {
            return NextResponse.json({ error: "Orador não encontrado" }, { status: 404 });
        }

        const currentOrador = currentOradores[0];

        // Handle photo upload if provided
        let fotoPath = currentOrador.foto; // Keep existing photo by default
        const foto = formData.get("foto") as File | null;

        if (foto) {
            const fotoBytes = await foto.arrayBuffer();
            const buffer = Buffer.from(fotoBytes);

            const uploadDir = join(process.cwd(), "public", "images", "oradores");
            await ensureDir(uploadDir);

            const extension = foto.name.split(".").pop();
            const filename = `${nome.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0, 6)}.${extension}`;
            const filePath = join(uploadDir, filename);
            await writeFile(filePath, buffer);

            // Try to delete old image if it exists
            if (currentOrador.foto && !currentOrador.foto.includes("sem-imagem")) {
                try {
                    const oldPath = join(process.cwd(), "public", currentOrador.foto);
                    await fs.unlink(oldPath);
                } catch (err) {
                    console.error("Erro ao deletar imagem antiga do orador:", err);
                }
            }

            fotoPath = `/images/oradores/${filename}`;
        }

        // Update in database
        const updatedOrador = await sql`
      UPDATE oradores
      SET nome = ${nome},
          foto = ${fotoPath}
      WHERE id = ${id}
      RETURNING *
    `;

        return NextResponse.json(updatedOrador[0]);
    } catch (error) {
        console.error("Erro ao atualizar orador:", error);
        return NextResponse.json(
            { error: "Falha ao atualizar orador" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams 
) {
    const { id } = await params;

    try {
        // Connect to database using neon
        const sql = neon(process.env.DATABASE_URL as string);

        // Get current orador data to access image paths
        const currentOradores = await sql`SELECT * FROM oradores WHERE id = ${id}`;

        if (currentOradores.length === 0) {
            return NextResponse.json(
                { error: "Orador não encontrado" },
                { status: 404 }
            );
        }

        const currentOrador = currentOradores[0];


        // Try to delete the orador image file if it's not a default
        if (
            currentOrador.foto &&
            !currentOrador.foto.includes("sem-imagem")
        ) {
            try {
                const imagePath = join(process.cwd(), "public", currentOrador.foto);
                await fs.unlink(imagePath);
            } catch (error) {
                // Just log the error, don't fail the delete
                console.error("Could not delete orador image:", error);
            }
        }

        // Delete orador from database using neon
        await sql`DELETE FROM oradores WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting orador:", error);
        return NextResponse.json(
            { error: "Falha ao excluir orador" },
            { status: 500 }
        );
    }
}

// Helper function to ensure directory exists
async function ensureDir(dirPath: string) {
    try {
        const { mkdir } = require("fs/promises");
        await mkdir(dirPath, { recursive: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
            throw error;
        }
    }
}
