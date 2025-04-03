import React from 'react';
import { Church } from 'lucide-react';

const ProgramacaoCultos = () => {
  const cultos = [
    { id: 1, titulo: 'Sábado', data: '05/04/2025', hora: '10h40', icone: <Church size={40} className='text-yellow-500' /> },
    { id: 2, titulo: 'Domingo', data: '06/04/2025', hora: '10h00', icone: <Church size={40} className='text-blue-500' /> },
    { id: 3, titulo: 'Quarta-Feira', data: '09/04/2025', hora: '20h', icone: <Church size={40} className='text-purple-500' /> },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Programação dos Cultos</h2>

        {/* Grid responsivo para os cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultos.map((culto) => (
            <div
              key={culto.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6 flex flex-col items-center">
                <div className="mb-4">
                  {culto.icone}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{culto.titulo}</h3>
                <div className="flex items-center justify-center space-x-4 mt-2 text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="text-sm uppercase tracking-wide font-medium">Data</span>
                    <span className="font-medium">{culto.data}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm uppercase tracking-wide font-medium">Horário</span>
                    <span className="font-medium">{culto.hora}</span>
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