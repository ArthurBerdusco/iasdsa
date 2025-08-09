'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import { CalendarDays, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import SectionHeader from './SectionHeader';
import { Culto } from '@/types/cultos';
import { formatDateForDisplay } from '@/utils/formatoData';

// Theme colors for different emphasis colors
const themeColors = {
  primary: {
    text: 'text-blue-400',
    bgLight: 'bg-blue-900/50',
    border: 'border-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/30'
  },
  secondary: {
    text: 'text-purple-400',
    bgLight: 'bg-purple-900/50',
    border: 'border-purple-400',
    gradient: 'from-purple-500/20 to-purple-600/30'
  },
  success: {
    text: 'text-green-400',
    bgLight: 'bg-green-900/50',
    border: 'border-green-400',
    gradient: 'from-green-500/20 to-green-600/30'
  },
  warning: {
    text: 'text-yellow-400',
    bgLight: 'bg-yellow-900/50',
    border: 'border-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-600/30'
  },
  danger: {
    text: 'text-red-400',
    bgLight: 'bg-red-900/50',
    border: 'border-red-400',
    gradient: 'from-red-500/20 to-red-600/30'
  },
  info: {
    text: 'text-cyan-400',
    bgLight: 'bg-cyan-900/50',
    border: 'border-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-600/30'
  }
};

export default function CultosSwiper() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch cultos data
  useEffect(() => {
    const fetchCultos = async () => {
      try {
        const response = await fetch('/api/cultos');
        if (!response.ok) {
          throw new Error('Failed to fetch cultos');
        }
        const data = await response.json();

        // Transform the API data to match our component requirements
        const formattedCultos = data.map((culto: any) => ({
          id: culto.id,
          titulo: culto.titulo,
          diasemana: culto.diasemana,
          data: culto.data,
          hora: culto.hora,
          arte: culto.arte,
          corDestaque: culto.cordestaque,
          orador: {
            id: culto.orador.id,
            nome: culto.orador.nome,
            foto: culto.orador.foto
          }
        }));

        setCultos(formattedCultos);
      } catch (error) {
        console.error('Error fetching cultos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCultos();
  }, []);

  // Set the current date on component mount
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("pt-BR", options));
  }, []);

  // If loading, show a loading state
  if (isLoading) {
    return (
      <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-blue-500/30 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            BOLETIM INFORMATIVO
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2 sm:mt-0">{currentDate}</p>
        </div>
        <SectionHeader title='PRÓXIMOS CULTOS' />
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-white">Carregando cultos...</div>
        </div>
      </section>
    );
  }

  // If no cultos data, show a message
  if (cultos.length === 0) {
    return (
      <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-blue-500/30 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            BOLETIM INFORMATIVO
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2 sm:mt-0">{currentDate}</p>
        </div>
        <SectionHeader title='PRÓXIMOS CULTOS' />
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-white/70 text-center">Nenhum culto programado no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
      {/* Subtle background element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          BOLETIM INFORMATIVO
        </h1>
        <p className="text-sm md:text-base text-white/80 mt-2 sm:mt-0">{currentDate}</p>
      </div>

      {/* Title with subtle underline */}
      <SectionHeader title='PRÓXIMOS CULTOS' />

      {/* Swiper Component - Layout Unificado */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          speed={800}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={false} // Removido as bolinhas automáticas do Swiper
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="cultos-swiper rounded-2xl overflow-hidden shadow-2xl mb-4"
        >
          {cultos.map((culto) => {
            const colorClasses = themeColors[culto.cordestaque as keyof typeof themeColors] || themeColors.primary;

            return (
              <SwiperSlide key={culto.id}>
                <div className="relative bg-gradient-to-br from-blue-900/40 to-blue-950/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                  
                  {/* Header Section - Unificado para mobile e desktop */}
                  <div className="relative z-20 bg-gradient-to-b from-blue-950/95 via-blue-950/80 to-transparent p-4 md:p-6 border-b border-white/10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div>
                        <span className={`text-xl md:text-2xl font-black tracking-wider ${colorClasses.text}`}>
                          {culto.diasemana}
                        </span>
                        <h3 className="text-white text-base md:text-lg font-semibold opacity-90 mt-1">
                          {culto.titulo}
                        </h3>
                      </div>

                      {/* Date and Time - Layout flexível */}
                      <div className="flex gap-2 md:gap-3">
                        <div className={`flex items-center ${colorClasses.bgLight} backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg border ${colorClasses.border}/30`}>
                          <CalendarDays size={isMobile ? 14 : 16} className={`${colorClasses.text} mr-1.5 md:mr-2`} />
                          <span className="text-white font-medium text-sm md:text-base">{formatDateForDisplay(culto.data)}</span>
                        </div>
                        <div className={`flex items-center ${colorClasses.bgLight} backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg border ${colorClasses.border}/30`}>
                          <Clock size={isMobile ? 14 : 16} className={`${colorClasses.text} mr-1.5 md:mr-2`} />
                          <span className="text-white font-medium text-sm md:text-base">{culto.hora}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Section - Altura reduzida e padronizada */}
                  <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
                    <Image
                      src={culto.arte}
                      alt={culto.titulo}
                      fill
                      priority
                      className="object-contain object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent md:bg-gradient-to-b md:from-transparent md:via-transparent md:to-blue-950/10"></div>
                  </div>

                  {/* Speaker Info Section - Layout unificado */}
                  <div className="relative z-20 bg-gradient-to-t from-blue-950/95 to-blue-950/80 md:bg-gradient-to-r md:from-blue-900/30 md:to-blue-800/30 backdrop-blur-sm border-t border-white/10 p-4 md:p-6">
                    <div className="flex items-center space-x-3 md:justify-center">
                      <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 md:border-3 ${colorClasses.border} shadow-lg md:shadow-xl md:ring-2 md:ring-white/20`}>
                        <Image
                          src={culto.orador.foto}
                          alt={culto.orador.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="md:ml-2">
                        <p className={`text-xs md:text-sm ${colorClasses.text} uppercase tracking-wider font-medium md:font-semibold mb-1 md:mb-2 flex items-center md:justify-center`}>
                          <User size={isMobile ? 14 : 16} className={`${colorClasses.text} mr-1.5 md:mr-2`} />
                          Orador
                        </p>
                        <p className="text-white font-semibold md:font-bold text-base md:text-xl md:text-center">{culto.orador.nome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons - Apenas para desktop */}
        {!isMobile && (
          <div className="absolute left-6 right-6 top-[40%] -translate-y-1/2 z-30 flex justify-between pointer-events-none">
            <button
              ref={navigationPrevRef}
              className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all duration-300 focus:outline-none pointer-events-auto shadow-lg border border-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              ref={navigationNextRef}
              className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all duration-300 focus:outline-none pointer-events-auto shadow-lg border border-white/20"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Custom Navigation Dots - Apenas se houver mais de um culto */}
        {cultos.length > 1 && (
          <div className="flex justify-center pt-4">
            <div className="flex space-x-2">
              {cultos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}