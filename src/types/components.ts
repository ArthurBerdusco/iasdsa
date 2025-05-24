// types/components.ts

export interface ComponenteVisualizacao {
  id: number;
  componente_nome: string;
  componente_chave: ComponenteChave;
  habilitado: boolean;
  ordem_exibicao: number;
  descricao?: string;
  criado_em: Date;
  atualizado_em: Date;
}

export type ComponenteChave = 
  | 'cultos'
  | 'mensagem_pastoral'
  | 'programacao_cultos'
  | 'anuncios'
  | 'pedido_oracao'
  | 'fotos_semana'
  | 'dizimo'
  | 'redes_sociais';

export type ComponenteConfig = Record<ComponenteChave, boolean>;

export interface ComponenteConfigItem {
  componente_chave: ComponenteChave;
  habilitado: boolean;
  nome: string;
}

export interface ApiResponse<T> {
  config?: T;
  success?: boolean;
  error?: string;
}

export interface UpdateComponentRequest {
  componente_chave: ComponenteChave;
  habilitado: boolean;
}

export interface UseComponentConfigReturn {
  config: ComponenteConfig;
  loading: boolean;
  error: string | null;
}

export interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}