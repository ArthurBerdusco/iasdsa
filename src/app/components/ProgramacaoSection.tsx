// components/ProgramacaoSection.tsx
import React from "react";
import { Sunrise } from "lucide-react";
import { FaPrayingHands } from "react-icons/fa";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

// Cada culto tem apenas dados e um ícone — sem cor hardcoded
const cultos = [
  {
    id: 1,
    titulo: "Sábado",
    hora: "10h40",
    descricao: "Culto de Adoração",
    icone: (
      <Image
        alt="Logo Igreja Adventista"
        src="/images/iasd-logo.png"
        width={48}
        height={48}
      />
    ),
  },
  {
    id: 2,
    titulo: "Domingo",
    hora: "10h00",
    descricao: "Culto Evangelístico",
    icone: (
      <Sunrise
        size={48}
        // CSS var via style — o único caso aceitável para ícones SVG
        style={{ color: "var(--color-accent)" }}
      />
    ),
  },
  {
    id: 3,
    titulo: "Quarta",
    hora: "20h00",
    descricao: "Culto de Oração",
    icone: (
      <FaPrayingHands
        size={48}
        style={{ color: "var(--color-secondary)" }}
      />
    ),
  },
];

export default function ProgramacaoCultos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader title="PROGRAMAÇÃO DOS CULTOS" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cultos.map((culto) => (
          <div
            key={culto.id}
            className="group overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-full flex-col items-center p-8">

              {/* Ícone */}
              <div className="relative mb-6 rounded-full bg-[var(--color-background-alt)] p-4 transition-transform duration-300 group-hover:scale-110">
                {culto.icone}
                {/* Glow usa a cor primária do tema */}
                <div
                  className="absolute inset-0 -z-10 rounded-full blur-xl opacity-40"
                  style={{
                    background: "radial-gradient(circle, var(--color-primary), transparent 70%)",
                  }}
                />
              </div>

              {/* Título e descrição */}
              <h3
                className="mb-2 text-center text-2xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {culto.titulo}
              </h3>
              <p
                className="mb-6 text-center text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {culto.descricao}
              </p>

              {/* Horário */}
              <div
                className="mt-auto w-full rounded-[calc(var(--border-radius)*0.75)] p-4"
                style={{ backgroundColor: "var(--color-background-alt)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Horário:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {culto.hora}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}