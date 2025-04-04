'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { CalendarDays, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const cultoSabado = {
  id: 1,
  titulo: 'PRÓXIMO SÁBADO 5/4 - CULTO DE ADORAÇÃO',
  data: '05/04/2025',
  hora: '10h40',
  orador: 'Pr. Mauro Dias',
  imagem: '/images/culto-sabado.png',
  oradorImagem: '/images/pastor.jpg'
};

export default function HeroBanner() {
  const [currentDate, setCurrentDate] = useState('');

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
    <div className="relative w-full bg-blue-950">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-blue-500 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center sm:text-left">
            BOLETIM INFORMATIVO
          </h1>
          <p className="text-sm md:text-base font-medium text-white mt-2 sm:mt-0">{currentDate}</p>
        </div>

        {/* Title with animated underline */}
        <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-white mb-6 relative text-center sm:text-left">
          {cultoSabado.titulo}
          <span className="absolute left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 -bottom-2 w-24 h-1 bg-yellow-400 rounded"></span>
        </h1>

        {/* Full Banner Image Section */}
        <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-lg">
          <Image
            src={cultoSabado.imagem}
            alt={cultoSabado.titulo}
            fill
            priority
            className="object-cover object-center rounded-2xl"
          />
        </div>

        {/* Information Section Below the Banner */}
        <div className="py-6">
          {/* Event Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 shadow-lg flex flex-col items-center text-center">
              <div className="bg-yellow-400/20 p-3 sm:p-4 rounded-xl mb-3">
                <CalendarDays size={24}  className="text-yellow-400" />
              </div>
              <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider">Data</p>
              <p className="text-white font-medium text-lg sm:text-xl mt-1">{cultoSabado.data}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 shadow-lg flex flex-col items-center text-center">
              <div className="bg-blue-400/20 p-3 sm:p-4 rounded-xl mb-3">
                <Clock size={24} className="text-blue-400" />
              </div>
              <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider">Horário</p>
              <p className="text-white font-medium text-lg sm:text-xl mt-1">{cultoSabado.hora}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 shadow-lg flex flex-col items-center text-center">
              {/* Imagem do orador em formato circular */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-green-400">
                {cultoSabado.oradorImagem ? (
                  <Image
                    src={cultoSabado.oradorImagem}
                    alt={cultoSabado.orador}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="w-full h-full bg-green-400/20 flex items-center justify-center">
                    <span className="text-green-400 text-lg sm:text-2xl font-bold">
                      {cultoSabado.orador.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider">Orador</p>
              <p className="text-white font-medium text-lg sm:text-xl mt-1">{cultoSabado.orador}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
