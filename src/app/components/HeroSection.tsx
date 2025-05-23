'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import SectionHeader from './SectionHeader';

// Theme colors for different emphasis colors
const themeColors = {
  primary: {
    text: 'text-blue-400',
    bgLight: 'bg-blue-900/50',
    border: 'border-blue-400'
  },
  secondary: {
    text: 'text-purple-400',
    bgLight: 'bg-purple-900/50',
    border: 'border-purple-400'
  },
  success: {
    text: 'text-green-400',
    bgLight: 'bg-green-900/50',
    border: 'border-green-400'
  },
  warning: {
    text: 'text-yellow-400',
    bgLight: 'bg-yellow-900/50',
    border: 'border-yellow-400'
  },
  danger: {
    text: 'text-red-400',
    bgLight: 'bg-red-900/50',
    border: 'border-red-400'
  },
  info: {
    text: 'text-cyan-400',
    bgLight: 'bg-cyan-900/50',
    border: 'border-cyan-400'
  }
};

// Interface for Culto data
interface Culto {
  id: number;
  titulo: string;
  diasemana: string;
  data: string;
  hora: string;
  orador: Orador;
  imagem: string; // Changed from 'arte' to match the component usage
  corDestaque: string; // Changed from 'cordestaque' to match the component usage
}

interface Orador {
  id: number;
  nome: string;
  foto: string;
}

export default function CultosSwiper() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

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
          imagem: culto.arte, // Map 'arte' from API to 'imagem' used in component
          corDestaque: culto.cordestaque, // Map 'cordestaque' from API to 'corDestaque' used in component
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

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Obter dia, mês e ano e adicionar zeros à esquerda quando necessário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa do zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

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

      {/* Swiper Component */}
      <div className="relative pb-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
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
          className="cultos-swiper rounded-2xl overflow-hidden shadow-xl"
        >
          {cultos.map((culto) => {
            // Default to primary if the color doesn't exist in our theme
            const colorClasses = themeColors[culto.corDestaque as keyof typeof themeColors] || themeColors.primary;

            return (
              <SwiperSlide key={culto.id}>
                <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                  {/* Card Header */}
                  <div className="bg-white/10 p-4 md:p-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-b border-white/10">
                    {/* Dia da semana + Título */}
                    <div className="flex flex-col">
                      <span className={`text-xl md:text-2xl font-black tracking-wider ${colorClasses.text}`}>
                        {culto.diasemana}
                      </span>
                      <h3 className="text-white text-base md:text-lg font-semibold opacity-80 mt-1">
                        {culto.titulo}
                      </h3>
                    </div>

                    {/* Data e Hora */}
                    <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                      <div className={`flex items-center ${colorClasses.bgLight} px-3 py-1.5 rounded-lg`}>
                        <CalendarDays size={16} className={`${colorClasses.text} mr-2`} />
                        <span className="text-white font-medium">{formatDateForDisplay(culto.data)}</span>
                      </div>
                      <div className={`flex items-center ${colorClasses.bgLight} px-3 py-1.5 rounded-lg`}>
                        <Clock size={16} className={`${colorClasses.text} mr-2`} />
                        <span className="text-white font-medium">{culto.hora}</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner Image */}
                  <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
                    <Image
                      src={culto.imagem}
                      alt={culto.titulo}
                      fill
                      priority
                      className="object-contain object-center transition-transform duration-700 hover:scale-105"
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-950/10 to-transparent"></div>

                    {/* Speaker info overlay with improved design */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <div className="flex items-center transparent p-3 rounded-lg inline-flex">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/70 shadow-lg">
                          <Image
                            src={culto.orador.foto}
                            alt={culto.orador.nome}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs text-white/70 uppercase tracking-wider">Orador</p>
                          <p className="text-white font-semibold text-lg">{culto.orador.nome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons - Improved */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 flex justify-between px-2 md:px-6 pointer-events-none">
          <button
            ref={navigationPrevRef}
            className="w-12 h-12 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-all focus:outline-none pointer-events-auto shadow-lg"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            ref={navigationNextRef}
            className="w-12 h-12 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-all focus:outline-none pointer-events-auto shadow-lg"
            aria-label="Próximo"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}