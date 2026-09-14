// app/api/boletins/auto-archive/route.ts
// ─── Arquivamento automático semanal ────────────────────────────────────────
// Disparado pelo Vercel Cron (ver vercel.json) toda segunda-feira de madrugada,
// para congelar o conteúdo da semana que acabou de terminar antes que o admin
// comece a cadastrar os dados da próxima semana.
//
// Protegido por CRON_SECRET: a Vercel envia automaticamente o header
// "Authorization: Bearer <CRON_SECRET>" em jobs de cron quando essa env var
// está configurada no projeto.

import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns";
import { archiveWeek } from "@/app/lib/db/boletins";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Arquiva a semana que terminou ontem (domingo), não a que está começando hoje.
    const semanaEncerrada = subDays(new Date(), 1);
    const boletim = await archiveWeek(semanaEncerrada, { automatico: true });

    return NextResponse.json({ success: true, boletim: boletim.semanaReferencia });
  } catch (error) {
    console.error("[GET /api/boletins/auto-archive]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao arquivar automaticamente" },
      { status: 500 }
    );
  }
}
