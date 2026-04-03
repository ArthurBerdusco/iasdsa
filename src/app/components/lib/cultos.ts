import { Culto } from '@/types/cultos';

export async function getCultos(): Promise<Culto[]> {
  const res = await fetch(`/api/cultos`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return data.map((c: any) => ({
    id: c.id,
    titulo: c.titulo,
    diasemana: c.diasemana,
    data: c.data,
    hora: c.hora,
    arte: c.arte,
    corDestaque: c.cordestaque,
    orador: {
      id: c.orador.id,
      nome: c.orador.nome,
      foto: c.orador.foto,
    },
  }));
}