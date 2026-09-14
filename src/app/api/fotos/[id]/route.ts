// app/api/fotos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RouteParams } from "@/types/routeParams";
import { getFotoById, updateFoto, deleteFoto } from "@/app/lib/db/fotos";

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const foto = await getFotoById(id);
    if (!foto) return NextResponse.json({ error: "Foto não encontrada" }, { status: 404 });
    return NextResponse.json(foto);
  } catch (error) {
    console.error("[GET /api/fotos/:id]", error);
    return NextResponse.json({ error: "Falha ao buscar a foto" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const foto = await updateFoto(id, formData);
    return NextResponse.json(foto);
  } catch (error) {
    console.error("[PUT /api/fotos/:id]", error);
    const message = error instanceof Error ? error.message : "Falha ao atualizar foto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteFoto(id);
    return NextResponse.json({ message: "Foto removida com sucesso" });
  } catch (error) {
    console.error("[DELETE /api/fotos/:id]", error);
    const message = error instanceof Error ? error.message : "Falha ao remover foto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
