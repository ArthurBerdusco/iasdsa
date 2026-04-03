import { Anuncio } from "@/types/anuncios";

function isAnuncioArray(data: any): data is Anuncio[] {
  return Array.isArray(data) && data.every(item =>
    typeof item.id === 'number' &&
    typeof item.titulo === 'string' &&
    Array.isArray(item.links)
  );
}

export async function getAnuncios(): Promise<Anuncio[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/anuncios`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar anúncios");
    }

    const data = await res.json();

    if (!isAnuncioArray(data)) {
      throw new Error("Formato inválido de anúncios");
    }

    return data;
  } catch (error) {
    console.error("[getAnuncios]", error);
    return [];
  }
}