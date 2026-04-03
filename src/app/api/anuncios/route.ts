import { NextRequest, NextResponse } from 'next/server';
import { getAnuncios, createAnuncio } from '@/app/lib/db/anuncios';

export async function GET() {
  const anuncios = await getAnuncios();
  return NextResponse.json(anuncios);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const anuncio = await createAnuncio(formData);
    return NextResponse.json(anuncio, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao criar anúncio';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}