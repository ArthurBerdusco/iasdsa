// app/loading.tsx  ← OPCIONAL
// Esse arquivo só é exibido se algum componente filho usar Suspense e demorar.
// Com a config resolvida no servidor, ele raramente aparece — mas é bom ter.
// Substitui o <LoadingSpinner> que estava no page.tsx.

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* NavBar placeholder */}
      <div className="h-16 w-full animate-pulse bg-[var(--color-surface,#f3f4f6)]" />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        {/* Skeleton cards — imita a estrutura real sem revelar conteúdo */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-2xl bg-[var(--color-surface,#f3f4f6)]"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </main>
    </div>
  );
}