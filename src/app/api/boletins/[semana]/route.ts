// app/api/boletins/[semana]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@auth";
import { getBoletimPorSemana, deleteBoletim } from "@/app/lib/db/boletins";

type Params = { params: Promise<{ semana: string }> };

// GET /api/boletins/2026-W37 — snapshot completo de uma semana (público)
export async function GET(_req: Request, { params }: Params) {
  try {
    const { semana } = await params;
    const boletim = await getBoletimPorSemana(decodeURIComponent(semana));

    if (!boletim) {
      return NextResponse.json(
        { success: false, error: "Boletim não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, boletim });
  } catch (error) {
    console.error("[GET /api/boletins/:semana]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar boletim" },
      { status: 500 }
    );
  }
}

// DELETE /api/boletins/2026-W37 — remove um registro do arquivo (somente admin)
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user || role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const { semana } = await params;
    const boletim = await getBoletimPorSemana(decodeURIComponent(semana));

    if (!boletim) {
      return NextResponse.json(
        { success: false, error: "Boletim não encontrado" },
        { status: 404 }
      );
    }

    await deleteBoletim(boletim.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/boletins/:semana]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao remover boletim" },
      { status: 500 }
    );
  }
}
