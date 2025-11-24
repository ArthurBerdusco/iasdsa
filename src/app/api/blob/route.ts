import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL as string);
    
    const rows = await sql`
      SELECT 
        id, 
        titulo, 
        data, 
        descricao, 
        foto
      FROM fotos
      ORDER BY data DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar fotos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const data = formData.get("data") as string;
    const foto = formData.get("foto") as File;
    
    let fotoUrl = null;
    
    // Upload to Vercel Blob
    if (foto) {
      const timestamp = Date.now();
      const filename = `${titulo.toLowerCase().replace(/\s+/g, "-")}-${timestamp}-${foto.name}`;
      
      const blob = await put(filename, foto, {
        access: 'public',
      });
      
      fotoUrl = blob.url;
    }
    
    const sql = neon(process.env.DATABASE_URL as string);
    
    const result = await sql`
      INSERT INTO fotos (
        titulo, 
        descricao, 
        data, 
        foto
      ) VALUES (
        ${titulo}, 
        ${descricao}, 
        ${data}, 
        ${fotoUrl}
      ) 
      RETURNING 
        id, 
        titulo, 
        descricao, 
        data, 
        foto
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating foto:", error);
    return NextResponse.json(
      { error: "Falha ao criar foto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const data = formData.get("data") as string;
    const foto = formData.get("foto") as File | null;
    
    const sql = neon(process.env.DATABASE_URL as string);
    
    let fotoUrl = null;
    
    // If new photo uploaded
    if (foto && foto.size > 0) {
      // Get old photo URL to delete it
      const oldPhoto = await sql`
        SELECT foto FROM fotos WHERE id = ${id}
      `;
      
      // Delete old photo from Blob if exists
      if (oldPhoto[0]?.foto) {
        try {
          await del(oldPhoto[0].foto);
        } catch (error) {
          console.error("Error deleting old photo:", error);
        }
      }
      
      // Upload new photo
      const timestamp = Date.now();
      const filename = `${titulo.toLowerCase().replace(/\s+/g, "-")}-${timestamp}-${foto.name}`;
      
      const blob = await put(filename, foto, {
        access: 'public',
      });
      
      fotoUrl = blob.url;
      
      // Update with new photo
      const result = await sql`
        UPDATE fotos 
        SET 
          titulo = ${titulo},
          descricao = ${descricao},
          data = ${data},
          foto = ${fotoUrl}
        WHERE id = ${id}
        RETURNING 
          id, 
          titulo, 
          descricao, 
          data, 
          foto
      `;
      
      return NextResponse.json(result[0]);
    } else {
      // Update without changing photo
      const result = await sql`
        UPDATE fotos 
        SET 
          titulo = ${titulo},
          descricao = ${descricao},
          data = ${data}
        WHERE id = ${id}
        RETURNING 
          id, 
          titulo, 
          descricao, 
          data, 
          foto
      `;
      
      return NextResponse.json(result[0]);
    }
  } catch (error) {
    console.error("Error updating foto:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar foto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Get photo URL before deleting
    const photo = await sql`
      SELECT foto FROM fotos WHERE id = ${id}
    `;
    
    // Delete from Blob Storage
    if (photo[0]?.foto) {
      try {
        await del(photo[0].foto);
      } catch (error) {
        console.error("Error deleting from blob:", error);
      }
    }
    
    // Delete from database
    await sql`
      DELETE FROM fotos WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting foto:", error);
    return NextResponse.json(
      { error: "Falha ao excluir foto" },
      { status: 500 }
    );
  }
}