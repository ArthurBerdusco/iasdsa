import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { unlink, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

// Define the proper types for route params according to Next.js 15
type RouteParams = {
    params: {
        id: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function GET(
    request: NextRequest,
    context: RouteParams
) {
    const id = context.params.id;

    try {
        const sql = neon(process.env.DATABASE_URL as string);

        const rows = await sql`SELECT * FROM cultos WHERE id = ${id}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: "Culto não encontrado" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Falha ao buscar culto" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const formData = await request.formData();

        // Extrair dados
        const titulo = formData.get("titulo") as string;
        const diasemana = formData.get("diasemana") as string;
        const data = formData.get("data") as string;
        const hora = formData.get("hora") as string;
        const cordestaque = formData.get("cordestaque") as string;
        const oradorId = parseInt(formData.get("oradorId") as string);
        const arte = formData.get("arte") as File;

        if (isNaN(oradorId) || oradorId <= 0) {
            return NextResponse.json({ error: "ID do orador inválido" }, { status: 400 });
        }

        const sql = neon(process.env.DATABASE_URL as string);

        // Verificar se culto existe
        const existingCulto = await sql`SELECT arte FROM cultos WHERE id = ${id}`;
        if (existingCulto.length === 0) {
            return NextResponse.json({ error: "Culto não encontrado" }, { status: 404 });
        }

        let imagemPath = existingCulto[0].arte; // Preserva a imagem atual por padrão

        // Upload nova imagem, se houver
        if (arte && arte.size > 0) {
            // Deletar imagem antiga
            if (imagemPath && !imagemPath.includes("default")) {
                const oldImagePath = join(process.cwd(), "public", imagemPath);
                if (existsSync(oldImagePath)) {
                    await unlink(oldImagePath);
                }
            }

            // Salvar nova imagem
            const arteBytes = await arte.arrayBuffer();
            const buffer = Buffer.from(arteBytes);

            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const monthName = getMonthName(month);
            const weekRange = getWeekRange(today.getDate());

            const folderPath = `/images/${year}/${month}_${monthName}/Semana_${weekRange}`;
            const uploadDir = join(process.cwd(), "public", folderPath);
            await ensureDir(uploadDir);

            const extension = arte.name.split(".").pop();
            const filename = `culto-${diasemana.toLowerCase()}-${uuidv4().slice(0, 6)}.${extension}`;
            await writeFile(join(uploadDir, filename), buffer);

            imagemPath = `${folderPath}/${filename}`;
        }

        // Atualizar culto
        const updatedCulto = await sql`
            UPDATE cultos
            SET titulo = ${titulo},
                diasemana = ${diasemana},
                data = ${data},
                hora = ${hora},
                orador_id = ${oradorId},
                arte = ${imagemPath},
                cordestaque = ${cordestaque}
            WHERE id = ${id}
            RETURNING *
        `;

        return NextResponse.json(updatedCulto[0]);
    } catch (error) {
        console.error("Erro ao atualizar culto:", error);
        return NextResponse.json({ error: "Falha ao atualizar culto" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        // Connect to database using neon
        const sql = neon(process.env.DATABASE_URL as string);

        // Get current culto data to access image paths
        const currentCultos = await sql`SELECT * FROM cultos WHERE id = ${id}`;

        if (currentCultos.length === 0) {
            return NextResponse.json(
                { error: "Culto não encontrado" },
                { status: 404 }
            );
        }

        const currentCulto = currentCultos[0];

        // Try to delete the banner image file if it's not a default
        if (
            currentCulto.imagem &&
            !currentCulto.imagem.includes("default")
        ) {
            try {
                const imagePath = join(process.cwd(), "public", currentCulto.imagem);
                await unlink(imagePath);
            } catch (error) {
                // Just log the error, don't fail the delete
                console.error("Could not delete banner image:", error);
            }
        }

        // Try to delete the orador image file if it's not a default
        if (
            currentCulto.oradorImagem &&
            !currentCulto.oradorImagem.includes("sem-imagem")
        ) {
            try {
                const imagePath = join(process.cwd(), "public", currentCulto.oradorImagem);
                await unlink(imagePath);
            } catch (error) {
                // Just log the error, don't fail the delete
                console.error("Could not delete orador image:", error);
            }
        }

        // Delete culto from database using neon
        await sql`DELETE FROM cultos WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting culto:", error);
        return NextResponse.json(
            { error: "Falha ao excluir culto" },
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

// Helper function to get month name
function getMonthName(month: number): string {
    const monthNames = [
        "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
        "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
    ];
    return monthNames[month - 1];
}

// Helper function to calculate week range
function getWeekRange(day: number): string {
    if (day <= 7) return "1_1_7";
    if (day <= 14) return "2_8_14";
    if (day <= 21) return "3_15_21";
    return "4_22_31";
}