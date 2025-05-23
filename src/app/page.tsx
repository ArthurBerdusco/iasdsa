"use client";

import React from "react";
import Cultos from "./components/HeroSection";
import ProgramacaoCultos from "./components/ProgramacaoSection";
import AnunciosSection from "./components/AnunciosSection";
import PedidoOracao from "./components/PedidoOracao";
import DizimoSection from "./components/DizimoSection";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import FotosDaSemana from "./components/FotosDaSemana";
import RedesSociais from "./components/RedesSociais";
import MensagemPastoral from "./components/MensagemPastoral";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-950 ">
      <NavBar />

      <Element name="cultos">
        <Cultos />
      </Element>

      {/* <Element name="mensagem">
        <MensagemPastoral />
      </Element> */}

      <Element name="programacao">
        <ProgramacaoCultos />
      </Element>

      <Element name="anuncios">
        <AnunciosSection />
      </Element>

      <Element name="oracao">
        <PedidoOracao />
      </Element>
{/* 
      <Element name="fotos">
        <FotosDaSemana />
      </Element> */}

      <Element name="dizimo">
        <DizimoSection />
      </Element>

      <RedesSociais />

      <Footer />

        {/* <PorDoSol /> */}
    </div>
  );
}