'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const PedidoOracao = () => {
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc0KWKcA_u8YKXIuNszl7LWMvgOp-T2Uzps-0Wovun69glbyA/viewform";

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
          {/* Overlay escuro para melhor contraste */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>

          {/* Imagem do banner (garantindo que apareça inteira) */}
          <div className="bg-black/100 relative w-full h-auto aspect-[16/6]">
            <Image
              src="/images/lugar-oracao.png"
              alt="Lugar de Oração - Igreja Adventista de Santo Amaro"
              width={1600} // Ajuste conforme necessário
              height={600} // Ajuste conforme necessário
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Conteúdo */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <Link
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-full shadow-md transition-all hover:bg-yellow-700 hover:shadow-lg"
            >
              <span>Deixar Pedido / Agradecimento</span>
              <ExternalLink size={20} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PedidoOracao;
