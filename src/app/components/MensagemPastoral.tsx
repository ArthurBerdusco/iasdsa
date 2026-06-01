// components/MensagemPastoral.tsx
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { formatDateForDisplay } from '@/utils/formatoData';
import { MensagemPastor } from '@/types/mensagemPastoral';

type Props = {
  mensagem: MensagemPastor;
};

const MensagemPastoral = ({ mensagem }: Props) => {
  if (!mensagem) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader title="MENSAGEM PASTORAL" />

      <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch">

          {/* Coluna da imagem */}
          <div className="relative flex w-full shrink-0 items-center justify-center bg-[var(--color-background-alt)] lg:w-2/5 lg:max-h-[560px]">
            <div className="relative w-full">
              <Image
                unoptimized  
                src={mensagem.foto}
                alt="Mensagem Pastoral"
                width={0}
                height={0}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full object-contain"
                style={{ maxHeight: '560px' }}
                priority
              />
              <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-[var(--color-surface)]/60 lg:block" />
            </div>

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

          {/* Divisor vertical */}
          <div
            className="hidden w-px shrink-0 self-stretch lg:block"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-accent), transparent)',
              opacity: 0.4,
            }}
          />

          {/* Coluna do conteúdo — padding menor no mobile */}
          <div className="flex w-full flex-col p-4 sm:p-6 lg:w-3/5 lg:p-8">

            {/* Título — tamanho reduzido no mobile */}
            <h3
              className="mb-4 text-xl font-bold sm:text-2xl lg:text-3xl"
              style={{ color: 'var(--color-text)' }}
            >
              {mensagem.titulo}
            </h3>

            {/*
              Área de texto:
              - Mobile: sem altura máxima fixa, cresce livremente com o conteúdo
              - Desktop (lg+): altura máxima de 340px com scroll interno
              Isso evita a janelinha pequena no celular que força scroll curto
            */}
            <div
              className="mb-6 flex-grow space-y-4 rounded-[var(--border-radius)] p-4 sm:p-6 lg:overflow-y-auto"
              style={{
                background: 'var(--color-background-alt)',
                borderLeft: '4px solid var(--color-accent)',
              }}
            >
              {/* maxHeight só entra no desktop via style condicional ou classe */}
              <style>{`
                @media (min-width: 1024px) {
                  .mensagem-texto { max-height: 340px; overflow-y: auto; }
                }
              `}</style>
              <div className="mensagem-texto space-y-4">
                {mensagem.mensagem.split('\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: 'var(--color-text)', lineHeight: '1.75' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-16 shrink-0 overflow-hidden rounded-full shadow-lg"
                  style={{ border: '2px solid var(--color-primary)' }}
                >
                  <div className="relative size-full overflow-hidden rounded-full">
                    <Image
                      unoptimized  
                      src="/images/pastores/mauro-dias.jpg"
                      alt="Pastor Mauro Dias"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold sm:text-base" style={{ color: 'var(--color-text)' }}>
                    Pastor Mauro Dias
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDateForDisplay(mensagem.data_publicacao ?? '2025/05/05')}
                  </p>
                </div>
              </div>

              <Link
                href="https://sites.google.com/view/mensagempastoral"
                target="_blank"
                className="group inline-flex items-center gap-2 rounded-[var(--border-radius)] px-5 py-2.5 text-sm font-medium shadow-lg transition-all duration-300"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                <span>Ler Mais</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MensagemPastoral;