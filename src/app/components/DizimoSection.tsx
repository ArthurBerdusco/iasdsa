import React from 'react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const BannerDizimo = () => {
  return (
    <div className="bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="relative overflow-hidden rounded-xl shadow-2xl flex flex-col lg:flex-row">
          {/* Conteúdo principal à esquerda */}
          <div className="relative flex-1 flex flex-col justify-center p-6 md:p-10 lg:p-16 z-10 bg-gradient-to-br from-stone-400 to-stone-500">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Dízimos e Ofertas</h2>
              </div>

              <p className="text-blue-100 mb-8 text-base md:text-lg">
                Contribua para o avanço da obra de Deus por meio de seus dízimos e ofertas. A sua ajuda é importante para manutenção da igreja e pregação do evangelho.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Link
                  target='_blank'
                  href="https://giving.7me.app/guest-donation/church/d83b1b17-d0cc-4c9a-ab4d-86c2f26acc43?utm_source=boletim&utm_medium=link&utm_campaign=boletim"
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-6 rounded-lg shadow-lg transition transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-base md:text-lg w-full sm:w-auto">
                  <span>Clique para Dizimar</span>
                  <ExternalLink className="h-4 w-4 md:h-5 md:w-5 ml-2 flex-shrink-0" />
                </Link>
              </div>

              <div className="">
                <p className="text-white text-sm md:text-base">Baixe o aplicativo:</p>
                <div className="flex gap-2">
                  <Link href="https://play.google.com/store/apps/details?id=com.iatec.acms.me&pcampaignid=web_share" target="_blank" className="transition hover:opacity-80">
                    <img src="/images/badge-google.svg" alt="Google Play" className="h-10 md:h-12 w-auto" />
                  </Link>
                  <Link href="https://apps.apple.com/br/app/7me/id1344775660" target="_blank" className="transition hover:opacity-80">
                    <img src="/images/badge-apple.svg" alt="App Store" className="h-10 md:h-12 w-auto" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Informações do 7ME à direita */}
          <div id="sobre-7me" className="relative flex-1 flex flex-col justify-center items-center bg-white text-black p-6 md:p-10 lg:p-16 rounded-b-xl lg:rounded-b-none lg:rounded-r-xl shadow-lg">
            <div className="w-full max-w-md">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <img
                    src="/images/7me.png"
                    alt="7ME Logo"
                    className="w-32 h-32 md:w-32 md:h-32"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-blue-800 text-center">O que é o 7ME?</h3>
                <div className="w-20 h-1 bg-blue-600 rounded mb-4"></div>
              </div>

              <p className="text-gray-700 text-center mb-6">
                O 7ME é um espaço para membros e amigos da Igreja Adventista do Sétimo Dia. Por meio de seu sistema online e aplicativo, você pode:
              </p>

              <ul className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✅</span>
                  <span className="text-gray-800">Atualizar seus dados cadastrais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✅</span>
                  <span className="text-gray-800">Solicitar transferências entre igrejas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✅</span>
                  <span className="text-gray-800">Acompanhar a situação financeira da igreja</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✅</span>
                  <span className="text-gray-800">Adorar a Deus por meio dos dízimos e ofertas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✅</span>
                  <span className="text-gray-800">Conferir recibos e extratos</span>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDizimo;