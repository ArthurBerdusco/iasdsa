"use client"
import { signIn } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<"email" | "password" | null>(null)
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil

  useEffect(() => {
    if (isLocked) {
      timerRef.current = setInterval(() => {
        const remaining = Math.ceil((lockedUntil! - Date.now()) / 1000)
        if (remaining <= 0) {
          setLockedUntil(null)
          setAttempts(0)
          setCountdown(0)
          setError("")
          clearInterval(timerRef.current!)
        } else {
          setCountdown(remaining)
        }
      }, 200)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isLocked, lockedUntil])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked || loading) return
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        triggerShake()
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
          setCountdown(LOCKOUT_SECONDS)
          setError(`Muitas tentativas. Aguarde ${LOCKOUT_SECONDS} segundos.`)
        } else {
          setError(`Credenciais inválidas. ${MAX_ATTEMPTS - newAttempts} tentativa(s) restante(s).`)
        }
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/admin"), 900)
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-body, 'Lato', sans-serif)", background: "#f5f3ee" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes shimmerMove {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%  { transform: translateX(-9px) rotate(-0.4deg); }
          30%  { transform: translateX(9px)  rotate(0.4deg); }
          45%  { transform: translateX(-6px); }
          60%  { transform: translateX(6px); }
          78%  { transform: translateX(-3px); }
          90%  { transform: translateX(3px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes panPhoto {
          0%   { transform: scale(1.08) translateX(0); }
          50%  { transform: scale(1.08) translateX(-1.5%); }
          100% { transform: scale(1.08) translateX(0); }
        }

        .field-input::placeholder { color: #9e9b94; }
        .field-input:-webkit-autofill,
        .field-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
          -webkit-text-fill-color: #1a1a1a;
        }
        .stagger-1 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.08s both; }
        .stagger-2 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.18s both; }
        .stagger-3 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.28s both; }
        .stagger-4 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.38s both; }
        .stagger-5 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.48s both; }
        .stagger-6 { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.1) 0.58s both; }

        .photo-panel { animation: fadeIn 1.2s ease both; }
        .church-photo { animation: panPhoto 18s ease-in-out infinite; }

        .btn-primary:not(:disabled):hover { background: #262263 !important; box-shadow: 0 6px 24px rgba(30,80,45,0.38) !important; }
        .btn-primary:not(:disabled):hover .shimmer-layer {
          animation: shimmerMove 0.75s ease forwards;
        }
        .google-btn:not(:disabled):hover { background: #f0ede7 !important; }
      `}</style>

      {/* ══════════════════════════════════════
          LEFT PANEL — Church photo + identity
      ══════════════════════════════════════ */}
      <div
        className="photo-panel hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col overflow-hidden"
        style={{ background: "#3b4873" }}
      >


        <img
          src="/images/santo-amaro.png"
          alt="Igreja Adventista do Sétimo Dia - Santo Amaro"
          className="church-photo absolute inset-0         
                         w-full h-full object-cover"
        />





        {/* Vignette + gradient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10, 17, 20, 0.97) 0%, rgba(10, 13, 20, 0.5) 45%, rgba(13, 106, 255, 0.15) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10, 12, 20, 0.7) 0%, transparent 25%)" }} />

        {/* ── Top: LOGO area ── */}
        <div className="relative z-10 p-8 pb-0">


          

          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(200,169,110,0.12)",
                border: "1.5px solid rgba(200,169,110,0.45)",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <rect x="13.5" y="2" width="5" height="28" rx="2.5" fill="#c8a96e" />
                <rect x="2" y="11.5" width="28" height="5" rx="2.5" fill="#c8a96e" />
              </svg>
            </div>
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "#c8a96e" }}
              >
                Igreja Adventista
              </p>
              <p
                className="text-[11px] tracking-wider"
                style={{ color: "rgba(200,169,110,0.55)" }}
              >
                do Sétimo Dia · Santo Amaro
              </p>
            </div>
          </div>
        </div>

        {/* ── Center: church photo placeholder card ── */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-10">

        </div>

        {/* ── Bottom: quote ── */}
        <div className="relative z-10 px-10 pb-10">
          <div
            className="w-8 h-[2px] mb-4 rounded-full"
            style={{ background: "linear-gradient(90deg, #c8a96e, transparent)" }}
          />
          <h2
            className="text-[2.4rem] font-bold leading-none mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#f0ebe0",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            IASD Santo Amaro
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xs italic"
            style={{ color: "rgba(240,235,224,0.5)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            "Porque sou o Senhor teu Deus, que te sustento pela minha destra justa."
          </p>
          <p
            className="text-xs mt-2 font-semibold tracking-wider"
            style={{ color: "rgba(200,169,110,0.55)" }}
          >
            — Isaías 41:13
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════ */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-10 relative overflow-hidden"
        style={{ background: "#faf9f6" }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.028]"
          style={{
            backgroundImage: "radial-gradient(circle, #3a4b6a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] lg:hidden"
          style={{ background: "linear-gradient(90deg, #1e0bd0, #c8a96e, #1e0bd0)" }}
        />

        <div
          className={[
            "relative w-full max-w-[400px]",
            shake ? "[animation:shake_0.55s_ease-in-out]" : "",
            success ? "opacity-0 scale-95 transition-all duration-700" : "",
          ].join(" ")}
        >

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 stagger-1">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#1e0bd0" }}
            >
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <rect x="13.5" y="2" width="5" height="28" rx="2.5" fill="white" />
                <rect x="2" y="11.5" width="28" height="5" rx="2.5" fill="white" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#1e0bd0", fontFamily: "'Lato', sans-serif" }}>
                Igreja Adventista do Sétimo Dia
              </p>
              <p className="text-xs" style={{ color: "#8a8070" }}>Santo Amaro</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 stagger-1">
            <h1
              className="text-[1.85rem] font-bold leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1a1a1a",
              }}
            >
              Área Administrativa
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "#8a8070", fontFamily: "'Lato', sans-serif" }}
            >
              Faça login para acessar o painel
            </p>
          </div>

          {/* Attempt bar */}
          {attempts > 0 && (
            <div className="mb-5 stagger-2">
              <div className="flex justify-between items-center mb-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: attempts >= 4 ? "#b94040" : "#8a8070", fontFamily: "'Lato', sans-serif" }}
                >
                  {isLocked ? "Acesso temporariamente bloqueado" : `Tentativas: ${attempts} de ${MAX_ATTEMPTS}`}
                </span>
                {isLocked && (
                  <span className="text-xs font-bold tabular-nums" style={{ color: "#b94040" }}>
                    {countdown}s
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e5e1d8" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(attempts / MAX_ATTEMPTS) * 100}%`,
                    background: attempts >= MAX_ATTEMPTS ? "#b94040" : attempts >= 3 ? "#d97a30" : "#c8a96e",
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm mb-5 stagger-2"
              style={{
                background: "#fff5f5",
                border: "2px solid #fca5a5",
                color: "#b91c1c",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              <svg className="mt-0.5 flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {isLocked
                ? `Conta bloqueada. Aguarde ${countdown} segundos.`
                : error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="stagger-3">
              <label
                className="block text-xs font-bold mb-2 tracking-widest uppercase"
                style={{
                  color: focused === "email" ? "#1e0bd0" : "#5c5850",
                  fontFamily: "'Lato', sans-serif",
                  transition: "color 0.15s",
                }}
              >
                E-mail
              </label>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: focused === "email" ? "#1e0bd0" : "#a09c94" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  disabled={isLocked}
                  required
                  placeholder="seu@email.com"
                  className="field-input w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isLocked ? "#f2f0eb" : "#ffffff",
                    border: focused === "email"
                      ? "2px solid #1e0bd0"
                      : "2px solid #c8c3ba",
                    color: "#1a1a1a",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "14px",
                    boxShadow: focused === "email"
                      ? "0 0 0 3px rgba(30,80,45,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="stagger-4">
              <label
                className="block text-xs font-bold mb-2 tracking-widest uppercase"
                style={{
                  color: focused === "password" ? "#1e0bd0" : "#5c5850",
                  fontFamily: "'Lato', sans-serif",
                  transition: "color 0.15s",
                }}
              >
                Senha
              </label>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: focused === "password" ? "#1e0bd0" : "#a09c94" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  disabled={isLocked}
                  required
                  placeholder="••••••••"
                  className="field-input w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isLocked ? "#f2f0eb" : "#ffffff",
                    border: focused === "password"
                      ? "2px solid #1e0bd0"
                      : "2px solid #c8c3ba",
                    color: "#1a1a1a",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "14px",
                    boxShadow: focused === "password"
                      ? "0 0 0 3px rgba(30,80,45,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-75 transition-opacity duration-150"
                  style={{ color: "#5c5850" }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1 stagger-5">
              <button
                type="submit"
                disabled={loading || isLocked}
                className="btn-primary relative w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase overflow-hidden transition-all duration-200 active:scale-[0.985] disabled:cursor-not-allowed"
                style={{
                  background: isLocked ? "#c8c3ba" : "#2a2176",
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  letterSpacing: "0.1em",
                  boxShadow: isLocked ? "none" : "0 4px 18px rgba(30,80,45,0.28)",
                }}
              >
                <span className="shimmer-layer absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)",
                  transform: "translateX(-100%) skewX(-15deg)",
                }} />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg style={{ animation: "spin 0.75s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Verificando...
                  </span>
                ) : isLocked ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Aguarde {countdown}s
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Entrar
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12,5 19,12 12,19" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 stagger-5">
            <div className="flex-1 h-px" style={{ background: "#ddd9d0" }} />
            <span className="text-xs font-medium" style={{ color: "#b8b4ac", fontFamily: "'Lato', sans-serif" }}>ou</span>
            <div className="flex-1 h-px" style={{ background: "#ddd9d0" }} />
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google")}
            disabled={isLocked}
            className="google-btn stagger-6 w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "#ffffff",
              border: "2px solid #c8c3ba",
              color: "#3c3a36",
              fontFamily: "'Lato', sans-serif",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>

          {/* Footer */}
          <p
            className="text-center text-xs mt-8 stagger-6"
            style={{ color: "#c0bbb4", fontFamily: "'Lato', sans-serif" }}
          >
            Igreja Adventista do Sétimo Dia · Santo Amaro
          </p>
        </div>
      </div>
    </div>
  )
}