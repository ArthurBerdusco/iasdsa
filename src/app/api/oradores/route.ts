import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Connect to the database using neon
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
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract basic orador data
    const nome = formData.get("nome") as string;
    
    // Get file upload data
    const foto = formData.get("foto") as File;
    
    // Initialize image paths
    let oradorImagemPath = "/images/pastores/sem-imagem.jpg";
    console.log(foto + "Foto kk")
    
    // Handle orador image upload if provided
    if (foto) {
      const fotoBytes = await foto.arrayBuffer();
      const buffer = Buffer.from(fotoBytes);
      
      // Create pastores folder if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "/images/pastores");
      await ensureDir(uploadDir);

      // //Verify if foto exists
      // const nomeBase = nome.toLowerCase().replace(/\s+/g, "-");

      // // Verifica se já existe alguma imagem anterior
      // const arquivosExistentes = await readdir(uploadDir);
      // const arquivosDoOrador = arquivosExistentes.filter(file => file.startsWith(nomeBase));
      
      // // Remove imagens antigas
      // for (const file of arquivosDoOrador) {
      //   await unlink(join(uploadDir, file));
      // }
      
      // Generate unique filename
      const extension = foto.name.split(".").pop();
      const filename = `${nome.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
      
      // Save file
      await writeFile(join(uploadDir, filename), buffer);
      
      // Update orador image path for database
      oradorImagemPath = `/images/pastores/${filename}`;
    }
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Insert new orador into database
    const newOrador = await sql`
      INSERT INTO oradores 
      (nome, foto) 
      VALUES (${nome}, ${oradorImagemPath}) 
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
