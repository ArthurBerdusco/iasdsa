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
      corBg: 'from-blue-100/40 to-yellow-200/40',
      corBorda: 'blue-500/30'
    },
    { 
      id: 2, 
      titulo: 'Culto de Domingo', 
      hora: '10h00', 
      descricao: 'Culto da Família',
      icone: <Sunrise size={48} className='text-blue-500' />,
      corBg: 'from-blue-100/40 to-blue-100/20',
      corBorda: 'white-500/30'
    },
    { 
      id: 3, 
      titulo: 'Culto de Quarta', 
      hora: '20h00', 
      descricao: 'Culto de Oração',
      icone: <FaPrayingHands size={48} className='text-yellow-500' />,
      corBg: 'from-blue-950/40 to-blue-100/30',
      corBorda: 'yellow-500/30'
    },
  ];

  return (
    <div className="bg-blue-950 text-white px-4">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header com ícone */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center relative">
            PROGRAMAÇÃO DOS CULTOS
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2 h-1 w-24 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full"></span>
          </h2>
        </div>

        {/* Grid responsivo para os cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cultos.map((culto) => (
            <div
              key={culto.id}
              className={`bg-gradient-to-br ${culto.corBg} backdrop-blur-md rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-${culto.corBorda} group`}
            >
              <div className="p-8 flex flex-col items-center h-full">
                {/* Ícone com efeito de glow */}
                <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-lg group-hover:scale-110 transition-all duration-300 relative">
                  {culto.icone}
                  <div className="absolute inset-0 rounded-full blur-xl opacity-60 -z-10" style={{background: `radial-gradient(circle, ${culto.corBorda}, transparent 70%)`}}></div>
                </div>
                
                {/* Conteúdo do card */}
                <h3 className="text-2xl font-bold text-white text-center mb-2">{culto.titulo}</h3>
                <p className="text-white/70 text-center mb-6">{culto.descricao}</p>
                
                {/* Detalhes do culto em um estilo de tabela */}
                <div className="bg-white/10 rounded-lg p-4 w-full backdrop-blur-md">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 font-medium">Horário:</span>
                      <span className="font-semibold text-white">{culto.hora}</span>
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