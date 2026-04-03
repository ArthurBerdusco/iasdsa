import { NextResponse } from 'next/server';
import { syncLatestCultos } from '@/app/lib/db/ultimos-cultos';

/**
 * POST /api/ultimos-cultos/sync
 *
 * Busca as últimas lives do canal no YouTube e faz upsert no banco.
 * Aceita um body opcional: { maxResults: number } (padrão: 6)
 *
 * Proteja esta rota com um secret header em produção:
 *   x-sync-secret: <SYNC_SECRET do .env>
 */
export async function POST(request: Request) {
    // Proteção básica por secret (opcional mas recomendado)
    const syncSecret = 'AIzaSyB9BI4dDqjC3AKHQ587lebtM27FMM9lKPc';

    const headerSecret = request.headers.get('x-sync-secret');

    console.log('HEADER RECEBIDO:', headerSecret);
    console.log('SECRET ESPERADO:', syncSecret);

    if (syncSecret && headerSecret !== syncSecret) {
        return NextResponse.json(
            {
                error: 'Não autorizado',
                received: headerSecret,
                expected: syncSecret,
            },
            { status: 401 }
        );
    }


    if (syncSecret) {
        const headerSecret = request.headers.get('x-sync-secret');
        if (headerSecret !== syncSecret) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
    }

    try {
        const body = await request.json().catch(() => ({}));
        const maxResults = Number(body?.maxResults) || 6;

        const result = await syncLatestCultos(maxResults);

        return NextResponse.json({
            success: true,
            message: `Sincronização concluída: ${result.inserted} inseridos, ${result.updated} atualizados.`,
            ...result,
        });
    } catch (error: any) {
        console.error('Erro na sincronização:', error);
        return NextResponse.json(
            { success: false, error: error.message ?? 'Falha na sincronização' },
            { status: 500 }
        );
    }
}