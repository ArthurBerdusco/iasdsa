// components/MensagemPastoral.tsx
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { getMensagemPastoral } from '../lib/db/mensagemPastoral';
import { formatDateForDisplay } from '@/utils/formatoData';
import { MensagemPastor } from '@/types/mensagemPastoral';

type Props = {
  mensagem: MensagemPastor;
};


const MensagemPastoral = ({ mensagem }: Props) => {

  if (!mensagem) return null; // Suspense já cuidou do loading; aqui é só erro/vazio

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader title="MENSAGEM PASTORAL" />

      <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch">

          {/* Coluna da imagem */}
          <div className="relative flex w-full shrink-0 items-center justify-center bg-[var(--color-background-alt)] lg:w-2/5 lg:max-h-[560px]">
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

          {/* Coluna do conteúdo */}
          <div className="flex w-full flex-col p-6 lg:w-3/5 lg:p-8">
            <h3
              className="mb-6 text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--color-text)' }}
            >
              {mensagem.titulo}
            </h3>

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
                  style={{ color: 'var(--color-text)', lineHeight: 'var(--line-height, 1.75)' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              className="mt-auto flex flex-wrap items-center justify-between gap-6 border-t pt-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
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
                    {formatDateForDisplay(mensagem.data_publicacao ?? '2025/05/05')}
                  </p>
                </div>
              </div>

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