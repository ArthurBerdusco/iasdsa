'use client';

// app/components/CultosSkeleton.tsx
// Espelha o layout exato do CultoCard para evitar layout shift

export default function CultosSkeleton() {
  return (
    <section>
      {/* SectionHeader placeholder */}
      <div className="mb-6 h-5 w-40 animate-pulse rounded-full bg-[var(--color-border)]" />

      <div className="relative px-5 sm:px-6">
        <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-background-alt)] px-5 py-4">
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded-full bg-[var(--color-border)]" />
              <div className="h-5 w-48 animate-pulse rounded-full bg-[var(--color-border)]" />
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-28 animate-pulse rounded-full bg-[var(--color-border)]" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--color-border)]" />
            </div>
          </div>

          {/* Art image placeholder — mesmo aspect-video */}
          <div className="relative aspect-video w-full animate-pulse bg-[var(--color-border)]">
            {/* shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Footer orador */}
          <div className="flex items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-background-alt)] px-5 py-3">
            <div className="size-10 shrink-0 animate-pulse rounded-full bg-[var(--color-border)]" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-12 animate-pulse rounded-full bg-[var(--color-border)]" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--color-border)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots placeholder */}
      <div className="mt-4 flex justify-center gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 animate-pulse rounded-full bg-[var(--color-border)]"
            style={{ width: i === 1 ? '1.5rem' : '0.375rem', animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </section>
  );
}