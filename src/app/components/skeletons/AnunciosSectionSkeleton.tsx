const s = 'bg-[var(--color-border)] rounded animate-pulse';

export function AnunciosSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* Header */}
      <div className={`${s} h-7 w-64 mx-auto mb-10`} />

      {/* Search */}
      <div className={`${s} h-12 w-full max-w-md mx-auto mb-12 rounded-full`} />

      {/* Mobile + Desktop simplificado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Destaques */}
        <div className="lg:col-span-4">
          <div className={`${s} h-5 w-40 mb-6`} />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-[var(--color-border)] rounded-[var(--border-radius)] p-4 bg-[var(--color-surface)]">
                <div className={`${s} h-4 w-3/4 mb-3`} />
                <div className={`${s} h-3 w-full mb-2`} />
                <div className={`${s} h-3 w-5/6`} />
              </div>
            ))}
          </div>
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <div className="w-px bg-[var(--color-border)]" />
        </div>

        {/* Lista / calendário */}
        <div className="lg:col-span-7">
          <div className={`${s} h-5 w-32 mb-6`} />

          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div key={groupIndex} className="mb-10">

              {/* Month divider */}
              <div className={`${s} h-4 w-40 mb-4`} />

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-[var(--color-border)] rounded-[var(--border-radius)] p-4 bg-[var(--color-surface)]"
                  >
                    <div className={`${s} h-4 w-3/4 mb-3`} />
                    <div className={`${s} h-3 w-full mb-2`} />
                    <div className={`${s} h-3 w-4/6`} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <div className={`${s} h-9 w-24 rounded-[var(--border-radius)]`} />
            <div className={`${s} h-9 w-24 rounded-[var(--border-radius)]`} />
          </div>
        </div>
      </div>
    </div>
  );
}