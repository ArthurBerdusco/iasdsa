import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET: Fetch a single foto by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Connect to the database
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query the specific foto
    const foto = await sql`
      SELECT 
        id, 
        titulo, 
        data, 
        descricao, 
        foto
      FROM fotos
      WHERE id = ${id}
    `;
    
    if (foto.length === 0) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(foto[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar a foto" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing foto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract foto data
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const data = formData.get("data") as string;
    
    // Connect to database
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Check if foto exists
    const existingFoto = await sql`
      SELECT foto FROM fotos WHERE id = ${id}
    `;
    
    if (existingFoto.length === 0) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      );
    }
    
    // Handle image upload if provided
    const foto = formData.get("foto") as File;
    let fotoPath = existingFoto[0].foto; // Keep existing image by default
    
    if (foto && foto.size > 0) {
      // Delete old image if it exists
      const oldFotoPath = existingFoto[0].foto;
      if (oldFotoPath) {
        const oldFilePath = join(process.cwd(), "public", oldFotoPath);
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      }
      
      // Upload new image
      const fotoBytes = await foto.arrayBuffer();
      const buffer = Buffer.from(fotoBytes);
      
      // Create fotos folder if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "/images/fotos");
      await ensureDir(uploadDir);
      
      // Generate unique filename based on title and timestamp
      const extension = foto.name.split(".").pop();
      const timestamp = new Date().getTime();
      const filename = `${titulo.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.${extension}`;
      
      // Save file
      await writeFile(join(uploadDir, filename), buffer);
      
      // Update image path for database
      fotoPath = `/images/fotos/${filename}`;
    }
    
    // Update the foto record
    const updatedFoto = await sql`
      UPDATE fotos
      SET 
        titulo = ${titulo},
        descricao = ${descricao},
        data = ${data},
        foto = ${fotoPath}
      WHERE id = ${id}
      RETURNING 
        id, 
        titulo, 
        descricao, 
        data, 
        foto
    `;
    
    return NextResponse.json(updatedFoto[0]);
  } catch (error) {
    console.error("Error updating foto:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar foto" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a foto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Connect to database
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Check if foto exists and get image path
    const existingFoto = await sql`
      SELECT foto FROM fotos WHERE id = ${id}
    `;
    
    if (existingFoto.length === 0) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      );
    }
    
    // Delete the image file if it exists
    const fotoPath = existingFoto[0].foto;
    if (fotoPath) {
      const filePath = join(process.cwd(), "public", fotoPath);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }
    
    // Delete the foto record
    await sql`DELETE FROM fotos WHERE id = ${id}`;
    
    return NextResponse.json(
      { message: "Foto removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting foto:", error);
    return NextResponse.json(
      { error: "Falha ao remover foto" },
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