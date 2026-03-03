"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

// Tipagem para as interfaces necessárias (usando as originais do código)
interface Anuncio {
  id: string;
  titulo: string;
  texto: string;
  arte: string;
  dataEvento: string;
  ativo: boolean;
  destaque: boolean;
  links?: Array<{
    tipo_link: string;
    url: string;
    textoBotao?: string;
  }>;
}

enum TipoLink {
  FORMS = 'forms',
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  WEBSITE = 'website'
}

interface SectionHeaderProps {
  title: string;
}

interface AnuncioCardProps {
  anuncio: Anuncio;
  isDestaque?: boolean;
  variant?: 'mobile' | 'desktop-destaque' | 'desktop-regular';
}

interface MonthDividerProps {
  month: string;
  year: number;
}

interface GrupoMensal {
  mes: string;
  ano: number;
  anuncios: Anuncio[];
}

// Função para formatar data
const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Componente de cabeçalho da seção
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h2>
    <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
  </div>
);

// Componente principal do card de anúncio adaptado para diferentes layouts
const AnuncioCard: React.FC<AnuncioCardProps> = ({ anuncio, isDestaque = false, variant = 'mobile' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Pegar o link principal (prioridade: forms > whatsapp > website > outros)
  const getLinkPrincipal = () => {
    if (!anuncio.links || anuncio.links.length === 0) return '#';

    const prioridade = [TipoLink.FORMS, TipoLink.WHATSAPP, TipoLink.WEBSITE, TipoLink.INSTAGRAM, TipoLink.FACEBOOK];

    for (const tipo of prioridade) {
      const link = anuncio.links.find(l => l.tipo_link === tipo);
      if (link) return link.url;
    }

    return anuncio.links[0].url;
  };

  const linkPrincipal = getLinkPrincipal();

  // Layout para desktop - destaque (coluna esquerda)
  if (variant === 'desktop-destaque') {
    return (
      <Link
        href={linkPrincipal}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div
          className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-400 bg-white mb-6"
          style={{
            transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Ícone de link externo */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
              <ExternalLink className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Container da imagem */}
          <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
            <img
              src={anuncio.arte}
              alt={anuncio.titulo}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />

            {/* Overlay gradiente para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          </div>

          {/* Efeito de borda no hover */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-400/50 transition-colors duration-300" />
        </div>
      </Link>
    );
  }

  // Layout para desktop - anúncios regulares (coluna direita)
  if (variant === 'desktop-regular') {
    return (
      <Link
        href={linkPrincipal}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div
          className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white"
          style={{
            transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ícone de link externo */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-1.5">
              <ExternalLink className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Container da imagem */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={anuncio.arte}
              alt={anuncio.titulo}
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
              }}
            />

            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          </div>

          {/* Borda no hover */}
          <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300" />
        </div>
      </Link>
    );
  }

  // Layout mobile/original
  if (isDestaque) {
    return (
      <Link
        href={linkPrincipal}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8 max-w-4xl mx-auto"
          style={{
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ícone de link externo */}
          <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
              <ExternalLink className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Container da imagem com aspect ratio fixo */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={anuncio.arte}
              alt={anuncio.titulo}
              className="w-full h-full object-contain bg-gradient-to-br from-blue-50 to-blue-100 transition-transform duration-700"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
              }}
            />

            {/* Overlay sutil para interação */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"
            />

            {/* Indicador de clique */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                Clique para acessar
              </div>
            </div>
          </div>

          {/* Efeito de borda animada no hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none'
            }}>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={linkPrincipal}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ícone de link externo */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-1.5">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Container da imagem com aspect ratio fixo */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <img
            src={anuncio.arte}
            alt={anuncio.titulo}
            className="w-full h-full object-contain bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-500"
            style={{
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
            }}
          />

          {/* Overlay para interação */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl" />

          {/* Indicador de clique (apenas mobile) */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 sm:hidden transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
              Tocar para acessar
            </div>
          </div>
        </div>

        {/* Borda sutil no hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300" />
      </div>
    </Link>
  );
};

// Componente para divisor de mês
const MonthDivider: React.FC<MonthDividerProps> = ({ month, year }) => (
  <div className="relative flex items-center my-6">
    <div className="flex-grow border-t border-white/20"></div>
    <span className="flex-shrink mx-4 text-white/90 font-semibold text-base tracking-wide flex items-center">
      <Calendar className="h-4 w-4 mr-2" />
      {month} {year}
    </span>
    <div className="flex-grow border-t border-white/20"></div>
  </div>
);

// Componente principal
const Anuncios: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const anunciosPorPagina = 6; // Para os grupos mensais no desktop

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/anuncios");
      if (!response.ok) {
        throw new Error("Falha ao carregar anúncios");
      }
      const data: Anuncio[] = await response.json();
      setAnuncios(data);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
      setError("Não foi possível carregar os anúncios. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar anúncios
  const anunciosFiltrados = anuncios
    .filter(anuncio => anuncio.ativo)
    .filter(anuncio =>
      anuncio.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      anuncio.texto.toLowerCase().includes(filtro.toLowerCase())
    );

  // Separar anúncios em destaque
  const anunciosDestaque = anunciosFiltrados.filter(anuncio => anuncio.destaque);
  const anunciosRegulares = anunciosFiltrados.filter(anuncio => !anuncio.destaque);

  // Ordenar anúncios por data
  const anunciosOrdenados = [...anunciosRegulares].sort((a, b) =>
    new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
  );

  // Agrupar anúncios por mês/ano
  const agruparPorMes = (anuncios: Anuncio[]): GrupoMensal[] => {
    const grupos: Record<string, GrupoMensal> = {};

    anuncios.forEach(anuncio => {
      const data = new Date(anuncio.dataEvento);
      const mes = data.toLocaleString('pt-BR', { month: 'long' });
      const ano = data.getFullYear();
      const chave = `${mes}-${ano}`;

      if (!grupos[chave]) {
        grupos[chave] = { mes, ano, anuncios: [] };
      }

      grupos[chave].anuncios.push(anuncio);
    });

    return Object.values(grupos).sort((a, b) => {
      const dataA = new Date(a.anuncios[0].dataEvento);
      const dataB = new Date(b.anuncios[0].dataEvento);
      return dataA.getTime() - dataB.getTime();
    });
  };

  const gruposMensais = agruparPorMes(anunciosOrdenados);

  // Paginação para desktop
  const totalPaginas = Math.max(1, Math.ceil(gruposMensais.length / anunciosPorPagina));
  const gruposPaginados = gruposMensais.slice(
    (pagina - 1) * anunciosPorPagina,
    pagina * anunciosPorPagina
  );

  const proximaPagina = () => {
    if (pagina < totalPaginas) {
      setPagina(pagina + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const paginaAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-blue-950 to-blue-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando anúncios...</p>
        </div>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div className="bg-gradient-to-b from-blue-950 to-blue-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center py-20 max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-medium mb-4">Algo deu errado</h3>
          <p className="text-white/70 mb-8">{error}</p>
          <button
            onClick={fetchAnuncios}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      {/* CSS para animação shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <SectionHeader title="QUADRO DE ANÚNCIOS" />

        {/* Barra de busca */}
        <div className="relative mb-12 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Buscar anúncios..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPagina(1);
            }}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/60 transition-all duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
        </div>

        {/* Layout responsivo: Mobile vs Desktop */}
        <div className="lg:hidden">
          {/* Layout Mobile (mantido como estava) */}

          {/* Anúncios em Destaque */}
          {anunciosDestaque.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-bold text-white/90 mb-8 flex items-center">
                <span className="inline-block w-2 h-6 bg-yellow-400 mr-3 rounded-full"></span>
                ⭐ Anúncios em Destaque
              </h3>
              <div className="space-y-8">
                {anunciosDestaque.map(anuncio => (
                  <AnuncioCard key={anuncio.id} anuncio={anuncio} isDestaque={true} variant="mobile" />
                ))}
              </div>
            </div>
          )}

          {/* Anúncios agrupados por mês */}
          <div>
            {gruposMensais.length > 0 ? (
              gruposMensais.map((grupo) => (
                <div key={`${grupo.mes}-${grupo.ano}`}>
                  <MonthDivider
                    month={grupo.mes.charAt(0).toUpperCase() + grupo.mes.slice(1)}
                    year={grupo.ano}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {grupo.anuncios.map((anuncio) => (
                      <AnuncioCard key={anuncio.id} anuncio={anuncio} variant="mobile" />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-white/70">Tente usar termos diferentes na busca</p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          {/* Layout Desktop - 3 Colunas */}
          <div className="grid grid-cols-12 gap-8">

            {/* Coluna 1: Anúncios em Destaque */}
            <div className="col-span-4">
              <div className="sticky top-6">
                <h3 className="text-xl font-bold text-white/90 mb-6 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" fill="currentColor" />
                  Anúncios em Destaque
                </h3>
                <div className="space-y-4">
                  {anunciosDestaque.length > 0 ? (
                    anunciosDestaque.map(anuncio => (
                      <AnuncioCard key={anuncio.id} anuncio={anuncio} variant="desktop-destaque" />
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/60">
                      <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum anúncio em destaque no momento</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna 2: Separador visual */}
            <div className="col-span-1 flex justify-center">
              <div className="w-px bg-white/20 h-full"></div>
            </div>

            {/* Coluna 3: Calendário de Anúncios */}
            <div className="col-span-7">
              <h3 className="text-xl font-bold text-white/90 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                Calendário de Anúncios
              </h3>

              <div>
                {gruposPaginados.length > 0 ? (
                  gruposPaginados.map((grupo) => (
                    <div key={`${grupo.mes}-${grupo.ano}`} className="mb-25">
                      <MonthDivider
                        month={grupo.mes.charAt(0).toUpperCase() + grupo.mes.slice(1)}
                        year={grupo.ano}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        {grupo.anuncios.map((anuncio) => (
                          <AnuncioCard key={anuncio.id} anuncio={anuncio} variant="desktop-regular" />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium mb-2">Nenhum anúncio encontrado</h3>
                    <p className="text-white/70">Tente usar termos diferentes na busca</p>
                  </div>
                )}

                {/* Paginação Desktop */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center items-center mt-12 space-x-4">
                    <button
                      onClick={paginaAnterior}
                      disabled={pagina === 1}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 
                        ${pagina === 1
                          ? 'bg-blue-800/50 text-white/50 cursor-not-allowed'
                          : 'bg-blue-700 text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="text-white/90 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                      <span className="font-medium">{pagina}</span>
                      <span className="text-white/70 mx-2">de</span>
                      <span className="font-medium">{totalPaginas}</span>
                    </div>

                    <button
                      onClick={proximaPagina}
                      disabled={pagina === totalPaginas}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 
                        ${pagina === totalPaginas
                          ? 'bg-blue-800/50 text-white/50 cursor-not-allowed'
                          : 'bg-blue-700 text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anuncios;