import { NextRequest, NextResponse } from "next/server";
import { getTheme, saveTheme } from "@/lib/theme-repository";
import { ThemeConfig } from "@/types/theme";

export async function GET() {
  try {
    const theme = await getTheme();
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("[GET /api/admin/theme]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar tema" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const theme = body.theme as ThemeConfig;

    if (!theme || !theme.colors || !theme.typography) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const saved = await saveTheme(theme);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Falha ao salvar no banco" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/admin/theme]", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}