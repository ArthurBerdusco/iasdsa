import React from 'react';
import { MessageCircle, Calendar, FormInput } from 'lucide-react';
import { GiBread } from 'react-icons/gi';
import Link from 'next/link';
import SectionHeader from './SectionHeader';

const Anuncios = () => {
  const anuncios = [
    {
      id: 6,
      titulo: "Encontro de Solteiros Adultos 2025",
      texto: "Participe do Encontro de Solteiros Adultos no dia 04/05, das 9h às 12h, no Auditório da AP. Almoço garantido! Clique e entre no grupo.",
      imagem: "/images/anuncios/encontro-solteiros-adultos.jpg",
      linkWhatsapp: "https://chat.whatsapp.com/EWsjhv9mvGmKlJDpFFbeC4",
      data: "04/05 das 9h às 12h"
    },
    {
      id: 9,
      titulo: "Escola de Culinária",
      texto: "Participe de uma aula especial de culinária com Giovanna Pitlovanciv! Dia 17/05 às 17h. Apenas R$ 10. Vagas limitadas!",
      imagem: "/images/anuncios/culinaria-2.jpg",
      linkWhatsapp: "https://wa.me/5511946003096",
      data: "17/05 às 17h",
    },    
    {
      id: 8,
      titulo: "Escola 117 - Curso de Liderança JA",
      texto:
        "Participe da Escola 117, curso gratuito de liderança para jovens a partir de 16 anos.\n\n📍 Local: IASD Santo Amaro\n🗓️ Datas das aulas:\n✅ 25/04\n✅ 02/05\n✅ 09/05\n✅ 16/05\n✅ 23/05\n✅ 30/05\n✅ 06/06\n✅ 13/06\n✅ 27/06",
      imagem: "/images/anuncios/escola-117.jpeg",
      linkForms: "https://forms.gle/9ZDu2yYWdEBW2Uy99",
      linkWhatsapp: "https://wa.me/+5511979814179",
      data: "Início: 25/04/2025 às 19h30"
    },  
    {
      id: 1,
      titulo: "Pão Caseiro Integral - Desbravadores",
      texto: "Ajude a comunidade e saboreie um delicioso pão caseiro integral! Faça seu pedido e contribua com os Desbravadores Borba Gato.",
      imagem: "/images/anuncios/pao-desbravadores.png",
      icone: <GiBread className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'https://wa.me/+5511984554580',
      data: "Solicitação pelo WhatsApp"
    },
    {
      id: 2,
      titulo: "Aulas de Instrumentos Musicais",
      texto: "Desperte o artista que há em você! Aprenda a tocar piano, violão e outros instrumentos musicais. Entre em contato para mais informações.",
      imagem: "/images/anuncios/musica.png",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkForms: "https://docs.google.com/forms/d/e/1FAIpQLSfCCgmzJBPckAzU8ZcwrZ8VsU7MIomRutKah6zBfgQwkkIf6Q/viewform",
      data: "Inscrições Abertas",
    },
    {
      id: 7,
      titulo: "Encontro de Casais",
      texto: "Reserve sua vaga para o Encontro de Casais no Resort Terras Altas, de 03 a 05/10/2025. Vagas limitadas! Entre no grupo para saber mais.",
      imagem: "/images/anuncios/encontro-de-casais.jpg",
      linkWhatsapp: "https://chat.whatsapp.com/EWsjhv9mvGmKlJDpFFbeC4",
      data: "03 a 05/10/2025"
    },  
    {
      id: 3,
      titulo: "CAMPAL 2025 - Vagas Limitadas!",
      texto: "Garanta sua vaga para o maior encontro do ano em Caraguatatuba! Alimentação, hospedagem e transporte inclusos. Corra, pois as vagas são limitadas!",
      imagem: "/images/anuncios/campal.jpg",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+5511985587107',
      data: "19 a 22 de junho"
    },
    {
      id: 4,
      titulo: "Congresso Mulheres Corajosas",
      texto: "Participe do Congresso Mulheres em Missão - Corajosas! Um dia de inspiração, conexão e transformação. As 100 primeiras inscritas concorrem a uma inscrição 100% gratuita!",
      imagem: "/images/anuncios/anuncio-mm.jpg",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+551135450845',
      linkForms: "https://forms.gle/5biDrwL8nvuPDgEH6",
      data: "11 de Outubro"
    },

  ];

  return (
    <div className="bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4">

        {/* Header */}
        <SectionHeader title='ANÚNCIOS'/>

        <div className="space-y-16">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Imagem à esquerda em telas médias ou maiores */}
                <div className="md:w-3/5 overflow-hidden">
                  <img
                    src={anuncio.imagem}
                    alt={anuncio.titulo}
                    className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Conteúdo à direita em telas médias ou maiores */}
                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center text-blue-600 mb-3">
                      {anuncio.icone}
                      <span className="text-sm font-semibold">{anuncio.data}</span>
                    </div>
                    <h3 className="text-2xl text-black font-bold mb-3">{anuncio.titulo}</h3>
                    <p className="text-gray-600 mb-6 whitespace-pre-line">{anuncio.texto}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {anuncio.linkWhatsapp && (
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">Deseja mais informações? Entre em contato:</span>
                        <Link
                          href={anuncio.linkWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 text-sm md:text-base"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Enviar mensagem no WhatsApp
                        </Link>

                      </div>
                    )}

                    {anuncio.linkForms && (
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">
                          Preencha o formulário de inscrição
                        </span>
                        <Link
                          href={anuncio.linkForms}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 text-sm md:text-base"
                        >
                          <FormInput className="h-5 w-5 mr-2" />
                          Preencher formulário de inscrição
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Anuncios;