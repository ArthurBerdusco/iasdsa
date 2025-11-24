import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL as string);

    const result = await sql`
      SELECT 
        c.id, 
        c.titulo, 
        c.diasemana, 
        c.data, 
        c.hora, 
        c.arte, 
        c.cordestaque,
        o.id as orador_id, 
        o.nome as orador_nome, 
        o.foto as orador_foto
      FROM 
        cultos c
      LEFT JOIN 
        oradores o ON c.orador_id = o.id
      ORDER BY 
        c.data ASC
    `;

    // Transformar os resultados no formato esperado pelo frontend
    const formattedCultos = result.map(row => ({
      id: row.id,
      titulo: row.titulo,
      diasemana: row.diasemana,
      data: row.data,
      hora: row.hora,
      arte: row.arte,
      cordestaque: row.cordestaque,
      orador: {
        id: row.orador_id,
        nome: row.orador_nome,
        foto: row.orador_foto
      }
    }));

    return NextResponse.json(formattedCultos);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar cultos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("cheguei no post");
    const formData = await request.formData();

    // Extract basic culto data
    const titulo = formData.get("titulo") as string;
    const diasemana = formData.get("diasemana") as string;
    const data = formData.get("data") as string;
    const hora = formData.get("hora") as string;

    console.log(formData.get("oradorId"));
    const oradorId = parseInt(formData.get("oradorId") as string);

    // Validação para o oradorId
    if (isNaN(oradorId) || oradorId <= 0) {
      return NextResponse.json(
        { error: "ID do orador inválido" },
        { status: 400 }
      );
    }

    const cordestaque = formData.get("cordestaque") as string;
    const arte = formData.get("arte") as File;

    let imagemUrl = "/images/default-banner.jpg";

    // Upload para Vercel Blob se houver arquivo
    if (arte) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const monthName = getMonthName(month);
      const weekRange = getWeekRange(today.getDate());

      // Criar nome do arquivo organizado
      const extension = arte.name.split(".").pop();
      const filename = `cultos/${year}/${month}_${monthName}/Semana_${weekRange}/culto-${diasemana.toLowerCase()}-${uuidv4().slice(0, 6)}.${extension}`;

      // Upload para Vercel Blob
      const blob = await put(filename, arte, {
        access: 'public',
      });

      imagemUrl = blob.url;
    }

    const sql = neon(process.env.DATABASE_URL as string);

    // Insert new culto into database
    const newCulto = await sql`
      INSERT INTO cultos 
      (titulo, diasemana, data, hora, orador_id, arte, cordestaque) 
      VALUES (${titulo}, ${diasemana}, ${data}, ${hora}, ${oradorId}, ${imagemUrl}, ${cordestaque}) 
      RETURNING *
    `;

    return NextResponse.json(newCulto[0], { status: 201 });
  } catch (error) {
    console.error("Error creating culto:", error);
    return NextResponse.json(
      { error: "Falha ao criar culto" },
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