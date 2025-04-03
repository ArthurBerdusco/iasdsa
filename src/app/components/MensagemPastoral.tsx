'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const MensagemPastoral = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Imagem Ilustrativa */}
          <div className="w-full lg:w-2/5 relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image 
                src="/images/mensagem-pastoral.png" 
                alt="Mensagem Pastoral Ilustração" 
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                style={{ objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block px-4 py-1 bg-white/90 text-blue-800 font-medium rounded-full text-sm tracking-wide shadow-md">
                  Reflexão Semanal
                </span>
              </div>
            </div>
          </div>
          
          {/* Conteúdo Textual */}
          <div className="w-full lg:w-3/5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
              <h2 className="text-blue-800 font-bold text-xl uppercase tracking-wider">Mensagem Pastoral</h2>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Conexão</h3>
            
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Jesus ensinou diversas vezes por meio de perguntas, em sua maioria contundentes e desafiadoras. 
                Em um diálogo com pessoas que aparentemente criam no Messias, em João 8:46 essa pergunta é feita 
                e desde então ecoa através do tempo.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Image 
                    src="/images/pastor.jpg" 
                    alt="Pastor" 
                    width={36} 
                    height={36} 
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pastor Mauro Dias</p>
                  <p className="text-sm text-gray-500">02 de Abril, 2025</p>
                </div>
              </div>
              
              <Link target='_blank' href={'https://sites.google.com/view/mensagempastoral/in%C3%ADcio'} className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:translate-x-1 shadow-md group">
                <span>Ler Mais</span>
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MensagemPastoral;