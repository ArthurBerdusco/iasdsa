// components/skeletons/MensagemPastoralSkeleton.tsx
const s = 'bg-[var(--color-border)] rounded animate-pulse';

export function MensagemPastoralSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* SectionHeader placeholder */}
      <div className={`${s} h-7 w-56 mb-8`} />

      <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch">

          {/* Coluna da imagem */}
          <div className={`${s} w-full lg:w-2/5 min-h-[280px] lg:min-h-[420px] rounded-none`} />

          {/* Coluna do conteúdo */}
          <div className="flex w-full flex-col gap-4 p-6 lg:w-3/5 lg:p-8">
            {/* Título */}
            <div className={`${s} h-8 w-3/4`} />

            {/* Corpo — 5 linhas de texto */}
            <div className="flex flex-col gap-3 mt-2">
              <div className={`${s} h-4 w-full`} />
              <div className={`${s} h-4 w-full`} />
              <div className={`${s} h-4 w-5/6`} />
              <div className={`${s} h-4 w-full`} />
              <div className={`${s} h-4 w-4/6`} />
            </div>

            {/* Rodapé: avatar + nome + botão */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                <div className={`${s} size-14 rounded-full`} />
                <div className="flex flex-col gap-2">
                  <div className={`${s} h-4 w-32`} />
                  <div className={`${s} h-3 w-24`} />
                </div>
              </div>
              <div className={`${s} h-9 w-24 rounded-[var(--border-radius)]`} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}