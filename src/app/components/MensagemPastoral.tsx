'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { useEffect, useState } from 'react';
import { MensagemPastor } from '@/types/mensagemPastoral';
import { formatDateForDisplay } from '@/utils/formatoData';

const MensagemPastoral = () => {
  const [mensagem, setMensagem] = useState<MensagemPastor>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMensagemPastoral();
  }, []);

  const fetchMensagemPastoral = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mensagem-pastoral');
      if (!response.ok) throw new Error('Falha ao carregar mensagem pastoral');
      const data = await response.json();
      setMensagem(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !mensagem) {
    return (
      <section className="py-10 text-center text-sm text-[var(--color-text-muted)]">
        Carregando Mensagem Pastoral...
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader title="MENSAGEM PASTORAL" />

      {/* Container principal — layout em coluna no mobile, linha no desktop */}
      <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch">

          {/* ── Coluna da imagem ─────────────────────────────────────────
              Estratégia: next/image com width+height reais e object-contain
              dentro de um wrapper que limita a altura máxima.
              - Mobile: largura 100%, altura se adapta à proporção da imagem
              - Desktop: largura fixa 2/5, imagem centralizada e contida
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative flex w-full shrink-0 items-center justify-center bg-[var(--color-background-alt)] lg:w-2/5 lg:max-h-[560px]">

            {/* 
              Usamos `img` nativo com object-contain para garantir que a imagem
              nunca seja cortada e o wrapper encolha para o tamanho dela.
              max-h limita para não ficar gigante em telas grandes.
            */}
            <div className="relative w-full">
              <Image
                src={mensagem.foto}
                alt="Mensagem Pastoral"
                width={0}
                height={0}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full object-contain"
                style={{ maxHeight: '560px' }}
                priority
              />

              {/* Overlay lateral — visível apenas no desktop */}
              <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-[var(--color-surface)]/60 lg:block" />
            </div>

            {/* Badge "Reflexão Semanal" fixado no canto inferior esquerdo */}
            <div className="absolute bottom-0 left-0 p-4">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide shadow-lg"
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                Reflexão Semanal
              </span>
            </div>
          </div>

          {/* ── Divisor vertical (apenas desktop) ──────────────────────── */}
          <div
            className="hidden w-px shrink-0 self-stretch lg:block"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--color-accent), transparent)',
              opacity: 0.4,
            }}
          />

          {/* ── Coluna do conteúdo ──────────────────────────────────────── */}
          <div className="flex w-full flex-col p-6 lg:w-3/5 lg:p-8">

            {/* Título da mensagem */}
            <h3
              className="mb-6 text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--color-text)' }}
            >
              {mensagem.titulo}
            </h3>

            {/* Corpo da mensagem */}
            <div
              className="mb-8 flex-grow space-y-4 overflow-y-auto rounded-[var(--border-radius)] p-6"
              style={{
                background: 'var(--color-background-alt)',
                borderLeft: '4px solid var(--color-accent)',
                maxHeight: '340px',
              }}
            >
              {mensagem.mensagem.split('\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed"
                  style={{
                    color: 'var(--color-text)',
                    lineHeight: 'var(--line-height, 1.75)',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* ── Rodapé: pastor + botão ───────────────────────────────── */}
            <div
              className="mt-auto flex flex-wrap items-center justify-between gap-6 border-t pt-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Info do pastor */}
              <div className="flex items-center gap-4">
                <div
                  className="size-14 shrink-0 overflow-hidden rounded-full p-0.5 shadow-lg"
                  style={{ border: '2px solid var(--color-accent)' }}
                >
                  <div className="relative size-full overflow-hidden rounded-full">
                    <Image
                      src="/images/pastores/mauro-dias.jpg"
                      alt="Pastor Mauro Dias"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Pastor Mauro Dias
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDateForDisplay(
                      mensagem.data_publicacao ? mensagem.data_publicacao : '2025/05/05'
                    )}
                  </p>
                </div>
              </div>

              {/* Botão "Ler Mais" */}
              <Link
                href="https://sites.google.com/view/mensagempastoral/in%C3%ADcio"
                target="_blank"
                className="group inline-flex items-center gap-2 rounded-[var(--border-radius)] px-5 py-2.5 text-sm font-medium shadow-lg transition-all duration-300"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                <span>Ler Mais</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MensagemPastoral;