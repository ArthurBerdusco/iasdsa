'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { CalendarDays, Clock, Mic } from 'lucide-react';

const cultoSabado = {
  id: 1,
  titulo: 'Culto de Adoração - "Os Outros"',
  data: '05/04/2025',
  hora: '10h40',
  orador: 'Pr. Mauro Dias',
  imagem: '/images/culto-sabado.png'
};

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full transform scale-105">
        <Image
          src={cultoSabado.imagem}
          alt={cultoSabado.titulo}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="transition-transform duration-700 hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center z-10 px-4 sm:px-6 lg:px-8">
        {/* Main Content Box */}
        <div className="max-w-3xl w-full backdrop-blur-sm bg-black/30 rounded-2xl p-6 sm:p-8 border border-white/10">
          {/* Badge */}
          <div className="mb-4 inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide">
            Próximo Sábado
          </div>

          {/* Title with animated underline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-white mb-6 relative">
            {cultoSabado.titulo}
            <span className="absolute left-0 bottom-0 w-16 h-1 bg-yellow-400 rounded"></span>
          </h1>

          {/* Event Details Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-yellow-400/20 p-2 rounded-lg mr-3">
                  <CalendarDays size={24} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Data</p>
                  <p className="text-white font-medium text-lg">{cultoSabado.data}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-400/20 p-2 rounded-lg mr-3">
                  <Clock size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Horário</p>
                  <p className="text-white font-medium text-lg">{cultoSabado.hora}</p>
                </div>
              </div>

              {cultoSabado.orador && (
                <div className="flex items-center sm:col-span-2">
                  <div className="bg-green-400/20 p-2 rounded-lg mr-3">
                    <Mic size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Orador</p>
                    <p className="text-white font-medium text-lg">{cultoSabado.orador}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:translate-y-[-2px] shadow-lg flex-1 flex items-center justify-center group">
              <span>Participar</span>
              <ChevronRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="bg-transparent border-2 border-white/50 hover:border-white text-white font-medium py-3 px-6 rounded-lg transition-all flex-1 hover:bg-white/10">
              Ver Agenda Completa
            </button>
          </div> */}
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}