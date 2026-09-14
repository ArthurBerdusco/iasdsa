// app/api/boletins/route.ts
import { NextResponse } from "next/server";
import { auth } from "@auth";
import { listBoletins, archiveWeek } from "@/app/lib/db/boletins";

// GET /api/boletins — lista pública do histórico (resumo, sem snapshot completo)
export async function GET() {
  try {
    const boletins = await listBoletins();
    return NextResponse.json({ success: true, boletins });
  } catch (error) {
    console.error("[GET /api/boletins]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar boletins" },
      { status: 500 }
    );
  }
}

// POST /api/boletins — arquiva manualmente a semana atual (somente admin)
export async function POST() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user || role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const boletim = await archiveWeek(new Date(), { automatico: false });
    return NextResponse.json({ success: true, boletim });
  } catch (error) {
    console.error("[POST /api/boletins]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao arquivar boletim" },
      { status: 500 }
    );
  }
}
