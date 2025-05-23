import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query all fotos
    const rows = await sql`
      SELECT 
        id, 
        titulo, 
        data, 
        descricao, 
        foto
      FROM fotos
      ORDER BY data ASC
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
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract foto data
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const data = formData.get("data") as string;
    
    // Get file upload data
    const foto = formData.get("foto") as File;
    
    // Initialize image path
    let fotoPath = null;
    
    // Handle image upload if provided
    if (foto) {
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
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Insert the foto record
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
        ${fotoPath}
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