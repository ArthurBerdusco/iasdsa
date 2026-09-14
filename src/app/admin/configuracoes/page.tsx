"use client";
// app/admin/configuracoes/page.tsx
// Padronizado com o kit visual do admin (AdminPageHeader / AdminCard / ToggleSwitch)

import React, { useState, useEffect } from 'react';
import { Settings, Loader2, RefreshCw } from 'lucide-react';
import {
  ComponenteConfig,
  ComponenteConfigItem,
  ComponenteChave,
  ApiResponse,
  UpdateComponentRequest
} from '@/types/components';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminCard from '../../components/admin/ui/AdminCard';
import ToggleSwitch from '../../components/admin/ui/ToggleSwitch';

interface UpdatingState {
  [key: string]: boolean;
}

const NOMES: Record<ComponenteChave, string> = {
  cultos: 'Seção de Cultos',
  mensagem_pastoral: 'Mensagem Pastoral',
  programacao_cultos: 'Programação de Cultos',
  anuncios: 'Anúncios',
  pedido_oracao: 'Pedido de Oração',
  fotos_semana: 'Fotos da Semana',
  fotos_blob: 'Blob',
  dizimo: 'Dízimo e Ofertas',
  redes_sociais: 'Redes Sociais',
};

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
      setError(null);
      const response = await fetch('/api/componentes-config');

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data: ApiResponse<ComponenteConfig> = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data.config) throw new Error('Configurações não encontradas');

      const configArray: ComponenteConfigItem[] = Object.entries(data.config).map(
        ([chave, habilitado]) => ({
          componente_chave: chave as ComponenteChave,
          habilitado,
          nome: NOMES[chave as ComponenteChave] || chave,
        })
      );

      setConfigs(configArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const toggleComponent = async (
    componenteChave: ComponenteChave,
    novoStatus: boolean
  ): Promise<void> => {
    setUpdating((prev) => ({ ...prev, [componenteChave]: true }));

    try {
      const requestBody: UpdateComponentRequest = {
        componente_chave: componenteChave,
        habilitado: novoStatus,
      };

      const response = await fetch('/api/componentes-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: ApiResponse<never> = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      setConfigs((prev) =>
        prev.map((config) =>
          config.componente_chave === componenteChave
            ? { ...config, habilitado: novoStatus }
            : config
        )
      );
    } catch (err) {
      alert('Erro ao atualizar configuração: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setUpdating((prev) => ({ ...prev, [componenteChave]: false }));
    }
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Configurações"
        description="Controle quais seções da home ficam visíveis para o público."
        icon={<Settings size={20} />}
        actions={
          <button
            onClick={fetchConfigs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={13} /> Atualizar
          </button>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={fetchConfigs} className="ml-3 font-semibold underline">
            Tentar novamente
          </button>
        </div>
      )}

      <AdminCard
        title="Visibilidade das seções"
        description="Alterações são aplicadas imediatamente na página principal — seções ocultas não são renderizadas."
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" /> Carregando...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {configs.map((config) => (
              <div
                key={config.componente_chave}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{config.nome}</h3>
                  <p className="text-xs text-slate-400">{config.componente_chave}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      config.habilitado ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {config.habilitado ? 'Visível' : 'Oculto'}
                  </span>
                  <ToggleSwitch
                    checked={config.habilitado}
                    onChange={() => toggleComponent(config.componente_chave, !config.habilitado)}
                    disabled={updating[config.componente_chave]}
                    label={config.nome}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminComponentConfig;
