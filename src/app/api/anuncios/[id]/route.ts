import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { RouteParams } from "@/types/routeParams";
import { Anuncio } from "@/types/anuncios";

// GET: Fetch a single announcement by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
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
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const formData = await request.formData();

        // Extract anúncio data
        const titulo = formData.get("titulo") as string;
        const texto = formData.get("texto") as string;
        const dataEvento = formData.get("dataEvento") as string;
        const destaque = formData.get("destaque") === "true";
        const ativo = formData.get("ativo") === "true";
        const linksString = formData.get("links") as string;
        const links = linksString ? JSON.parse(linksString) : [];

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

        const arte = formData.get("arte") as File | null;
        let arteUrl = existingAnuncio[0].arte; // Keep existing image by default

        // If new image uploaded
        if (arte && arte.size > 0) {
            // Delete old image from Blob if exists
            if (existingAnuncio[0].arte) {
                try {
                    await del(existingAnuncio[0].arte);
                } catch (error) {
                    console.error("Error deleting old image from blob:", error);
                }
            }

            // Upload new image to Vercel Blob
            const timestamp = Date.now();
            const extension = arte.name.split(".").pop();
            const filename = `anuncios/${titulo.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.${extension}`;

            const blob = await put(filename, arte, {
                access: 'public',
            });

            arteUrl = blob.url;
        }

        // Update the anúncio
        await sql`
          UPDATE anuncios
          SET 
            titulo = ${titulo},
            texto = ${texto},
            arte = ${arteUrl},
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
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const sql = neon(process.env.DATABASE_URL as string);

        // Check if anúncio exists and get image URL
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

        // Delete the image from Vercel Blob if it exists
        if (existingAnuncio[0].arte) {
            try {
                await del(existingAnuncio[0].arte);
            } catch (error) {
                console.error("Error deleting image from blob:", error);
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