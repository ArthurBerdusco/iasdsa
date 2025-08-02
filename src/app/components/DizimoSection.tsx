'use client'

import React, { useState, useEffect } from 'react';
import { ExternalLink, Heart, Church, Users, BookOpen } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import Footer from './Footer';

interface SocialCardProps {
  icon: React.ReactNode;          
  platform: string;
  handle: string;
  url: string;
  color: string;
}

const SocialCard: React.FC<SocialCardProps> = ({ icon, platform, handle, url, color }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group transform transition-all duration-300 hover:scale-105"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl border border-blue-100">
        <div className={`p-6 ${color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-blue-950 mb-2">
            {platform}
          </h3>
          <p className="text-blue-700 mb-4 text-sm">
            {handle}
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
            Seguir
            <ExternalLink className="ml-2 h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
};

const PaginaDizimosOfertas = () => {
  const [qrCodeCopied, setQrCodeCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const pixCode = "d83b1b17-d0cc-4c9a-ab4d-86c2f26acc43";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setQrCodeCopied(true);
      setTimeout(() => setQrCodeCopied(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar código:', err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Hero Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 to-transparent"></div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Dízimos e Ofertas
                </h1>
                <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Sua contribuição fortalece a missão da igreja.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative -mt-12 z-10">
          <div className="max-w-7xl mx-auto px-4">

            {/* Church Identity Section */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-blue-200">
              <div className="grid lg:grid-cols-2 gap-0 lg:min-h-[600px]">

                {/* Church Photo Side */}
                <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                        <Church className="h-6 w-6 text-blue-950" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-950 mb-2">
                        IASD Santo Amaro
                      </h2>
                      <p className="text-blue-700 text-base">
                        Vivendo a esperança, compartilhando o evangelho.
                      </p>
                    </div>

                    {/* Church Photo */}
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 w-full mx-auto shadow-inner">
                      <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-blue-200/50 rounded-xl">

                        <img
                          src="/images/santo-amaro.png"
                          alt="Igreja Adventista do Sétimo Dia Santo Amaro"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        
                      </div>
                    </div>

                  </div>
                </div>

                {/* Information Side */}
                <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent"></div>
                  <div className="relative z-10 max-w-md mx-auto lg:mx-0">

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      Sua Contribuição <span className="text-amber-300">Importa</span>
                    </h3>

                    <p className="text-blue-100 text-base lg:text-lg mb-6 leading-relaxed">
                      Juntos, construímos uma igreja forte e uma comunidade unida no amor de Cristo.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center mr-3">
                          <Church className="h-3 w-3 text-amber-900" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Manutenção da Igreja</p>

                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center mr-3">
                          <Users className="h-3 w-3 text-amber-900" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Evangelização</p>

                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center mr-3">
                          <Heart className="h-3 w-3 text-amber-900" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Ação Social</p>

                        </div>
                      </div>
                    </div>

                    <a
                      href="https://giving.7me.app/guest-donation/church/d83b1b17-d0cc-4c9a-ab4d-86c2f26acc43?utm_source=boletim&utm_medium=link&utm_campaign=boletim"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center w-full bg-white text-blue-950 font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 text-base lg:text-lg mb-6"
                    >
                      <span>Contribuir Online</span>
                      <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <div className="pt-6 border-t border-blue-800/50">
                      <p className="text-blue-200 text-xs font-semibold mb-3">Baixe o aplicativo 7ME:</p>
                      <div className="flex gap-3 justify-center lg:justify-start">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.iatec.acms.me&pcampaignid=web_share"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:scale-110 hover:brightness-110"
                        >
                          <div className="bg-blue-950 border border-blue-800 rounded-md p-2 h-9 flex items-center">
                            <span className="text-white text-xs font-semibold px-2">Google Play</span>
                          </div>
                        </a>
                        <a
                          href="https://apps.apple.com/br/app/7me/id1344775660"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:scale-110 hover:brightness-110"
                        >
                          <div className="bg-blue-950 border border-blue-800 rounded-md p-2 h-9 flex items-center">
                            <span className="text-white text-xs font-semibold px-2">App Store</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mb-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
                  Conecte-se Conosco
                </h2>
                <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                  Acompanhe nossas atividades e faça parte da nossa comunidade digital
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <SocialCard
                  icon={<FaFacebook className="text-white text-3xl" />}
                  platform="Facebook"
                  handle="IASD Santo Amaro"
                  url="https://www.facebook.com/iasdsantoamarosp/?locale=pt_BR"
                  color="bg-gradient-to-br from-blue-600 to-blue-700"
                />
                <SocialCard
                  icon={<FaInstagram className="text-white text-3xl" />}
                  platform="Instagram"
                  handle="@adventistas.santoamaro"
                  url="https://www.instagram.com/adventistas.santoamaro/"
                  color="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
                />
                <SocialCard
                  icon={<FaYoutube className="text-white text-3xl" />}
                  platform="YouTube"
                  handle="Adventistas Santo Amaro"
                  url="https://www.youtube.com/@AdventistasSantoAmaro"
                  color="bg-gradient-to-br from-red-600 to-red-700"
                />
              </div>
            </div>

            {/* Boletim Link */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Mais Informações no Boletim
                </h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Acesse nosso boletim digital para ficar por dentro de todas as atividades, estudos e eventos da igreja.
                </p>
                <Link href={'/'} className="inline-flex items-center justify-center bg-white text-blue-950 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg">
                  <span>Acessar Boletim</span>
                  <BookOpen className="h-5 w-5 ml-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default PaginaDizimosOfertas;