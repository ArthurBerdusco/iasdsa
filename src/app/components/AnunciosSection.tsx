import React from 'react';
import { Phone, Ticket, Music, FormInput } from 'lucide-react';
import { GiBread, GiMeal } from 'react-icons/gi';
import Link from 'next/link';

const Anuncios = () => {
  const anuncios = [
    {
      id: 1,
      titulo: "CAMPAL 2025 - Vagas Limitadas!",
      texto: "Garanta sua vaga para o maior encontro do ano em Caraguatatuba! Inscrições com valor especial apenas no dia 07/04. Alimentação, hospedagem e transporte inclusos. Corra, pois as vagas são limitadas!",
      imagem: "/images/campal.jpg",
      botao: "Inscreva-se Agora",
      icone: <Ticket className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+5511985587107',
      data: "19 a 22 de junho"
    },
    {
      id: 2,
      titulo: "Pão Caseiro Integral - Desbravadores",
      texto: "Ajude a comunidade e saboreie um delicioso pão caseiro integral! Faça seu pedido e contribua com os Desbravadores Borba Gato.",
      imagem: "/images/pao-desbravadores.png",
      botao: "Falar com Augusto",
      icone: <GiBread className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'https://wa.me/+5511984554580',
      data: "Solicitação"
    },
    {
      id: 3,
      titulo: "Lasanha Solidária - Clube de Aventureiros",
      texto: "Garanta já a sua lasanha! Escolha entre os sabores queijo e vegetariana. A entrega será no dia 06/04. Entre em contato para reservar a sua!",
      imagem: "/images/lasanha.png",
      botao: "Falar com Ivone",
      icone: <GiMeal className="h-5 w-5 mr-1" />,
      linkWhatsapp: 'http://wa.me/+5511951736602',
      data: "Entrega: 06/04"
    },
    {
      id: 4,
      titulo: "Aulas de Instrumentos Musicais",
      texto: "Desperte o artista que há em você! Aprenda a tocar piano, violão e outros instrumentos musicais. Entre em contato para mais informações.",
      imagem: "/images/musica.png",
      botao: "Saiba mais",
      icone: <Music className="h-5 w-5 mr-1" />,
      linkForms: "https://docs.google.com/forms/d/e/1FAIpQLSfCCgmzJBPckAzU8ZcwrZ8VsU7MIomRutKah6zBfgQwkkIf6Q/viewform"
    }
  ];

  return (
    <div className="bg-blue-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Anúncios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Fique por dentro dos eventos e oportunidades da nossa comunidade</p>
        </div>

        <div className="space-y-8">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
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
                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-blue-600 mb-3">
                      {anuncio.icone}
                      <span className="text-sm font-semibold">{anuncio.data}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{anuncio.titulo}</h3>
                    <p className="text-gray-600 mb-6">{anuncio.texto}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anuncio.linkWhatsapp && (
                      <Link href={anuncio.linkWhatsapp} className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        <Phone className="h-5 w-5 mr-2" />
                        WhatsApp
                      </Link>
                    )}
                    {anuncio.linkForms && (
                      <Link href={anuncio.linkForms} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        <FormInput className="h-5 w-5 mr-2" />
                        Formulário
                      </Link>
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