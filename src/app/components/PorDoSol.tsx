'use client'

import { useState, useEffect } from 'react';
import { FaSun, FaClock, FaChurch, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';

const PorDoSol = () => {
  const [horarioPorDoSol, setHorarioPorDoSol] = useState('');
  const [proximoCulto, setProximoCulto] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Tabela de horários do pôr do sol para abril
    const horariosPorDoSolAbril = {
      1: '18:04:00',
      2: '18:03:00',
      3: '18:02:00',
      4: '18:01:00',
      5: '18:00:00',
      6: '17:59:00',
      7: '17:58:00',
      8: '17:57:00',
      9: '17:56:00',
      10: '17:55:00',
      11: '17:54:00',
      12: '17:54:00',
      13: '17:53:00',
      14: '17:52:00',
      15: '17:51:00',
      16: '17:50:00',
      17: '17:49:00',
      18: '17:48:00',
      19: '17:47:00',
      20: '17:47:00',
      21: '17:46:00',
      22: '17:45:00',
      23: '17:44:00',
      24: '17:44:00',
      25: '17:43:00',
      26: '17:42:00',
      27: '17:41:00',
      28: '17:41:00',
      29: '17:40:00',
      30: '17:39:00'
    };

    // Pegar a data atual
    const today = new Date();

    // Formatar a data para exibição
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("pt-BR", options));

    // Obter o dia do mês
    const dia = today.getDate();

    // Obter o horário do pôr do sol para o dia atual
    if (today.getMonth() === 3) { // 3 representa abril (os meses começam em 0)
      const horarioCompleto = horariosPorDoSolAbril[dia as keyof typeof horariosPorDoSolAbril] || '18:00:00';
      // Simplificar o formato para apenas horas e minutos
      const horarioSimplificado = horarioCompleto.substring(0, 5);
      setHorarioPorDoSol(horarioSimplificado);
    } else {
      // Se não for abril, usar um valor padrão ou buscar de outra tabela
      setHorarioPorDoSol('18:00');
    }

    // Calcular o próximo sábado
    const diaSemanaHoje = today.getDay(); // 0 é domingo, 6 é sábado
    const diasAteSabado = diaSemanaHoje === 6 ? 7 : 6 - diaSemanaHoje;
    const proximoSabado = new Date(today);
    proximoSabado.setDate(today.getDate() + diasAteSabado);

    // Formatação para o próximo culto
    const diaSabado = proximoSabado.getDate();
    const mesSabado = proximoSabado.toLocaleString('pt-BR', { month: 'long' });
    setProximoCulto(`Sábado - ${diaSabado}/${mesSabado.charAt(0).toUpperCase() + mesSabado.slice(1)}`);

  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const sunriseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse' as const
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.1
      }
    }
  };

  return (

    <div className='bg-blue-950'>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto py-8 px-4"
      >
        {/* Header */}
        <motion.div
          variants={headerVariants}
          className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-blue-500 pb-4"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Boletim Informativo</h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm md:text-base font-medium text-white"
          >
            <p>{currentDate}</p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Próximo Culto Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-xl shadow-lg"
          >
            <motion.div whileHover={{ rotate: 15 }}>
              <FaCalendarAlt className="w-12 h-12 text-slate-600 mb-2" />
            </motion.div>
            <p className="text-lg font-medium text-white">Próximo Culto</p>
            <p className="text-3xl font-bold mt-2 text-yellow-300">{proximoCulto}</p>
            <div className="flex items-center gap-2 mt-2 text-white">
              <FaClock className="w-4 h-4" />
              <span>9:30 - Escola Sabatina</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-white">
              <FaClock className="w-4 h-4" />
              <span>10:40 - Culto de Adoração</span>
            </div>
          </motion.div>

          {/* Pôr do Sol Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-xl shadow-lg relative overflow-hidden"
          >
            <motion.div
              variants={sunriseVariants}
              animate="pulse"
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-yellow-500 opacity-30"
            />
            <motion.div whileHover={{ rotate: 15 }}>
              <FaSun className="w-12 h-12 text-yellow-400 mb-2" />
            </motion.div>
            <p className="text-lg font-medium text-white">Pôr do Sol Hoje</p>
            <p className="text-3xl font-bold mt-2 text-yellow-300">{horarioPorDoSol}</p>
          </motion.div>

          {/* Informações Adicionais Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-xl shadow-lg"
          >
            <motion.div whileHover={{ rotate: 15 }}>
              <MapPinned className="w-12 h-12 text-yellow-100 mb-2" />
            </motion.div>
            <p className="text-lg font-medium text-white">Nosso Endereço</p>
            <div className="flex items-center gap-2 mt-3 text-center">

              <p className="font-medium italic text-yellow-200">Rua Comendador Elias Zarzur, 86 - Santo Amaro</p>
            </div>

          </motion.div>
        </div>


      </motion.div>
    </div>


  );
};

export default PorDoSol;