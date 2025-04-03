'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { CalendarDays, Clock } from 'lucide-react';

const cultoSabado = {
  id: 1,
  titulo: 'Culto de Adoração - "Os Outros"',
  data: '05/04/2025',
  hora: '10h40',
  orador: 'Pr. Mauro Dias',
  imagem: '/images/culto-sabado.png',
  oradorImagem: '/images/pastor.jpg' // Adicione o caminho para a imagem do orador
};

export default function HeroBanner() {
  return (
    <div className="relative w-full">
      {/* Full Banner Image Section - No Overlapping Content */}
      <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={cultoSabado.imagem}
            alt={cultoSabado.titulo}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="transition-transform duration-700 hover:scale-105"
          />
          {/* Subtle Gradient Overlay - Lighter to show more of the artwork */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        
        {/* Minimalist Title Overlay - Small and positioned at the top */}
        <div className="absolute top-8 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium tracking-wide">
              Próximo Sábado
            </div>
          </div>
        </div>
      </div>

      {/* Information Section Below the Banner */}
      <div className="relative bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Title with animated underline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 relative">
            {cultoSabado.titulo}
            <span className="absolute left-0 -bottom-2 w-24 h-1 bg-yellow-400 rounded"></span>
          </h1>

          {/* Event Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-400/20 p-4 rounded-2xl mb-4">
                  <CalendarDays size={32} className="text-yellow-400" />
                </div>
                <p className="text-gray-300 text-sm uppercase tracking-wider">Data</p>
                <p className="text-white font-medium text-xl mt-1">{cultoSabado.data}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-400/20 p-4 rounded-2xl mb-4">
                  <Clock size={32} className="text-blue-400" />
                </div>
                <p className="text-gray-300 text-sm uppercase tracking-wider">Horário</p>
                <p className="text-white font-medium text-xl mt-1">{cultoSabado.hora}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="flex flex-col items-center text-center">
                {/* Imagem do orador em um formato circular */}
                <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-green-400">
                  {cultoSabado.oradorImagem ? (
                    <Image
                      src={cultoSabado.oradorImagem}
                      alt={cultoSabado.orador}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-green-400/20 flex items-center justify-center">
                      <span className="text-green-400 text-2xl font-bold">
                        {cultoSabado.orador.split(' ').map(name => name[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-sm uppercase tracking-wider">Orador</p>
                <p className="text-white font-medium text-xl mt-1">{cultoSabado.orador}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



{/* Action Buttons */ }
{/* <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:translate-y-[-2px] shadow-lg flex-1 flex items-center justify-center group">
              <span>Participar</span>
              <ChevronRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="bg-transparent border-2 border-white/50 hover:border-white text-white font-medium py-3 px-6 rounded-lg transition-all flex-1 hover:bg-white/10">
              Ver Agenda Completa
            </button>
          </div> */}