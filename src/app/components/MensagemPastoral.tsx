'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { useEffect, useState } from 'react';

interface MensagemPastoral {
  id: number;
  titulo: string;
  mensagem: string;
  foto: string;
  data_publicacao?: string;
}

const MensagemPastoral = () => {

  const [mensagem, setMensagem] = useState<MensagemPastoral>();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    fetchMensagemPastoral();
  }, []);

  const fetchMensagemPastoral = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mensagem-pastoral");
      if (!response.ok) {
        throw new Error("Falha ao carregar mensagem pastoral");
      }
      const data = await response.json();

      // Pegamos apenas a primeira mensagem, já que é única
      setMensagem(data.length > 0 ? data[0] : null);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !mensagem) {
    return (
      <>Carregando Mensagem Pastoral</>
    );
  }

    const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Obter dia, mês e ano e adicionar zeros à esquerda quando necessário
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa do zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


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
                  src={mensagem.foto}
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
                {mensagem.titulo}
              </h3>

              {/* Texto da mensagem */}
              <div className="bg-white/10 p-6 rounded-xl border-l-4 border-blue-500 mb-8 flex-grow">

                <div className="space-y-4">

                  {mensagem.mensagem.split('\n').map((paragraph, index) => (

                    <p key={index} className="text-white leading-relaxed">
                      {paragraph}
                    </p>

                  ))}
                </div>

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
                    <p className="text-sm text-blue-200">{formatDateForDisplay(mensagem.data_publicacao?mensagem.data_publicacao: "2025/05/05")}</p>
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