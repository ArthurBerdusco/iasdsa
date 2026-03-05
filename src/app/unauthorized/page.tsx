// app/unauthorized/page.tsx
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">🚫</p>
        <h1 className="text-2xl font-bold text-white mb-2">Acesso negado</h1>
        <p className="text-white/40 text-sm mb-8">
          Você não tem permissão para acessar esta página.
          Apenas administradores podem entrar aqui.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          ← Voltar
        </Link>
      </div>
    </div>
  )
}