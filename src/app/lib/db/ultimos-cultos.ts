import { neon } from '@neondatabase/serverless';
import { CultoYoutube } from '@/types/ultimosCultos';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getDb = () => neon(process.env.DATABASE_URL as string);

/** Extrai o videoId de uma URL do YouTube (watch, youtu.be, live, shorts) */
export function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([^&?/\s]{11})/,
        /youtube\.com\/embed\/([^?/\s]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/** Monta a URL de embed a partir do videoId */
export function buildIframeSrc(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}

/** Monta a URL canônica do vídeo */
export function buildWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
}

/** Converte uma data ISO do YouTube para o formato YYYY-MM-DD */
export function isoToDate(iso: string): string {
    return iso.split('T')[0];
}

/** Converte uma data ISO do YouTube para HH:MM */
export function isoToTime(iso: string): string {
    return iso.split('T')[1]?.substring(0, 5) ?? '00:00';
}

// ─── YouTube API ─────────────────────────────────────────────────────────────

// ⚠️ Antes hardcoded no código-fonte (visível em qualquer clone do repo).
// Agora lidas de variáveis de ambiente — ver .env.example.
const YT_API_KEY = process.env.YOUTUBE_API_KEY as string;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID as string;

export interface YoutubeVideoInfo {
    videoId: string;
    titulo: string;
    descricao: string;
    publishedAt: string; // ISO
    linkyoutube: string;
    iframe: string;
    data: string;  // YYYY-MM-DD
    hora: string;  // HH:MM
}

/**
 * Busca as últimas `maxResults` lives/streams completadas do canal.
 * Usa a Search API para filtrar por tipo "completed" e eventType "completed".
 */
export async function fetchLatestLivesFromYoutube(
    maxResults = 6
): Promise<YoutubeVideoInfo[]> {
    if (!YT_API_KEY || !CHANNEL_ID) {
        throw new Error(
            'YOUTUBE_API_KEY e/ou YOUTUBE_CHANNEL_ID não configurados nas variáveis de ambiente.'
        );
    }

    // 1. Busca os IDs das lives mais recentes do canal
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'id,snippet');
    searchUrl.searchParams.set('channelId', CHANNEL_ID);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('maxResults', String(maxResults));
    searchUrl.searchParams.set('key', YT_API_KEY);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
        const err = await searchRes.json();
        throw new Error(`YouTube Search API error: ${JSON.stringify(err)}`);
    }

    const searchData = await searchRes.json();
    const items: any[] = searchData.items ?? [];

    if (items.length === 0) return [];

    // 2. Busca detalhes completos dos vídeos (snippet + contentDetails)
    const videoIds = items.map((i: any) => i.id.videoId).join(',');
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,contentDetails,liveStreamingDetails');
    videosUrl.searchParams.set('id', videoIds);
    videosUrl.searchParams.set('key', YT_API_KEY);

    const videosRes = await fetch(videosUrl.toString());
    if (!videosRes.ok) {
        const err = await videosRes.json();
        throw new Error(`YouTube Videos API error: ${JSON.stringify(err)}`);
    }

    const videosData = await videosRes.json();

    return (videosData.items ?? []).map((item: any) => {
        const videoId: string = item.id;
        const snippet = item.snippet;
        const publishedAt: string = snippet.publishedAt;

        return {
            videoId,
            titulo: snippet.title,
            descricao: snippet.description?.split('\n')[0] ?? '', // primeira linha
            publishedAt,
            linkyoutube: buildWatchUrl(videoId),
            iframe: buildIframeSrc(videoId),
            data: isoToDate(publishedAt),
            hora: isoToTime(publishedAt),
        } satisfies YoutubeVideoInfo;
    });
}

// ─── DB: leitura ─────────────────────────────────────────────────────────────

export async function getAllCultos(): Promise<CultoYoutube[]> {
    const sql = getDb();
    const rows = await sql`
    SELECT * FROM cultos_recentes
    ORDER BY data DESC, hora DESC
  `;
    return rows as CultoYoutube[];
}

export async function getCultoById(id: number): Promise<CultoYoutube | null> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM cultos_recentes WHERE id = ${id}`;
    return (rows[0] as CultoYoutube) ?? null;
}

// ─── DB: escrita ──────────────────────────────────────────────────────────────

export interface CreateCultoInput {
    data: string;
    hora: string;
    titulo: string;
    descricao?: string;
    linkyoutube: string;
    iframe: string;
}

export async function createCulto(input: CreateCultoInput): Promise<CultoYoutube> {
    const sql = getDb();
    const rows = await sql`
    INSERT INTO cultos_recentes (data, hora, titulo, descricao, linkyoutube, iframe)
    VALUES (
      ${input.data},
      ${input.hora},
      ${input.titulo},
      ${input.descricao ?? ''},
      ${input.linkyoutube},
      ${input.iframe}
    )
    RETURNING *
  `;
    return rows[0] as CultoYoutube;
}

export interface UpdateCultoInput extends Partial<CreateCultoInput> { }

export async function updateCulto(
    id: number,
    input: UpdateCultoInput
): Promise<CultoYoutube | null> {
    const current = await getCultoById(id);
    if (!current) return null;

    const merged = { ...current, ...input };
    const sql = getDb();

    const rows = await sql`
    UPDATE cultos_recentes
    SET
      data        = ${merged.data},
      hora        = ${merged.hora},
      titulo      = ${merged.titulo},
      descricao   = ${merged.descricao ?? ''},
      linkyoutube = ${merged.linkyoutube},
      iframe      = ${merged.iframe}
    WHERE id = ${id}
    RETURNING *
  `;
    return (rows[0] as CultoYoutube) ?? null;
}

export async function deleteCulto(id: number): Promise<boolean> {
    const sql = getDb();
    const rows = await sql`
    DELETE FROM cultos_recentes WHERE id = ${id} RETURNING id
  `;
    return rows.length > 0;
}

// ─── Sincronização automática ────────────────────────────────────────────────

export interface SyncResult {
    total: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: string[];
}

/**
 * Busca as últimas `maxResults` lives do canal e faz upsert no banco.
 *
 * Estratégia:
 *  - Limpa todos os registros atuais
 *  - Insere os N mais recentes do YouTube
 *
 * Isso garante que a tabela sempre reflita exatamente os N cultos mais recentes.
 */
export async function syncLatestCultos(maxResults = 6): Promise<SyncResult> {
    const result: SyncResult = {
        total: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };

    // 1. Busca lives no YouTube
    const lives = await fetchLatestLivesFromYoutube(maxResults);
    result.total = lives.length;

    if (lives.length === 0) {
        result.errors.push('Nenhuma live encontrada no canal.');
        return result;
    }

    const sql = getDb();

    // 2. Verifica quais videoIds já existem pelo link do youtube
    const existingRows = await sql`
    SELECT id, linkyoutube FROM cultos_recentes
  `;

    const existingMap = new Map<string, number>(
        existingRows.map((r: any) => [r.linkyoutube as string, r.id as number])
    );

    // 3. Upsert: update se existe, insert se não existe
    for (const live of lives) {
        try {
            const existingId = existingMap.get(live.linkyoutube);

            if (existingId) {
                await updateCulto(existingId, {
                    data: live.data,
                    hora: live.hora,
                    titulo: live.titulo,
                    descricao: live.descricao,
                    linkyoutube: live.linkyoutube,
                    iframe: live.iframe,
                });
                result.updated++;
            } else {
                await createCulto({
                    data: live.data,
                    hora: live.hora,
                    titulo: live.titulo,
                    descricao: live.descricao,
                    linkyoutube: live.linkyoutube,
                    iframe: live.iframe,
                });
                result.inserted++;
            }
        } catch (err: any) {
            result.errors.push(`Erro em ${live.videoId}: ${err.message}`);
            result.skipped++;
        }
    }

    // 4. Remove os registros antigos que não estão mais na lista atual
    const currentLinks = new Set(lives.map((l) => l.linkyoutube));
    for (const [link, id] of existingMap.entries()) {
        if (!currentLinks.has(link)) {
            await deleteCulto(id);
        }
    }

    return result;
}