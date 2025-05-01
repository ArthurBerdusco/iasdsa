'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';

const PedidoOracao = () => {
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc0KWKcA_u8YKXIuNszl7LWMvgOp-T2Uzps-0Wovun69glbyA/viewform";

  return (
    <div className="bg-blue-950">
      <div className="max-w-6xl mx-auto sm:py-8 px-2 sm:px-4">
        <SectionHeader title='PEDIDO DE ORAÇÃO' />
        <div className="bg-black relative w-full overflow-hidden rounded-lg shadow-lg">
          {/* Overlay para melhor contraste */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>

          {/* Imagem do banner com altura responsiva */}
          <div className="relative w-full">
            <Image
              src="/images/lugar-oracao.png"
              alt="Lugar de Oração - Igreja Adventista de Santo Amaro"
              width={1600}
              height={1600}
              className="w-full object-contain h-[80vh]"
              priority
            />

          </div>

          {/* Conteúdo responsivo */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-2 sm:px-4 text-center">
            <Link
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-6 rounded-lg shadow-lg transition transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-base md:text-lg w-full sm:w-auto">
              <span>Pedido de Oração / Agradecimento</span>
              <ExternalLink size={16} className="sm:inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoOracao;