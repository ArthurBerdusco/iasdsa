import { NextRequest, NextResponse } from 'next/server';
import { getAnuncioById, updateAnuncio, deleteAnuncio } from '@/app/lib/db/anuncios';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const anuncio = await getAnuncioById(id);
    if (!anuncio) return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 });
    return NextResponse.json(anuncio);
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar anúncio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const anuncio = await updateAnuncio(id, formData);
    return NextResponse.json(anuncio);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar anúncio';
    const status = message.includes('não encontrado') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteAnuncio(id);
    return NextResponse.json({ message: 'Anúncio removido com sucesso' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao remover anúncio';
    const status = message.includes('não encontrado') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}