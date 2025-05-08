'use client'

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";

// Interface para dados de imagem
interface ImageData {
  src: string;
  title: string;
  date: string;
  description: string;
}

// Dados de exemplo - em produção seriam obtidos de uma API ou CMS
const sampleImages: ImageData[] = [
  {
    src: "/images/fotos-semana/culto-sabado.png",
    title: "Culto sábado - Aporta Aberta - Paulo Tadeu",
    date: "03/05/2025",
    description: "Momento de pregação"
  },
  {
    src: "/images/fotos-semana/spresart-culto-conexao.png",
    title: "Culto Conexão - Grupo Spresart",
    date: "04/05/2025",
    description: "Momento de Louvores do grupo Spresart no Culto Conexão"
  },


]

export default function FotosDaSemana() {
  const [images, setImages] = useState<ImageData[]>(sampleImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Controle de slide automático
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  // Funções de navegação
  const handlePrevious = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, images.length, isAnimating]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, images.length, isAnimating]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;

    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, isAnimating]);

  // Handlers para toque/swipe em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  return (
    <section className="bg-blue-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Cabeçalho com animação sutil */}
        <SectionHeader title='FOTOS DA SEMANA'/>

        {/* Galeria principal - IMAGEM SEPARADA DO PAINEL DE INFORMAÇÕES */}
        <div className="relative overflow-hidden rounded-t-xl shadow-xl bg-black/10 backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Container da imagem com altura fixa para consistência */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].title}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
              className="object-contain"
              style={{ backgroundColor: "#0c1b34" }} // Cor de fundo sutil que combina com o tema
            />

            {/* Navegação por setas */}
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
          </div>
        </div>

        {/* Painel de informações SEPARADO da imagem */}
        <div className="bg-black/70 backdrop-blur-md px-4 sm:px-6 py-2 rounded-b-xl shadow-xl border-t border-gray-800">
          <div className="flex items-center space-x-2 text-blue-300 mb-1">
            <Calendar size={16} />
            <span className="text-xs sm:text-sm">{images[currentIndex].date}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-2">{images[currentIndex].title}</h3>

          <p className="text-gray-200 text-sm sm:text-base line-clamp-3 mb-3">
            {images[currentIndex].description}
          </p>

        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`mx-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${currentIndex === index
                  ? "bg-blue-500 scale-110"
                  : "bg-white/30 hover:bg-white/50"
                }`}
              aria-label={`Ir para imagem ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            />
          ))}
        </div>

        {/* Thumbnails */}
        <div className="hidden md:flex justify-center gap-3 mt-5">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer transition duration-300 rounded-md overflow-hidden ${currentIndex === index
                  ? "ring-2 ring-blue-500 scale-105 shadow-lg"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              aria-label={`Selecionar ${image.title}`}
            >
              <div className="relative w-28 h-20">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}