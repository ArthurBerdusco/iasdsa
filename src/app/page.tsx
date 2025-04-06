"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import CultosSection from "./components/ProgramacaoSection";
import AnunciosSection from "./components/AnunciosSection";
import PedidoOracao from "./components/PedidoOracao";
import DizimoSection from "./components/DizimoSection";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ImagensSemana from "./components/ImagensSemanaSection";
import RedesSociais from "./components/RedesSociais";
import MensagemPastoral from "./components/MensagemPastoral";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-950 ">
      <NavBar />



      {/* <PorDoSol /> */}

      <Element name="cultos">
        <HeroSection />
      </Element>

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