import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query culto by ID
    const rows = await sql`SELECT * FROM cultos WHERE id = ${id}`;
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Culto não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar culto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract basic culto data
    const titulo = formData.get("titulo") as string;
    const diaSemana = formData.get("diaSemana") as string;
    const data = formData.get("data") as string;
    const hora = formData.get("hora") as string;
    const orador = formData.get("orador") as string;
    const corDestaque = formData.get("corDestaque") as string;
    
    // Get current image paths
    let imagemPath = formData.get("imagem") as string;
    let oradorImagemPath = formData.get("oradorImagem") as string;
    
    // Get file upload data
    const bannerImage = formData.get("bannerImage") as File | null;
    const oradorImage = formData.get("oradorImage") as File | null;
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Get current culto data
    const currentCultos = await sql`SELECT * FROM cultos WHERE id = ${id}`;
    
    if (currentCultos.length === 0) {
      return NextResponse.json(
        { error: "Culto não encontrado" },
        { status: 404 }
      );
    }
    
    const currentCulto = currentCultos[0];
    
    // Handle banner image upload if provided
    if (bannerImage) {
      const bannerBytes = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(bannerBytes);
      
      // Create year/month folder structure
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const monthName = getMonthName(month);
      
      // Calculate week range
      const dayOfMonth = today.getDate();
      const weekRange = getWeekRange(dayOfMonth);
      
      // Create folder path
      const folderPath = `/images/${year}/${month}_${monthName}/Semana_${weekRange}`;
      
      // Ensure directory exists
      const uploadDir = join(process.cwd(), "public", folderPath);
      await ensureDir(uploadDir);
      
      // Generate unique filename
      const extension = bannerImage.name.split(".").pop();
      const filename = `culto-${diaSemana.toLowerCase()}-${uuidv4().slice(0, 6)}.${extension}`;
      
      // Save file
      await writeFile(join(uploadDir, filename), buffer);
      
      // Try to delete the old image file if it's not a default
      if (currentCulto.imagem && !currentCulto.imagem.includes("default")) {
        try {
          const oldImagePath = join(process.cwd(), "public", currentCulto.imagem);
          await fs.unlink(oldImagePath);
        } catch (error) {
          // Just log the error, don't fail the update
          console.error("Could not delete old banner image:", error);
        }
      }
      
      // Update image path for database
      imagemPath = `${folderPath}/${filename}`;
    }
    
    // Handle orador image upload if provided
    if (oradorImage) {
      const oradorBytes = await oradorImage.arrayBuffer();
      const buffer = Buffer.from(oradorBytes);
      
      // Create pastores folder if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "/images/pastores");
      await ensureDir(uploadDir);
      
      // Generate unique filename
      const extension = oradorImage.name.split(".").pop();
      const filename = `${orador.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0, 6)}.${extension}`;
      
      // Save file
      await writeFile(join(uploadDir, filename), buffer);
      
      // Try to delete the old image file if it's not a default
      if (
        currentCulto.oradorImagem && 
        !currentCulto.oradorImagem.includes("sem-imagem")
      ) {
        try {
          const oldImagePath = join(process.cwd(), "public", currentCulto.oradorImagem);
          await fs.unlink(oldImagePath);
        } catch (error) {
          // Just log the error, don't fail the update
          console.error("Could not delete old orador image:", error);
        }
      }
      
      // Update orador image path for database
      oradorImagemPath = `/images/pastores/${filename}`;
    }
    
    // Update culto in database using neon
    const updatedCulto = await sql`
      UPDATE cultos 
      SET titulo = ${titulo}, 
          diaSemana = ${diaSemana}, 
          data = ${data}, 
          hora = ${hora}, 
          orador = ${orador}, 
          imagem = ${imagemPath}, 
          oradorImagem = ${oradorImagemPath}, 
          corDestaque = ${corDestaque}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return NextResponse.json(updatedCulto[0]);
  } catch (error) {
    console.error("Error updating culto:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar culto" },
      { status: 500 }
    );
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
        await fs.unlink(imagePath);
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
        await fs.unlink(imagePath);
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