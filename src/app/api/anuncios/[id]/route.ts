import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { RouteParams } from "@/types/routeParams";
import { Anuncio } from "@/types/anuncios";

// GET: Fetch a single announcement by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Await params para Next.js 15+
    const { id } = await params;
    
    // Connect to the database
    const sql = neon(process.env.DATABASE_URL as string);
    
    // Query the specific anúncio with its links
    const anuncio = await sql`
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
      WHERE a.id = ${id}
      GROUP BY a.id
    ` as Anuncio[];

    if (anuncio.length === 0) {
      return NextResponse.json(
        { error: "Anúncio não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: anuncio[0]
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Falha ao buscar o anúncio" 
      },
      { status: 500 }
    );
  }
}

// PUT: Update an existing announcement
export async function PUT(
    request: NextRequest,
    { params }: RouteParams  // ✅ Mudança aqui - usando RouteParams
) {
    try {
        // ✅ Await params para Next.js 15+
        const { id } = await params;

        // Parse form data from request
        const formData = await request.formData();

        // Extract anúncio data
        const titulo = formData.get("titulo") as string;
        const texto = formData.get("texto") as string;
        const dataEvento = formData.get("dataEvento") as string;
        const destaque = formData.get("destaque") === "true";
        const ativo = formData.get("ativo") === "true";
        const linksString = formData.get("links") as string;
        const links = linksString ? JSON.parse(linksString) : [];

        // Connect to database
        const sql = neon(process.env.DATABASE_URL as string);

        // Check if anúncio exists
        const existingAnuncio = await sql`
          SELECT arte FROM anuncios WHERE id = ${id}
        `;

        if (existingAnuncio.length === 0) {
            return NextResponse.json(
                { 
                  success: false,
                  error: "Anúncio não encontrado" 
                },
                { status: 404 }
            );
        }

        // Handle image upload if provided
        const arte = formData.get("arte") as File;
        let artePath = existingAnuncio[0].arte; // Keep existing image by default

        if (arte && arte.size > 0) {
            // Delete old image if it exists
            const oldArtePath = existingAnuncio[0].arte;
            if (oldArtePath) {
                const oldFilePath = join(process.cwd(), "public", oldArtePath);
                if (existsSync(oldFilePath)) {
                    await unlink(oldFilePath);
                }
            }

            // Upload new image
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

        // Update the anúncio
        await sql`
          UPDATE anuncios
          SET 
            titulo = ${titulo},
            texto = ${texto},
            arte = ${artePath},
            data_evento = ${dataEvento},
            destaque = ${destaque},
            ativo = ${ativo}
          WHERE id = ${id}
        `;

        // Delete existing links and add new ones
        await sql`DELETE FROM anuncio_links WHERE anuncio_id = ${id}`;

        if (links && links.length > 0) {
            for (const link of links) {
                await sql`
                  INSERT INTO anuncio_links (
                    anuncio_id, 
                    tipo_link, 
                    url, 
                    texto_botao
                  ) VALUES (
                    ${id}, 
                    ${link.tipo_link}, 
                    ${link.url}, 
                    ${link.texto_botao || 'Acessar'}
                  )
                `;
            }
        }

        // Fetch the updated anúncio with its links
        const updatedAnuncio = await sql`
          SELECT 
            a.id, 
            a.titulo, 
            a.texto, 
            a.arte, 
            a.data_evento as "dataEvento", 
            a.data_publicacao as "dataPublicacao", 
            a.data_expiracao as "dataExpiracao", 
            a.destaque as "destaque",
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
          WHERE a.id = ${id}
          GROUP BY a.id
        `;

        return NextResponse.json({
          success: true,
          message: "Anúncio atualizado com sucesso",
          data: updatedAnuncio[0]
        });
    } catch (error) {
        console.error("Error updating anúncio:", error);
        return NextResponse.json(
            { 
              success: false,
              error: "Falha ao atualizar anúncio" 
            },
            { status: 500 }
        );
    }
}

// DELETE: Remove an announcement
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams  // ✅ Mudança aqui - usando RouteParams
) {
    try {
        // ✅ Await params para Next.js 15+
        const { id } = await params;

        // Connect to database
        const sql = neon(process.env.DATABASE_URL as string);

        // Check if anúncio exists and get image path
        const existingAnuncio = await sql`
          SELECT arte FROM anuncios WHERE id = ${id}
        `;

        if (existingAnuncio.length === 0) {
            return NextResponse.json(
                { 
                  success: false,
                  error: "Anúncio não encontrado" 
                },
                { status: 404 }
            );
        }

        // Delete the image file if it exists
        const artePath = existingAnuncio[0].arte;
        if (artePath) {
            const filePath = join(process.cwd(), "public", artePath);
            if (existsSync(filePath)) {
                await unlink(filePath);
            }
        }

        // Delete linked records first (links)
        await sql`DELETE FROM anuncio_links WHERE anuncio_id = ${id}`;

        // Delete the anúncio
        await sql`DELETE FROM anuncios WHERE id = ${id}`;

        return NextResponse.json(
            { 
              success: true,
              message: "Anúncio removido com sucesso" 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting anúncio:", error);
        return NextResponse.json(
            { 
              success: false,
              error: "Falha ao remover anúncio" 
            },
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