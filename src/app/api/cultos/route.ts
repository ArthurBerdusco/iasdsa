import { NextRequest, NextResponse } from 'next/server';
import { getCultos, createCulto } from '@/app/lib/db/cultos';

export async function GET() {
  const cultos = await getCultos();
  return NextResponse.json(cultos);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const culto = await createCulto(formData);
    return NextResponse.json(culto, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao criar culto';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}