import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query all cultos ordered by date (most recent first)
    const rows = await sql`
      SELECT * FROM cultos_recentes
      ORDER BY data ASC, hora ASC
    `;
    
    return NextResponse.json(rows);
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
    // Parse JSON data from request
    const data = await request.json();
    
    // Extract culto data
    const { data: dataCulto, hora, titulo, descricao, linkyoutube, iframe } = data;
    
    // Validate required fields
    if (!dataCulto || !hora || !titulo || !linkyoutube || !iframe) {
      console.log("ue ue")
      return NextResponse.json(
    
        
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Insert new culto into database
    const newCulto = await sql`
      INSERT INTO cultos_recentes
      (data, hora, titulo, descricao, linkYoutube, iframe)
      VALUES (${dataCulto}, ${hora}, ${titulo}, ${descricao || ''}, ${linkyoutube}, ${iframe})
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