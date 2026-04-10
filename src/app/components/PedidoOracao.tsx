'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc0KWKcA_u8YKXIuNszl7LWMvgOp-T2Uzps-0Wovun69glbyA/viewform";

export default function PedidoOracao() {
  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4 sm:py-8">
      <SectionHeader title="PEDIDO DE ORAÇÃO" />

      <div className="relative w-full overflow-hidden rounded-[var(--border-radius)] shadow-lg">

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/15" />

        {/* Banner */}
        <Image
          unoptimized  
          src="/images/lugar-oracao.png"
          alt="Lugar de Oração - Igreja Adventista de Santo Amaro"
          width={1600}
          height={1600}
          className="h-[80vh] w-full object-contain"
          priority
        />

        {/* CTA */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <Link
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-[var(--border-radius)] bg-[var(--color-primary)] px-6 py-3 text-base font-bold text-[var(--color-text-inverse)] shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 sm:w-auto md:py-4 md:text-lg"
          >
            <span>Pedido de Oração / Agradecimento</span>
            <ExternalLink size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}