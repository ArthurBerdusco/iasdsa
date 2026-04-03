import { NextRequest, NextResponse } from 'next/server';
import {
  getCultoById,
  updateCulto,
  deleteCulto,
  UpdateCultoInput,
} from '@/app/lib/db/ultimos-cultos'
import { RouteParams } from '@/types/routeParams';

// GET /api/ultimos-cultos/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const culto = await getCultoById(Number(id));

    if (!culto) {
      return NextResponse.json({ error: 'Culto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(culto);
  } catch (error) {
    console.error('Erro ao buscar culto:', error);
    return NextResponse.json({ error: 'Falha ao buscar culto' }, { status: 500 });
  }
}

// PUT /api/ultimos-cultos/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json() as UpdateCultoInput;

    const updated = await updateCulto(Number(id), body);

    if (!updated) {
      return NextResponse.json({ error: 'Culto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar culto:', error);
    return NextResponse.json({ error: 'Falha ao atualizar culto' }, { status: 500 });
  }
}

// DELETE /api/ultimos-cultos/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteCulto(Number(id));

    if (!deleted) {
      return NextResponse.json({ error: 'Culto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Culto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir culto:', error);
    return NextResponse.json({ error: 'Falha ao excluir culto' }, { status: 500 });
  }
}