"use client";
import React, { useState, useEffect } from "react";
import Cultos from "./components/HeroSection";
import ProgramacaoCultos from "./components/ProgramacaoSection";
import AnunciosSection from "./components/AnunciosSection";
import PedidoOracao from "./components/PedidoOracao";
import DizimoSection from "./components/DizimoSection";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import FotosDaSemana from "./components/FotosDaSemana";
import RedesSociais from "./components/CultosSemana";
import MensagemPastoral from "./components/MensagemPastoral";
import { Element } from "react-scroll";
import { ComponenteConfig, UseComponentConfigReturn, ApiResponse } from "@/types/components";

// Hook personalizado para carregar configurações
const useComponentConfig = (): UseComponentConfigReturn => {
  const [config, setConfig] = useState<ComponenteConfig>({
    cultos: true,
    mensagem_pastoral: false,
    programacao_cultos: true,
    anuncios: true,
    pedido_oracao: true,
    fotos_semana: false,
    dizimo: true,
    redes_sociais: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/componentes-config');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data: ApiResponse<ComponenteConfig> = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.config) {
          setConfig(data.config);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('Erro ao carregar configurações:', errorMessage);
        setError(errorMessage);
        // Mantém as configurações padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-blue-950 flex items-center justify-center">
    <div className="text-white text-xl flex items-center space-x-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span>Carregando...</span>
    </div>
  </div>
);

const Home: React.FC = () => {
  const { config, loading, error } = useComponentConfig();

  // Mostra um loader enquanto carrega as configurações
  if (loading) {
    return <LoadingSpinner />;
  }

  // Em caso de erro, mostra mensagem mas continua com configurações padrão
  if (error) {
    console.warn('Usando configurações padrão devido ao erro:', error);
  }

  return (
    <div className="min-h-screen bg-blue-950">
      <NavBar />
      
      {config.cultos && (
        <Element name="cultos">
          <Cultos />
        </Element>
      )}

      {config.mensagem_pastoral && (
        <Element name="mensagem">
          <MensagemPastoral />
        </Element>
      )}

      {config.programacao_cultos && (
        <Element name="programacao">
          <ProgramacaoCultos />
        </Element>
      )}

      {config.anuncios && (
        <Element name="anuncios">
          <AnunciosSection />
        </Element>
      )}

      {config.pedido_oracao && (
        <Element name="oracao">
          <PedidoOracao />
        </Element>
      )}

      {config.fotos_semana && (
        <Element name="fotos">
          <FotosDaSemana />
        </Element>
      )}

      {config.dizimo && (
        <Element name="dizimo">
          <DizimoSection />
        </Element>
      )}

      {config.redes_sociais && <RedesSociais />}

      <Footer />
    </div>
  );
};

export default Home;