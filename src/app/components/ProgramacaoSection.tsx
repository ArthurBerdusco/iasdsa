import React from 'react';
import { Sunrise } from 'lucide-react';
import { FaPrayingHands } from 'react-icons/fa';
import Image from 'next/image';

const ProgramacaoCultos = () => {
  const cultos = [
    {
      id: 1,
      titulo: 'Culto de Sábado',
      hora: '10h40',
      descricao: 'Culto de Adoração',
      icone: <Image alt='Logo Igreja Adventista' src={'/images/iasd-logo.png'} width={48} height={48} />,
      corBg: 'bg-white/10',
      corIcone: 'bg-blue-800/50',
      corGlow: 'rgba(241, 218, 218, 0.52)'
    },
    {
      id: 2,
      titulo: 'Culto de Domingo',
      hora: '10h00',
      descricao: 'Culto da Família',
      icone: <Sunrise size={48} className='text-sky-400' />,
      corBg: 'bg-white/10',
      corIcone: 'bg-blue-800/50',
      corGlow: 'rgba(56, 189, 248, 0.5)'
    },
    {
      id: 3,
      titulo: 'Culto de Quarta',
      hora: '20h00',
      descricao: 'Culto de Oração',
      icone: <FaPrayingHands size={48} className='text-amber-400' />,
      corBg: 'bg-white/10',  //from-blue-900 to-blue-950
      corIcone: 'bg-blue-800/50',
      corGlow: 'rgba(251, 191, 36, 0.5)'
    },
  ];

  return (
    <div className="bg-blue-950 text-white px-4">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header com ícone */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center relative pb-4">
            PROGRAMAÇÃO DOS CULTOS
            <span className="absolute bottom-0 left-0 right-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full"></span>
          </h2>
        </div>

        {/* Grid responsivo para os cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cultos.map((culto) => (
            <div
              key={culto.id}
              className={`bg-gradient-to-br ${culto.corBg} backdrop-blur-md rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-800/30 group`}
            >
              <div className="p-8 flex flex-col items-center h-full">
                {/* Ícone com efeito de glow */}
                <div className={`mb-6 p-4 rounded-full ${culto.corIcone} backdrop-blur-lg group-hover:scale-110 transition-all duration-300 relative`}>
                  {culto.icone}
                  <div className="absolute inset-0 rounded-full blur-xl opacity-60 -z-10" style={{background: `radial-gradient(circle, ${culto.corGlow}, transparent 70%)`}}></div>
                </div>
                
                {/* Conteúdo do card */}
                <h3 className="text-2xl font-bold text-sky-100 text-center mb-2">{culto.titulo}</h3>
                <p className="text-blue-200/80 text-center mb-6">{culto.descricao}</p>
                
                {/* Detalhes do culto em um estilo de tabela */}
                <div className="bg-blue-900/40 rounded-lg p-4 w-full backdrop-blur-md">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200/80 font-medium">Horário:</span>
                      <span className="font-semibold text-sky-100">{culto.hora}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramacaoCultos;