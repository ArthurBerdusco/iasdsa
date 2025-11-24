import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from "uuid";
import { RouteParams } from "@/types/routeParams";

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const sql = neon(process.env.DATABASE_URL as string);

        const rows = await sql`SELECT * FROM cultos WHERE id = ${id}`;

        if (rows.length === 0) {
            return NextResponse.json({ 
                success: false,
                error: "Culto não encontrado" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ 
            success: false,
            error: "Falha ao buscar culto" 
        }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        
        const formData = await request.formData();

        // Extrair dados
        const titulo = formData.get("titulo") as string;
        const diasemana = formData.get("diasemana") as string;
        const data = formData.get("data") as string;
        const hora = formData.get("hora") as string;
        const cordestaque = formData.get("cordestaque") as string;
        const oradorId = parseInt(formData.get("oradorId") as string);
        const arte = formData.get("arte") as File | null;

        // Validação básica
        if (!titulo || !diasemana || !data || !hora) {
            return NextResponse.json({ 
                success: false,
                error: "Campos obrigatórios não preenchidos" 
            }, { status: 400 });
        }

        if (isNaN(oradorId) || oradorId <= 0) {
            return NextResponse.json({ 
                success: false,
                error: "ID do orador inválido" 
            }, { status: 400 });
        }

        const sql = neon(process.env.DATABASE_URL as string);

        // Verificar se culto existe
        const existingCulto = await sql`SELECT arte FROM cultos WHERE id = ${id}`;
        if (existingCulto.length === 0) {
            return NextResponse.json({ 
                success: false,
                error: "Culto não encontrado" 
            }, { status: 404 });
        }

        let imagemUrl = existingCulto[0].arte; // Preserva a imagem atual por padrão

        // Upload nova imagem, se houver
        if (arte && arte.size > 0) {
            // Deletar imagem antiga do Blob se não for default
            if (imagemUrl && !imagemUrl.includes("default")) {
                try {
                    await del(imagemUrl);
                } catch (error) {
                    console.error("Error deleting old image from blob:", error);
                }
            }

            // Upload nova imagem para Vercel Blob
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const monthName = getMonthName(month);
            const weekRange = getWeekRange(today.getDate());

            const extension = arte.name.split(".").pop();
            const filename = `cultos/${year}/${month}_${monthName}/Semana_${weekRange}/culto-${diasemana.toLowerCase()}-${uuidv4().slice(0, 6)}.${extension}`;

            const blob = await put(filename, arte, {
                access: 'public',
            });

            imagemUrl = blob.url;
        }

        // Atualizar culto
        const updatedCulto = await sql`
            UPDATE cultos
            SET titulo = ${titulo},
                diasemana = ${diasemana},
                data = ${data},
                hora = ${hora},
                orador_id = ${oradorId},
                arte = ${imagemUrl},
                cordestaque = ${cordestaque}
            WHERE id = ${id}
            RETURNING *
        `;

        return NextResponse.json({
            success: true,
            message: "Culto atualizado com sucesso",
            data: updatedCulto[0]
        });
    } catch (error) {
        console.error("Erro ao atualizar culto:", error);
        return NextResponse.json({ 
            success: false,
            error: "Falha ao atualizar culto" 
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const sql = neon(process.env.DATABASE_URL as string);

        // Get current culto data to access image paths
        const currentCultos = await sql`SELECT * FROM cultos WHERE id = ${id}`;

        if (currentCultos.length === 0) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Culto não encontrado" 
                },
                { status: 404 }
            );
        }

        const currentCulto = currentCultos[0];

        // Deletar imagem do Blob se não for default
        if (currentCulto.arte && !currentCulto.arte.includes("default")) {
            try {
                await del(currentCulto.arte);
            } catch (error) {
                console.error("Could not delete banner image from blob:", error);
            }
        }

        // Deletar imagem do orador do Blob se não for default
        if (currentCulto.oradorImagem && !currentCulto.oradorImagem.includes("sem-imagem")) {
            try {
                await del(currentCulto.oradorImagem);
            } catch (error) {
                console.error("Could not delete orador image from blob:", error);
            }
        }

        // Delete culto from database
        await sql`DELETE FROM cultos WHERE id = ${id}`;

        return NextResponse.json({ 
            success: true,
            message: "Culto excluído com sucesso" 
        });
    } catch (error) {
        console.error("Error deleting culto:", error);
        return NextResponse.json(
            { 
                success: false,
                error: "Falha ao excluir culto" 
            },
            { status: 500 }
        );
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