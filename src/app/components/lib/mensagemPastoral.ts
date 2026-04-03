import { MensagemPastor } from "@/types/mensagemPastoral";

const mensagemVazia: MensagemPastor = {
  id: 0,
  titulo: '',
  mensagem: '',
  foto: '',
  data_publicacao: '',
};

export async function getMensagemPastoral(): Promise<MensagemPastor> {
  try {
    const res = await fetch(`/api/mensagem-pastoral`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return mensagemVazia;
    }

    const data = await res.json();

    return data?.length > 0
      ? {
          id: data[0].id ?? 0,
          titulo: data[0].titulo ?? '',
          mensagem: data[0].mensagem ?? '',
          foto: data[0].foto ?? '',
          data_publicacao: data[0].data_publicacao ?? '',
        }
      : mensagemVazia;

  } catch (error) {
    console.error('Erro ao buscar mensagem pastoral:', error);
    return mensagemVazia;
  }
}