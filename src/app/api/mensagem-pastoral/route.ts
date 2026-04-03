import { NextRequest, NextResponse } from 'next/server';
import { getMensagensPastorais, createMensagemPastoral } from '@/app/lib/db/mensagemPastoral';

export async function GET() {
  const mensagens = await getMensagensPastorais();
  return NextResponse.json(mensagens);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const mensagem = await createMensagemPastoral(formData);
    return NextResponse.json(mensagem, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao criar mensagem pastoral';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}