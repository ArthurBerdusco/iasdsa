// app/api/youtube-data/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Substitua por sua chave de API do YouTube
const YOUTUBE_API_KEY = 'AIzaSyB9BI4dDqjC3AKHQ587lebtM27FMM9lKPc';

export async function GET(request: NextRequest) {
  try {
    // Obter o ID do vídeo da URL
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'videoId é obrigatório' }, { status: 400 });
    }

    // URL para a API do YouTube
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

    // Fazer a requisição para a API do YouTube
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}