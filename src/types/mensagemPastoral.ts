// Interface para dados da Mensagem Pastoral
export interface MensagemPastor {
  id: number;
  titulo: string;
  mensagem: string;
  foto: string;
  data_publicacao?: string;
}