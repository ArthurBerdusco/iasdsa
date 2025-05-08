'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';

const MensagemPastoral = () => {
  return (
    <section className="bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header com ícone */}
        <SectionHeader title='MENSAGEM PASTORAL' />

        {/* Container principal com flexbox */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Imagem à esquerda (2/5) */}
            <div className="w-full lg:w-2/5 relative">
              <div className="relative h-64 lg:h-full min-h-[320px]">
                <Image
                  src="/images/mensagem-pastoral/arte.jpeg"
                  alt="Mensagem Pastoral"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-950/50 hidden lg:block"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block px-4 py-1.5 bg-white/90 text-blue-800 font-medium rounded-full text-sm tracking-wide shadow-lg">
                    Reflexão Semanal
                  </span>
                </div>
              </div>
            </div>

            {/* Divisor vertical no meio */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-blue-400/20 via-blue-300/50 to-blue-400/20 self-stretch"></div>

            {/* Conteúdo à direita em formato de card */}
            <div className="w-full lg:w-3/5 p-6 lg:p-8 flex flex-col">
              {/* Título da mensagem */}
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                Multidão Satisfeita
              </h3>

              {/* Texto da mensagem */}
              <div className="bg-white/10 p-6 rounded-xl border-l-4 border-blue-500 mb-8 flex-grow">

                <div className='text-gray-100 text-lg leading-relaxed'>

                </div>

                <p className='mb-5'>
                  Como conciliar pessoas que pensam de maneiras tão diferentes e culturas tão diversas em relação à salvação em Jesus? Um momento curioso do ministério de Jesus pode dar uma pista de como Ele age em relação a uma multidão diversa.

                </p>
                <p>
                  Somente nos Evangelhos a palavra multidão aparece 78 vezes. Motivados pelos milagres e ensinos de Jesus, números relevantes de pessoas em situações diversas, se apertaram para se aproximar ou apenas se sentaram em grandes auditórios ao ar livre para ouvir o Salvador.
                </p>
              </div>

              {/* Informações do pastor e botão */}
              <div className="flex flex-wrap items-center justify-between gap-6 mt-auto pt-4 border-t border-blue-700/30">
                {/* Informações do pastor */}
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full border-2 border-blue-400 p-0.5 shadow-lg">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src="/images/pastores/mauro-dias.jpg"
                        alt="Pastor Mauro Dias"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Pastor Mauro Dias</p>
                    <p className="text-sm text-blue-200">08 de maio, 2025</p>
                  </div>
                </div>

                {/* Botão "Ler Mais" */}
                <Link
                  href="https://sites.google.com/view/mensagempastoral/in%C3%ADcio"
                  target="_blank"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 group"
                >
                  <span>Ler Mais</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MensagemPastoral;