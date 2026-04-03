// app/api/componentes-config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ComponenteChave, UpdateComponentRequest, ApiResponse, ComponenteConfig } from '@/types/components';
import { getComponenteConfig, createComponente, updateComponenteConfig } from '@/app/lib/db/config';

export async function GET(): Promise<NextResponse<ApiResponse<ComponenteConfig>>> {
  try {
    const config = await getComponenteConfig();
    return NextResponse.json({ config, success: true });
  } catch (error) {
    console.error('[GET /api/componentes-config]', error);
    return NextResponse.json({ error: 'Erro interno do servidor', success: false }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ updated: boolean }>>> {
  try {
    let body: UpdateComponentRequest;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON inválido', success: false }, { status: 400 });
    }

    const { componente_chave, habilitado } = body;

    if (!componente_chave || typeof habilitado !== 'boolean') {
      return NextResponse.json(
        { error: 'componente_chave é obrigatório e habilitado deve ser boolean', success: false },
        { status: 400 }
      );
    }

    await updateComponenteConfig(componente_chave as ComponenteChave, habilitado);

    return NextResponse.json({ success: true, data: { updated: true } });
  } catch (error) {
    console.error('[PUT /api/componentes-config]', error);

    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const status = message === 'Componente não encontrado' ? 404 : 500;

    return NextResponse.json({ error: message, success: false }, { status });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ created: boolean }>>> {
  try {
    const body = await request.json();
    const { componente_chave, habilitado = true, ordem_exibicao } = body;

    if (!componente_chave) {
      return NextResponse.json({ error: 'componente_chave é obrigatório', success: false }, { status: 400 });
    }

    await createComponente(componente_chave as ComponenteChave, habilitado, ordem_exibicao);

    return NextResponse.json({ success: true, data: { created: true } });
  } catch (error) {
    console.error('[POST /api/componentes-config]', error);

    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    const status = message === 'Componente já existe' ? 409 : 500;

    return NextResponse.json({ error: message, success: false }, { status });
  }
}