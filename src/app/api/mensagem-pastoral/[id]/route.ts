import { NextRequest, NextResponse } from 'next/server';
import { getMensagemPastoralById, updateMensagemPastoral, deleteMensagemPastoral } from '@/app/lib/db/mensagemPastoral';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const mensagem = await getMensagemPastoralById(id);
    if (!mensagem) return NextResponse.json({ error: 'Mensagem pastoral não encontrada' }, { status: 404 });
    return NextResponse.json(mensagem);
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar mensagem pastoral' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const mensagem = await updateMensagemPastoral(id, formData);
    return NextResponse.json(mensagem);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar mensagem pastoral';
    const status = message.includes('não encontrada') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteMensagemPastoral(id);
    return NextResponse.json({ message: 'Mensagem pastoral excluída com sucesso' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao excluir mensagem pastoral';
    const status = message.includes('não encontrada') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}