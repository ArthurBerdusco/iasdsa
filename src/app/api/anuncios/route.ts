import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Connect to the database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query all anúncios with their links using JOIN
    const rows = await sql`
      SELECT 
        a.id, 
        a.titulo, 
        a.texto, 
        a.arte, 
        a.data_evento as "dataEvento", 
        a.data_publicacao as "dataPublicacao", 
        a.data_expiracao as "dataExpiracao", 
        a.destaque,
        a.ativo,
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'tipo_link', l.tipo_link,
              'url', l.url,
              'texto_botao', l.texto_botao
            )
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) as links
      FROM anuncios a
      LEFT JOIN anuncio_links l ON a.id = l.anuncio_id
      GROUP BY a.id
      ORDER BY a.data_evento ASC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar anúncios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data from request
    const formData = await request.formData();
    
    // Extract anúncio data
    const titulo = formData.get("titulo") as string;
    const texto = formData.get("texto") as string;
    const dataEvento = formData.get("dataEvento") as string;
    const ativo = formData.get("ativo") === "true";
    const destaque = formData.get("destaque") === "true";
    const linksString = formData.get("links") as string;
    const links = linksString ? JSON.parse(linksString) : [];
    
    // Get file upload data
    const arte = formData.get("arte") as File;
    
    // Initialize image path
    let artePath = null;
    
    // Handle image upload if provided
    if (arte) {
      const arteBytes = await arte.arrayBuffer();
      const buffer = Buffer.from(arteBytes);
      
      // Create anuncios folder if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "/images/anuncios");
      await ensureDir(uploadDir);
      
      // Generate unique filename based on title and timestamp
      const extension = arte.name.split(".").pop();
      const timestamp = new Date().getTime();
      const filename = `${titulo.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.${extension}`;
      
      // Save file
      await writeFile(join(uploadDir, filename), buffer);
      
      // Update image path for database
      artePath = `/images/anuncios/${filename}`;
    }
    
    // Connect to database using neon
    const sql = neon(process.env.DATABASE_URL as string);
    
    // 1. Inserir o anúncio primeiro
    const anuncio = await sql`
      INSERT INTO anuncios (
        titulo, 
        texto, 
        arte, 
        data_evento, 
        data_publicacao, 
        destaque,
        ativo
      ) VALUES (
        ${titulo}, 
        ${texto}, 
        ${artePath}, 
        ${dataEvento}, 
        ${new Date().toISOString()}, 
        ${destaque},
        ${ativo}
      ) 
      RETURNING 
        id, 
        titulo, 
        texto, 
        arte, 
        data_evento as "dataEvento", 
        data_publicacao as "dataPublicacao", 
        data_expiracao as "dataExpiracao", 
        destaque,
        ativo
    `;
    
    const anuncioId = anuncio[0].id;
    
    // 2. Inserir os links relacionados, se houver
    if (links && links.length > 0) {
      
      for (const link of links) {
        console.log(link.tipo_link)
        await sql`
          INSERT INTO anuncio_links (
            anuncio_id, 
            tipo_link, 
            url, 
            texto_botao
          ) VALUES (
            ${anuncioId}, 
            ${link.tipo_link}, 
            ${link.url}, 
            ${link.texto_botao || 'Acessar'}
          )
        `;
      }
    }
    
    // 3. Buscar o anúncio completo com seus links
    const newAnuncio = await sql`
      SELECT 
        a.id, 
        a.titulo, 
        a.texto, 
        a.arte, 
        a.data_evento as "dataEvento", 
        a.data_publicacao as "dataPublicacao", 
        a.data_expiracao as "dataExpiracao", 
        a.destaque,
        a.ativo,
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'tipo_link', l.tipo_link,
              'url', l.url,
              'texto_botao', l.texto_botao
            )
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) as links
      FROM anuncios a
      LEFT JOIN anuncio_links l ON a.id = l.anuncio_id
      WHERE a.id = ${anuncioId}
      GROUP BY a.id
    `;
    
    return NextResponse.json(newAnuncio[0], { status: 201 });
  } catch (error) {
    console.error("Error creating anúncio:", error);
    return NextResponse.json(
      { error: "Falha ao criar anúncio" },
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