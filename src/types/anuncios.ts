export enum TipoLink {
  WHATSAPP = 'whatsapp',
  FORMS = 'forms',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  WEBSITE = 'website',
}

export interface AnuncioLink {
  id: number;
  tipo_link: TipoLink;
  url: string;
  textoBotao?: string;
}

export interface Anuncio {
  id: number;
  titulo: string;
  texto: string;
  arte: string;
  dataEvento: string;
  dataPublicacao?: Date; // opcional para formulário
  dataExpiracao?: Date;
  ativo: boolean;
  destaque: boolean;
  links: AnuncioLink[];
}
