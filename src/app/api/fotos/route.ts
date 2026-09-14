// app/api/fotos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFotos, createFoto } from "@/app/lib/db/fotos";

export async function GET() {
  try {
    const fotos = await getFotos();
    return NextResponse.json(fotos);
  } catch (error) {
    console.error("[GET /api/fotos]", error);
    return NextResponse.json({ error: "Falha ao buscar fotos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const foto = await createFoto(formData);
    return NextResponse.json(foto, { status: 201 });
  } catch (error) {
    console.error("[POST /api/fotos]", error);
    const message = error instanceof Error ? error.message : "Falha ao criar foto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
