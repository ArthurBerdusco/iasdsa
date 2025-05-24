// app/api/componentes-config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import {
    ComponenteConfig,
    ComponenteChave,
    UpdateComponentRequest,
    ApiResponse
} from '@/types/components';

// Interface para resultado da query
interface ComponenteRow {
    componente_chave: ComponenteChave;
    habilitado: boolean;
}


export async function GET(): Promise<NextResponse<ApiResponse<ComponenteConfig>>> {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        // Query corrigida usando template literals do Neon
        const result = await sql`
            SELECT componente_chave, habilitado 
            FROM componentes_visualizacao 
            ORDER BY ordem_exibicao
        `;

        // Transformar resultado em objeto de configuração com tipagem correta
        const config = result.reduce<ComponenteConfig>((acc, row) => {
            const componenteRow = row as ComponenteRow;
            acc[componenteRow.componente_chave] = componenteRow.habilitado;
            return acc;
        }, {} as ComponenteConfig);

        return NextResponse.json({
            config,
            success: true
        });

    } catch (error) {
        console.error('Erro ao buscar configurações:', error);

        return NextResponse.json(
            {
                error: 'Erro interno do servidor',
                success: false
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest
): Promise<NextResponse<ApiResponse<{ updated: boolean }>>> {
    try {
        const sql = neon(process.env.DATABASE_URL!);

        // Validar se o corpo da requisição existe
        let body: UpdateComponentRequest;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    error: 'JSON inválido',
                    success: false
                },
                { status: 400 }
            );
        }

        const { componente_chave, habilitado } = body;

        // Validação dos dados recebidos
        if (!componente_chave || typeof habilitado !== 'boolean') {
            return NextResponse.json(
                {
                    error: 'Dados inválidos. Componente_chave é obrigatório e habilitado deve ser boolean',
                    success: false
                },
                { status: 400 }
            );
        }

        // Verificar se o componente existe antes de atualizar
        const existingComponent = await sql`
            SELECT componente_chave 
            FROM componentes_visualizacao 
            WHERE componente_chave = ${componente_chave}
        `;

        if (existingComponent.length === 0) {
            return NextResponse.json(
                {
                    error: 'Componente não encontrado',
                    success: false
                },
                { status: 404 }
            );
        }

        // Atualizar o componente
        const result = await sql`
            UPDATE componentes_visualizacao 
            SET habilitado = ${habilitado}
            WHERE componente_chave = ${componente_chave}
        `;

        return NextResponse.json({
            success: true,
            data: { updated: true }
        });

    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);

        return NextResponse.json(
            {
                error: 'Erro interno do servidor',
                success: false
            },
            { status: 500 }
        );
    }
}

// Opcional: Método para criar novos componentes
export async function POST(
    request: NextRequest
): Promise<NextResponse<ApiResponse<{ created: boolean }>>> {
    try {
        const sql = neon(process.env.DATABASE_URL!);

        const body = await request.json();
        const { componente_chave, habilitado = true, ordem_exibicao } = body;

        if (!componente_chave) {
            return NextResponse.json(
                {
                    error: 'componente_chave é obrigatório',
                    success: false
                },
                { status: 400 }
            );
        }

        // Verificar se já existe
        const existing = await sql`
            SELECT componente_chave 
            FROM componentes_visualizacao 
            WHERE componente_chave = ${componente_chave}
        `;

        if (existing.length > 0) {
            return NextResponse.json(
                {
                    error: 'Componente já existe',
                    success: false
                },
                { status: 409 }
            );
        }

        // Inserir novo componente
        await sql`
            INSERT INTO componentes_visualizacao (componente_chave, habilitado, ordem_exibicao)
            VALUES (${componente_chave}, ${habilitado}, ${ordem_exibicao || 999})
        `;

        return NextResponse.json({
            success: true,
            data: { created: true }
        });

    } catch (error) {
        console.error('Erro ao criar configuração:', error);

        return NextResponse.json(
            {
                error: 'Erro interno do servidor',
                success: false
            },
            { status: 500 }
        );
    }
}