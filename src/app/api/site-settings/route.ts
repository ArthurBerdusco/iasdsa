// app/api/site-settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@auth";
import {
  getSiteSettings,
  updateSiteSetting,
  uploadVideoInstitucional,
  uploadPosterInstitucional,
} from "@/app/lib/db/site-settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[GET /api/site-settings]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user || role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const titulo = formData.get("video_institucional_titulo") as string | null;
    const subtitulo = formData.get("video_institucional_subtitulo") as string | null;
    const video = formData.get("video") as File | null;
    const poster = formData.get("poster") as File | null;

    if (titulo !== null) await updateSiteSetting("video_institucional_titulo", titulo);
    if (subtitulo !== null) await updateSiteSetting("video_institucional_subtitulo", subtitulo);
    if (video && video.size > 0) await uploadVideoInstitucional(video);
    if (poster && poster.size > 0) await uploadPosterInstitucional(poster);

    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[PUT /api/site-settings]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar configurações" },
      { status: 500 }
    );
  }
}
