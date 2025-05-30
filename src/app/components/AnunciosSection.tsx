"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, FormInput, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Anuncio, TipoLink } from '@/types/anuncios';
import { formatDateForDisplay } from '@/utils/formatoData';

// Tipagem para as interfaces necessárias
interface SectionHeaderProps {
  title: string;
}

interface AnuncioLinksProps {
  anuncio: Anuncio;
  variant?: "card" | "destaque";
}

interface AnuncioCardProps {
  anuncio: Anuncio;
}

interface AnuncioDestaqueProps {
  anuncio: Anuncio;
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

// Componentes auxiliares
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h2>
    <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
  </div>
);

// Componente para mostrar os links/botões dos anúncios
const AnuncioLinks: React.FC<AnuncioLinksProps> = ({ anuncio, variant = "card" }) => {
  const getLinkByTipo = (tipo: TipoLink) => {
    return anuncio.links?.find(link => link.tipo_link === tipo);
  };

  const isDestaque = variant === "destaque";
  const buttonClasses = isDestaque ? "py-3 text-sm md:text-base" : "py-2 text-xs md:text-sm";

  return (
    <div className={`space-y-2 ${isDestaque ? "flex flex-col gap-3" : "mt-auto"}`}>
      {getLinkByTipo(TipoLink.FORMS) && (
        <div className={isDestaque ? "" : ""}>
          {isDestaque && <span className="text-sm text-gray-500 block mb-1">Inscrição</span>}
          <Link
            href={getLinkByTipo(TipoLink.FORMS)!.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium ${buttonClasses} px-4 rounded-lg transition-colors duration-300`}
          >
            <FormInput className={`${isDestaque ? "h-5 w-5" : "h-4 w-4"} mr-2`} />
            {getLinkByTipo(TipoLink.FORMS)!.textoBotao || 'Inscrever-se'}
          </Link>
        </div>
      )}

      {getLinkByTipo(TipoLink.WHATSAPP) && (
        <div className={isDestaque ? "" : ""}>
          {isDestaque && <span className="text-sm text-gray-500 block mb-1">Informações</span>}
          <Link
            href={getLinkByTipo(TipoLink.WHATSAPP)!.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium ${buttonClasses} px-4 rounded-lg transition-colors duration-300`}
          >
            <MessageCircle className={`${isDestaque ? "h-5 w-5" : "h-4 w-4"} mr-2`} />
            {getLinkByTipo(TipoLink.WHATSAPP)!.textoBotao || 'WhatsApp'}
          </Link>
        </div>
      )}

      {/* Botões para Instagram, Facebook e Website condensados em menu dropdown para economizar espaço */}
      {(getLinkByTipo(TipoLink.INSTAGRAM) || getLinkByTipo(TipoLink.FACEBOOK) || getLinkByTipo(TipoLink.WEBSITE)) && (
        <div className="flex gap-2">
          {getLinkByTipo(TipoLink.INSTAGRAM) && (
            <Link
              href={getLinkByTipo(TipoLink.INSTAGRAM)!.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:brightness-110 text-white font-medium ${buttonClasses} px-4 rounded-lg transition-all duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${isDestaque ? "h-5 w-5" : "h-4 w-4"} mr-2`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7zm5.75-.88a.88.88 0 1 1-1.75 0a.88.88 0 0 1 1.75 0z" />
              </svg>
              {isDestaque ? getLinkByTipo(TipoLink.INSTAGRAM)!.textoBotao || 'Instagram' : 'Instagram'}
            </Link>
          )}

          {getLinkByTipo(TipoLink.FACEBOOK) && (
            <Link
              href={getLinkByTipo(TipoLink.FACEBOOK)!.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-medium ${buttonClasses} px-4 rounded-lg transition-colors duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${isDestaque ? "h-5 w-5" : "h-4 w-4"} mr-2`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999c0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891c1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z" />
              </svg>
              {isDestaque ? getLinkByTipo(TipoLink.FACEBOOK)!.textoBotao || 'Facebook' : ''}
            </Link>
          )}

          {getLinkByTipo(TipoLink.WEBSITE) && (
            <Link
              href={getLinkByTipo(TipoLink.WEBSITE)!.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium ${buttonClasses} px-4 rounded-lg transition-colors duration-300`}
            >
              <Search className={`${isDestaque ? "h-5 w-5" : "h-4 w-4"} mr-2`} />
              {isDestaque ? getLinkByTipo(TipoLink.WEBSITE)!.textoBotao || 'Saiba mais' : ''}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

// Cartão de anúncio adaptável para diferentes proporções de imagem
const AnuncioCard: React.FC<AnuncioCardProps> = ({ anuncio }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageRatio, setImageRatio] = useState(0);

  // Verifica a proporção da imagem após o carregamento
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    setImageRatio(naturalWidth / naturalHeight);
    setImageLoaded(true);
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  // };

  // Define classes diferentes com base na proporção da imagem
  const getImageContainerClass = () => {
    if (!imageLoaded) return "aspect-video"; // Padrão antes de carregar

    if (imageRatio < 0.85) {
      return "aspect-[2/3]"; // Imagem vertical
    } else if (imageRatio > 1.5) {
      return "aspect-[16/9]"; // Imagem horizontal panorâmica
    } else {
      return "aspect-square"; // Imagem quadrada ou próxima disso
    }
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem responsiva com adaptação baseada na proporção da imagem */}
      <div className={`relative ${getImageContainerClass()} overflow-hidden`}>
        <img
          src={anuncio.arte}
          alt={anuncio.titulo}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDateForDisplay(anuncio.dataEvento)}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{anuncio.titulo}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-grow">{anuncio.texto}</p>
        {/* Botões de ação */}
        <AnuncioLinks anuncio={anuncio} />
      </div>
    </div>
  );
};

// Anúncio em destaque com layout adaptativo
const AnuncioDestaque: React.FC<AnuncioDestaqueProps> = ({ anuncio }) => {
  const [imageRatio, setImageRatio] = useState(0);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    setImageRatio(naturalWidth / naturalHeight);
  };

  // Determina o layout baseado na proporção da imagem
  const isVertical = imageRatio < 0.8;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl mb-8 hover:shadow-2xl transition-all duration-300">
      <div className={`flex flex-col ${isVertical ? 'lg:flex-row' : 'lg:flex-col'}`}>
        {/* Imagem adaptativa */}
        <div className={`${isVertical ? 'lg:w-1/2' : ''} relative overflow-hidden ${imageRatio === 0 ? 'aspect-video' : ''}`}>
          <img
            src={anuncio.arte}
            alt={anuncio.titulo}
            className={`w-full ${isVertical ? 'lg:h-full' : 'h-64 lg:h-80 xl:h-96'} object-cover object-center transform hover:scale-105 transition-transform duration-700`}
            onLoad={handleImageLoad}
          />
          {/* Gradiente somente na versão móvel ou em imagens horizontais */}
          <div className={`absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-80 ${isVertical ? 'lg:hidden' : ''}`}></div>

          {/* Tag de data sobre a imagem */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDateForDisplay(anuncio.dataEvento)}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo adaptativo */}
        <div className={`${isVertical ? 'lg:w-1/2' : ''} p-5 lg:p-8 flex flex-col justify-between`}>
          <div>
            <h3 className="text-2xl md:text-3xl text-gray-800 font-bold mb-3">{anuncio.titulo}</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base line-clamp-3 md:line-clamp-4 lg:line-clamp-none">
              {anuncio.texto}
            </p>
          </div>

          <AnuncioLinks anuncio={anuncio} variant="destaque" />
        </div>
      </div>
    </div>
  );
};

// Componente para exibir mês/ano como cabeçalho
const MonthDivider: React.FC<MonthDividerProps> = ({ month, year }) => (
  <div className="relative flex items-center my-8">
    <div className="flex-grow border-t border-gray-300/30"></div>
    <span className="flex-shrink mx-4 text-white/90 font-medium">{month} {year}</span>
    <div className="flex-grow border-t border-gray-300/30"></div>
  </div>
);

// Componente principal
const Anuncios: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const anunciosPorPagina = 9; // Aumentado para mostrar mais por página

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
      anuncio.texto.toLowerCase().includes(filtro.toLowerCase()) ||
      new Date(anuncio.dataEvento).toLocaleDateString('pt-BR').includes(filtro)
    );

  // Separar anúncios em destaque
  const anunciosDestaque = anunciosFiltrados.filter(anuncio => anuncio.destaque);
  const anunciosRegulares = anunciosFiltrados.filter(anuncio => !anuncio.destaque);

  // Ordenar anúncios por data (os mais próximos primeiro)
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
        grupos[chave] = {
          mes,
          ano,
          anuncios: []
        };
      }

      grupos[chave].anuncios.push(anuncio);
    });

    // Converter objeto em array e ordenar por data
    return Object.values(grupos).sort((a, b) => {
      const dataA = new Date(a.anuncios[0].dataEvento);
      const dataB = new Date(b.anuncios[0].dataEvento);
      return dataA.getTime() - dataB.getTime();
    });
  };

  const gruposMensais = agruparPorMes(anunciosOrdenados);

  // Paginação para grupos de meses
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
    <div className="bg-gradient-to-b from-blue-950 to-blue-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <SectionHeader title="QUADRO DE ANÚNCIOS" />

        {/* Barra de busca */}
        <div className="relative mb-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar anúncios..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPagina(1);
              }}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/60"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
          </div>
        </div>

        {/* Anúncios em Destaque */}
        {anunciosDestaque.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white/90 mb-6 flex items-center">
              <span className="inline-block w-2 h-6 bg-yellow-400 mr-3 rounded-full"></span>
              Eventos em Destaque
            </h3>
            <div className="space-y-8">
              {anunciosDestaque.map(anuncio => (
                <AnuncioDestaque key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          </div>
        )}

        {/* Anúncios agrupados por mês */}
        <div>
          <h3 className="text-xl font-bold text-white/90 mb-6 flex items-center">
            <span className="inline-block w-2 h-6 bg-blue-400 mr-3 rounded-full"></span>
            Calendário de Eventos
          </h3>

          {gruposPaginados.length > 0 ? (
            gruposPaginados.map((grupo) => (
              <div key={`${grupo.mes}-${grupo.ano}`}>
                <MonthDivider month={grupo.mes.charAt(0).toUpperCase() + grupo.mes.slice(1)} year={grupo.ano} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grupo.anuncios.map((anuncio) => (
                    <AnuncioCard key={anuncio.id} anuncio={anuncio} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-xl font-medium mb-2">Nenhum anúncio encontrado</h3>
              <p className="text-white/70">Tente usar termos diferentes na busca</p>
            </div>
          )}

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-2">
              <button
                onClick={paginaAnterior}
                disabled={pagina === 1}
                className={`flex items-center justify-center p-2 rounded-full 
                  ${pagina === 1
                    ? 'bg-blue-800/50 text-white/50 cursor-not-allowed'
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="text-white/90 px-4">
                Página {pagina} de {totalPaginas}
              </div>

              <button
                onClick={proximaPagina}
                disabled={pagina === totalPaginas}
                className={`flex items-center justify-center p-2 rounded-full 
                  ${pagina === totalPaginas
                    ? 'bg-blue-800/50 text-white/50 cursor-not-allowed'
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anuncios;