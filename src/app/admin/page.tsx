"use client";
import React, { useState, useEffect } from 'react';
import { 
  ComponenteConfig, 
  ComponenteConfigItem, 
  ComponenteChave, 
  ApiResponse, 
  UpdateComponentRequest 
} from '@/types/components';

interface UpdatingState {
  [key: string]: boolean;
}

const AdminComponentConfig: React.FC = () => {
  const [configs, setConfigs] = useState<ComponenteConfigItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<UpdatingState>({});

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/componentes-config');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data: ApiResponse<ComponenteConfig> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.config) {
        throw new Error('Configurações não encontradas');
      }
      
      // Converte o objeto de configurações em array para facilitar a renderização
      const configArray: ComponenteConfigItem[] = Object.entries(data.config).map(([chave, habilitado]) => ({
        componente_chave: chave as ComponenteChave,
        habilitado,
        nome: getComponentDisplayName(chave as ComponenteChave)
      }));
      
      setConfigs(configArray);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getComponentDisplayName = (chave: ComponenteChave): string => {
    const nomes: Record<ComponenteChave, string> = {
      cultos: 'Seção de Cultos',
      mensagem_pastoral: 'Mensagem Pastoral',
      programacao_cultos: 'Programação de Cultos',
      anuncios: 'Anúncios',
      pedido_oracao: 'Pedido de Oração',
      fotos_semana: 'Fotos da Semana',
      dizimo: 'Dízimo e Ofertas',
      redes_sociais: 'Redes Sociais'
    };
    return nomes[chave] || chave;
  };

  const toggleComponent = async (componenteChave: ComponenteChave, novoStatus: boolean): Promise<void> => {
    setUpdating(prev => ({ ...prev, [componenteChave]: true }));
    
    try {
      const requestBody: UpdateComponentRequest = {
        componente_chave: componenteChave,
        habilitado: novoStatus
      };

      const response = await fetch('/api/componentes-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: ApiResponse<never> = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      // Atualiza o estado local
      setConfigs(prev => 
        prev.map(config => 
          config.componente_chave === componenteChave 
            ? { ...config, habilitado: novoStatus }
            : config
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      alert('Erro ao atualizar configuração: ' + errorMessage);
    } finally {
      setUpdating(prev => ({ ...prev, [componenteChave]: false }));
    }
  };

  const LoadingView: React.FC = () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações dos Componentes</h1>
        <div className="text-center flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  );

  const ErrorView: React.FC<{ error: string }> = ({ error }) => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações dos Componentes</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Erro ao carregar configurações</h3>
          <p className="mt-1">{error}</p>
          <button 
            onClick={fetchConfigs}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações dos Componentes</h1>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Controle de Visibilidade</h2>
            <p className="text-gray-600 mb-6">
              Use os controles abaixo para mostrar ou ocultar componentes na página principal.
            </p>
            
            <div className="space-y-4">
              {configs.map((config) => (
                <div 
                  key={config.componente_chave}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{config.nome}</h3>
                    <p className="text-sm text-gray-500">
                      Chave: {config.componente_chave}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${
                      config.habilitado ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {config.habilitado ? 'Visível' : 'Oculto'}
                    </span>
                    
                    <ToggleSwitch
                      checked={config.habilitado}
                      onChange={() => toggleComponent(config.componente_chave, !config.habilitado)}
                      disabled={updating[config.componente_chave]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Informações importantes:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• As alterações são aplicadas imediatamente na página principal</li>
            <li>• Os componentes ocultos não serão renderizados no DOM</li>
            <li>• O Footer e NavBar são sempre visíveis</li>
            <li>• As configurações são persistidas no banco de dados</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminComponentConfig;