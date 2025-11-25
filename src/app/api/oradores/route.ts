import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query all oradores ordered by date
    const rows = await sql`
      SELECT * FROM oradores
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar oradores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract basic orador data
    const nome = formData.get("nome") as string;
    
    // Get file upload data
    const foto = formData.get("foto") as File;
    
    // Initialize image paths
    let oradorImagemUrl = "/images/pastores/sem-imagem.jpg";
    console.log(foto + "Foto kk");
    
    // Handle orador image upload if provided
    if (foto) {
      const extension = foto.name.split(".").pop();
      const filename = `oradores/${nome.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
      
      // Upload to Vercel Blob
      const blob = await put(filename, foto, {
        access: 'public',
      });
      
      oradorImagemUrl = blob.url;
    }
    
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Insert new orador into database
    const newOrador = await sql`
      INSERT INTO oradores 
      (nome, foto) 
      VALUES (${nome}, ${oradorImagemUrl}) 
      RETURNING *
    `;
    
    return NextResponse.json(newOrador[0], { status: 201 });
  } catch (error) {
    console.error("Error creating orador:", error);
    return NextResponse.json(
      { error: "Falha ao criar orador" },
      { status: 500 }
    );
  }
}