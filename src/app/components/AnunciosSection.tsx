import React from 'react';
import { MessageCircle, Calendar, FormInput } from 'lucide-react';
import { GiBread, GiMeal } from 'react-icons/gi';
import Link from 'next/link';

const Anuncios = () => {
  const anuncios = [
    {
      id: 1,
      titulo: "CAMPAL 2025 - Vagas Limitadas!",
      texto: "Garanta sua vaga para o maior encontro do ano em Caraguatatuba! Inscrições com valor especial apenas no dia 07/04. Alimentação, hospedagem e transporte inclusos. Corra, pois as vagas são limitadas!",
      imagem: "/images/campal.jpg",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+5511985587107',
      data: "19 a 22 de junho"
    },
    {
      id: 2,
      titulo: "Pão Caseiro Integral - Desbravadores",
      texto: "Ajude a comunidade e saboreie um delicioso pão caseiro integral! Faça seu pedido e contribua com os Desbravadores Borba Gato.",
      imagem: "/images/pao-desbravadores.png",
      icone: <GiBread className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'https://wa.me/+5511984554580',
      data: "Solicitação"
    },
    {
      id: 3,
      titulo: "Lasanha Solidária - Clube de Aventureiros",
      texto: "Garanta já a sua lasanha! Escolha entre os sabores queijo e vegetariana. A entrega será no dia 06/04. Entre em contato para reservar a sua!",
      imagem: "/images/lasanha.png",
      icone: <GiMeal className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+5511951736602',
      data: "Entrega: 06/04"
    },
    {
      id: 4,
      titulo: "Aulas de Instrumentos Musicais",
      texto: "Desperte o artista que há em você! Aprenda a tocar piano, violão e outros instrumentos musicais. Entre em contato para mais informações.",
      imagem: "/images/musica.png",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkForms: "https://docs.google.com/forms/d/e/1FAIpQLSfCCgmzJBPckAzU8ZcwrZ8VsU7MIomRutKah6zBfgQwkkIf6Q/viewform"
    },
    {
      id: 5,
      titulo: "Congresso Mulheres Corajosas",
      texto: "Participe do Congresso Mulheres em Missão - Corajosas! Um dia de inspiração, conexão e transformação. As 100 primeiras inscritas concorrem a uma inscrição 100% gratuita!",
      imagem: "/images/anuncio-mm.jpg",
      icone: <Calendar className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+551135450845',
      linkForms: "https://forms.gle/5biDrwL8nvuPDgEH6",
      data: "11 de Outubro"
    }
  ];

  return (
    <div className="bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4">

        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center relative">
            ANÚNCIOS
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2 h-1 w-24 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full"></span>
          </h2>
        </div>

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
                    <p className="text-gray-600 mb-6">{anuncio.texto}</p>
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