"use client";
// components/HeroVideoInstitucional.tsx
// ─── Hero de vídeo institucional ────────────────────────────────────────────
// Fica logo abaixo da navbar, antes de qualquer outra seção. O vídeo é
// carregado do Vercel Blob (URL configurada no admin). Enquanto não houver
// vídeo cadastrado, mostra um pôster/gradiente elegante para nunca deixar
// a home "quebrada" — o cliente pode subir o vídeo a qualquer momento sem
// precisar de deploy.

import { useRef, useState } from "react";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import Container from "./ui/Container";

interface Props {
  videoUrl?: string;
  posterUrl?: string;
  titulo?: string;
  subtitulo?: string;
}

export default function HeroVideoInstitucional({
  videoUrl,
  posterUrl,
  titulo = "Igreja Adventista de Santo Amaro",
  subtitulo = "Uma família de fé, esperança e amor",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section className="relative flex h-[78vh] min-h-[420px] w-full items-center justify-center overflow-hidden pt-16 text-[var(--color-text-inverse)]">
      {/* Camada de vídeo ou fallback em gradiente */}
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: posterUrl
              ? `url(${posterUrl})`
              : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          }}
        />
      )}

      {/* Overlay para garantir contraste do texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <Container size="md" className="relative z-10 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
          Boletim Semanal
        </p>
        <h1 className="text-3xl font-extrabold leading-tight drop-shadow-sm sm:text-4xl md:text-5xl">
          {titulo}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">
          {subtitulo}
        </p>

        <div className="mt-8 flex justify-center">
          <ScrollLink
            to="cultos"
            smooth
            duration={500}
            offset={-70}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--border-radius)] bg-white px-6 py-3 text-sm font-bold text-[var(--color-primary)] shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Ver Boletim da Semana
            <ChevronDown size={16} />
          </ScrollLink>
        </div>
      </Container>

      {/* Controle de som — só faz sentido quando existe vídeo real */}
      {videoUrl && (
        <button
          onClick={toggleMute}
          aria-label={muted ? "Ativar som do vídeo" : "Silenciar vídeo"}
          className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </section>
  );
}
