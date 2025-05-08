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

// Define types for our data
interface CultoProps {
  id: number;
  titulo: string;
  diaSemana: string;
  data: string;
  hora: string;
  orador: string;
  imagem: string;
  oradorImagem: string;
  corDestaque: 'primary' | 'secondary' | 'accent';
}

// Theme colors for easier maintenance
const themeColors = {
  primary: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/15',
    text: 'text-blue-500',
    border: 'border-blue-500',
  },
  secondary: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/15',
    text: 'text-blue-500',
    border: 'border-blue-500',
  },
  accent: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/15',
    text: 'text-blue-500',
    border: 'border-blue-500',
  },
};

// Mock data for the three worship services
const cultosData: CultoProps[] = [
  {
    id: 1,
    titulo: 'CULTO DE ADORAÇÃO',
    diaSemana: 'SÁBADO',
    data: '10/05/2025',
    hora: '10h40',
    orador: 'Pr. Mauro Dias',
    imagem: '/images/cultos/culto-sabado.jpeg',
    oradorImagem: '/images/pastores/mauro-dias.jpg',
    corDestaque: 'primary',
  },
  {
    id: 2,
    titulo: 'CULTO EVANGELÍSTICO',
    diaSemana: 'DOMINGO',
    data: '11/05/2025',
    hora: '10h00',
    orador: 'Marcelo Santos',
    imagem: '/images/cultos/culto-domingo.jpeg',
    oradorImagem: '/images/pastores/sem-imagem.jpg',
    corDestaque: 'secondary',
  },
  {
    id: 3,
    titulo: 'CULTO DE ORAÇÃO',
    diaSemana: 'QUARTA',
    data: '14/05/2025',
    hora: '20h00',
    orador: 'Bárbara Alencar',
    imagem: '/images/cultos/culto-oracao.jpg',
    oradorImagem: '/images/pastores/sem-imagem.jpg',
    corDestaque: 'accent',
  }
];

export default function CultosSwiper() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);


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
      <SectionHeader title='PRÓXIMOS CULTOS'/>

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
          {cultosData.map((culto) => {
            const colorClasses = themeColors[culto.corDestaque];

            return (
              <SwiperSlide key={culto.id}>
                <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                  {/* Card Header */}
                  <div className="bg-white/10 p-4 md:p-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-b border-white/10">
                    {/* Dia da semana + Título */}
                    <div className="flex flex-col">
                      <span className={`text-xl md:text-2xl font-black tracking-wider ${colorClasses.text}`}>
                        {culto.diaSemana}
                      </span>
                      <h3 className="text-white text-base md:text-lg font-semibold opacity-80 mt-1">
                        {culto.titulo}
                      </h3>
                    </div>

                    {/* Data e Hora */}
                    <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                      <div className={`flex items-center ${colorClasses.bgLight} px-3 py-1.5 rounded-lg`}>
                        <CalendarDays size={16} className={`${colorClasses.text} mr-2`} />
                        <span className="text-white font-medium">{culto.data}</span>
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
                            src={culto.oradorImagem}
                            alt={culto.orador}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs text-white/70 uppercase tracking-wider">Orador</p>
                          <p className="text-white font-semibold text-lg">{culto.orador}</p>
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