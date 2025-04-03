"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import CultosSection from "./components/ProgramacaoSection";
import AnunciosSection from "./components/AnunciosSection";
import PedidoOracao from "./components/PedidoOracao";
import DizimoSection from "./components/DizimoSection";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import PorDoSol from "./components/PorDoSol";
import ImagensSemana from "./components/ImagensSemanaSection";
import RedesSociais from "./components/RedesSociais";
import MensagemPastoral from "./components/MensagemPastoral";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-600 text-gray-900">
      <NavBar />
      <PorDoSol />
      <HeroSection />
      
      <Element name="mensagem">
        <MensagemPastoral />
      </Element>
      
      <Element name="programacao">
        <CultosSection />
      </Element>
      
      <Element name="anuncios">
        <AnunciosSection />
      </Element>
      
      <Element name="oracao">
        <PedidoOracao />
      </Element>
      
      <Element name="dizimo">
        <DizimoSection />
      </Element>
      
      <ImagensSemana />
      <RedesSociais />
      <Footer />
    </div>
  );
}