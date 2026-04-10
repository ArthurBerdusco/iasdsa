'use client'

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { Foto } from "@/types/fotos";
import { formatDateForDisplay } from "@/utils/formatoData";

export default function FotosDaSemana() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fotos");
      if (!response.ok) {
        throw new Error("Falha ao carregar fotos");
      }
      const data = await response.json();
      setFotos(data);
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
      setError("Não foi possível carregar as fotos. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only set up auto-sliding when there's more than one photo
  useEffect(() => {
    if (fotos.length <= 1) return; // Don't auto-slide if we have 0 or 1 photos

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, fotos.length]);

  // Funções de navegação - only work if there's more than one photo
  const handlePrevious = useCallback(() => {
    if (isAnimating || fotos.length <= 1) return;

    setIsAnimating(true);
    setCurrentIndex(prev => (prev === 0 ? fotos.length - 1 : prev - 1));

    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, fotos.length]);

  const handleNext = useCallback(() => {
    if (isAnimating || fotos.length <= 1) return;

    setIsAnimating(true);
    setCurrentIndex(prev => (prev === fotos.length - 1 ? 0 : prev + 1));

    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, fotos.length]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || fotos.length <= 1) return;

    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, isAnimating, fotos.length]);

  // Handlers para toque/swipe em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    if (fotos.length <= 1) return; // Don't handle touch events if we have 0 or 1 photos
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (fotos.length <= 1) return; // Don't handle touch events if we have 0 or 1 photos
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (fotos.length <= 1) return; // Don't handle touch events if we have 0 or 1 photos
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 50;

    if (isSignificantSwipe) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Navegação por teclado
  useEffect(() => {
    if (fotos.length <= 1) return; // Don't handle keyboard events if we have 0 or 1 photos

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, fotos.length]);


  // If loading, show a loading state
  if (isLoading) {
    return (
      <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-blue-500/30 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            FOTOS DA SEMANA
          </h1>
        </div>
        <SectionHeader title='FOTOS DA SEMANA' />
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-white">Carregando fotos...</div>
        </div>
      </section>
    );
  }

  // If error occurred, show error message
  if (error) {
    return (
      <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
        <SectionHeader title='FOTOS DA SEMANA' />
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-white/70 text-center">{error}</p>
        </div>
      </section>
    );
  }

  // If no photos data, show a message
  if (fotos.length === 0) {
    return (
      <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
        <SectionHeader title='FOTOS DA SEMANA' />
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-white/70 text-center">Nenhuma foto disponível no momento.</p>
        </div>
      </section>
    );
  }

  // Make sure currentIndex is valid (defensive programming)
  const safeIndex = Math.min(currentIndex, fotos.length - 1);
  if (safeIndex !== currentIndex) {
    setCurrentIndex(safeIndex);
  }

  // Only show navigation controls if we have more than one photo
  const showNavigation = fotos.length > 1;

  return (
    <section className="bg-blue-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Cabeçalho com animação sutil */}
        <SectionHeader title='FOTOS DA SEMANA' />

        {/* Galeria principal - IMAGEM SEPARADA DO PAINEL DE INFORMAÇÕES */}
        <div className="relative overflow-hidden rounded-t-xl shadow-xl bg-black/10 backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Container da imagem com altura fixa para consistência */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
            {fotos.length > 0 && (
              <Image
                unoptimized  
                src={fotos[safeIndex].foto}
                alt={fotos[safeIndex].titulo}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
                className="object-contain"
                style={{ backgroundColor: "#0c1b34" }} // Cor de fundo sutil que combina com o tema
              />
            )}

            {/* Navegação por setas - only show if we have more than one photo */}
            {showNavigation && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/2 -translate-y-1/2 left-2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  aria-label="Imagem anterior"
                  disabled={isAnimating}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  aria-label="Próxima imagem"
                  disabled={isAnimating}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Painel de informações SEPARADO da imagem */}
        {fotos.length > 0 && (
          <div className="bg-black/70 backdrop-blur-md px-4 sm:px-6 py-2 rounded-b-xl shadow-xl border-t border-gray-800">
            <div className="flex items-center space-x-2 text-blue-300 mb-1">
              <Calendar size={16} />
              <span className="text-xs sm:text-sm">{formatDateForDisplay(fotos[safeIndex].data)}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2">{fotos[safeIndex].titulo}</h3>

            <p className="text-gray-200 text-sm sm:text-base line-clamp-3 mb-3">
              {fotos[safeIndex].descricao}
            </p>
          </div>
        )}

        {/* Indicadores - only show if we have more than one photo */}
        {showNavigation && (
          <div className="flex justify-center mt-4">
            {fotos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`mx-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${safeIndex === index
                    ? "bg-blue-500 scale-110"
                    : "bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Ir para imagem ${index + 1}`}
                aria-current={safeIndex === index ? "true" : "false"}
              />
            ))}
          </div>
        )}

        {/* Thumbnails - only show if we have more than one photo */}
        {showNavigation && (
          <div className="hidden md:flex justify-center gap-3 mt-5">
            {fotos.map((image, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer transition duration-300 rounded-md overflow-hidden ${safeIndex === index
                    ? "ring-2 ring-blue-500 scale-105 shadow-lg"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                aria-label={`Selecionar ${image.titulo}`}
              >
                <div className="relative w-28 h-20">
                  <Image
                    unoptimized  
                    src={image.foto}
                    alt={image.titulo}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}