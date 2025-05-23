import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Query all mensagens pastorais
    const rows = await sql`
      SELECT * FROM mensagem_pastoral
      ORDER BY id DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar mensagens pastorais" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data from request
    const formData = await request.formData();

    // Extract mensagem pastoral data
    const titulo = formData.get("titulo") as string;
    const mensagem = formData.get("mensagem") as string;

    // Validate required data
    if (!mensagem || mensagem.trim() === "") {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);

    // Get current date for data_publicacao (optional)
    const dataPublicacao = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format


    // FOTO DA MENSAGEM

    // Get file upload data
    const foto = formData.get("foto") as File;

    // Initialize image paths
    let mensagemPastoralImagemPath = "/images/mensagem-pastoral/sem-imagem.jpg";

    // Handle orador image upload if provided
    if (foto) {
      const fotoBytes = await foto.arrayBuffer();
      const buffer = Buffer.from(fotoBytes);

      // Create pastores folder if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "/images/mensagem-pastoral");
      await ensureDir(uploadDir);

      // Generate unique filename
      const extension = foto.name.split(".").pop();
      const filename = `mensagem-pastoral.${extension}`;

      // Save file
      await writeFile(join(uploadDir, filename), buffer);

      // Update orador image path for database
      mensagemPastoralImagemPath = `/images/mensagem-pastoral/${filename}`;
    }

    // Insert new mensagem pastoral into database
    const newMensagem = await sql`
      INSERT INTO mensagem_pastoral
      (titulo, mensagem, foto,data_publicacao)
      VALUES (${titulo}, ${mensagem}, ${mensagemPastoralImagemPath}, ${dataPublicacao})
      RETURNING *
    `;

    return NextResponse.json(newMensagem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating mensagem pastoral:", error);
    return NextResponse.json(
      { error: "Falha ao criar mensagem pastoral" },
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
