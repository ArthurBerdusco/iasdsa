import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query all cultos ordered by date
    const rows = await sql`
      SELECT * FROM cultos ORDER BY to_date(data, 'DD/MM/YYYY') ASC
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
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract basic culto data
    const titulo = formData.get("titulo") as string;
    const diaSemana = formData.get("diaSemana") as string;
    const data = formData.get("data") as string;
    const hora = formData.get("hora") as string;
    const orador = formData.get("orador") as string;
    const corDestaque = formData.get("corDestaque") as string;
    
    // Get file upload data
    const bannerImage = formData.get("bannerImage") as File;
    const oradorImage = formData.get("oradorImage") as File;
    
    // Initialize image paths
    let imagemPath = "/images/default-banner.jpg";
    let oradorImagemPath = "/images/pastores/sem-imagem.jpg";
    
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
      
      // Update orador image path for database
      oradorImagemPath = `/images/pastores/${filename}`;
    }
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Insert new culto into database
    const newCulto = await sql`
      INSERT INTO cultos 
      (titulo, diaSemana, data, hora, orador, imagem, oradorImagem, corDestaque) 
      VALUES (${titulo}, ${diaSemana}, ${data}, ${hora}, ${orador}, ${imagemPath}, ${oradorImagemPath}, ${corDestaque}) 
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