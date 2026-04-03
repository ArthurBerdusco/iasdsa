import { NextRequest, NextResponse } from 'next/server';
import { getCultoById, updateCulto, deleteCulto } from '@/app/lib/db/cultos';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const culto = await getCultoById(id);
    if (!culto) return NextResponse.json({ error: 'Culto não encontrado' }, { status: 404 });
    return NextResponse.json(culto);
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar culto' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const culto = await updateCulto(id, formData);
    return NextResponse.json(culto);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar culto';
    const status = message.includes('não encontrado') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteCulto(id);
    return NextResponse.json({ message: 'Culto excluído com sucesso' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao excluir culto';
    const status = message.includes('não encontrado') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}