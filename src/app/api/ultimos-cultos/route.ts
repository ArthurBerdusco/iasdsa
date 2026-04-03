import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCultos,
  createCulto,
  CreateCultoInput,
} from '@/app/lib/db/ultimos-cultos'

// GET /api/ultimos-cultos — lista todos os cultos
export async function GET() {
  try {
    const cultos = await getAllCultos();
    return NextResponse.json(cultos);
  } catch (error) {
    console.error('Erro ao buscar cultos:', error);
    return NextResponse.json({ error: 'Falha ao buscar cultos' }, { status: 500 });
  }
}

// POST /api/ultimos-cultos — cria um novo culto manualmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, hora, titulo, descricao, linkyoutube, iframe } = body as CreateCultoInput;

    if (!data || !hora || !titulo || !linkyoutube || !iframe) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const novo = await createCulto({ data, hora, titulo, descricao, linkyoutube, iframe });
    return NextResponse.json(novo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar culto:', error);
    return NextResponse.json({ error: 'Falha ao criar culto' }, { status: 500 });
  }
}