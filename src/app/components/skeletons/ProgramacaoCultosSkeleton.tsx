
export default function ProgramacaoCultosSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 animate-pulse">

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md"
          >
            <div className="flex flex-col items-center p-8">

              {/* Ícone */}
              <div className="mb-6 h-16 w-16 rounded-full bg-[var(--color-background-alt)]" />

              {/* Título */}
              <div className="mb-2 h-6 w-32 rounded bg-[var(--color-background-alt)]" />

              {/* Descrição */}
              <div className="mb-6 h-4 w-40 rounded bg-[var(--color-background-alt)]" />

              {/* Horário */}
              <div className="mt-auto w-full rounded-[calc(var(--border-radius)*0.75)] bg-[var(--color-background-alt)] p-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 rounded bg-[var(--color-surface)]" />
                  <div className="h-4 w-12 rounded bg-[var(--color-surface)]" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}