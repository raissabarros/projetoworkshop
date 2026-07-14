import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Lock } from "lucide-react"
import { useAdminAuth } from "../hooks/useAdminAuth"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c3.4-3.13 3.684-7.738 1.622-11.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const { isAdmin, loading, error, signInWithGoogle, clearError } = useAdminAuth()

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin/dashboard", { replace: true })
    }
  }, [loading, isAdmin, navigate])

  async function handleGoogleLogin() {
    clearError()
    await signInWithGoogle()
  }

  const checkingSession = loading && !error

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between flex-1 px-16 py-12"
        style={{ backgroundColor: "#B5222A" }}
      >
        <div>
          <p className="font-bold text-[#F7F3EC] uppercase tracking-widest text-xl" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.12em" }}>
            Galeria & Ateliê
          </p>
          <p className="text-[#F7F3EC] text-sm italic mt-1 opacity-80" style={{ fontFamily: "'Caveat', cursive" }}>
            arte que você pode levar ✦
          </p>
        </div>

        <div>
          <p className="text-[#F7F3EC] text-xs uppercase tracking-[0.25em] mb-4 opacity-70">
            Painel Administrativo
          </p>
          <h1
            className="font-bold text-[#F7F3EC] uppercase leading-none"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "5rem", lineHeight: 0.9, letterSpacing: "0.04em" }}
          >
            Gerencie<br />
            <span style={{ fontStyle: "italic" }}>sua</span><br />
            galeria
          </h1>
          <p className="text-[#F7F3EC] text-lg italic mt-6 opacity-80" style={{ fontFamily: "'Caveat', cursive" }}>
            cadastre obras, edite, pause e organize ✦
          </p>
        </div>

        <div className="flex items-end gap-4">
          {[
            { bg: "#EFE8DC", rot: -4, h: 80 },
            { bg: "#E8C7C9", rot: 2, h: 100 },
            { bg: "#EFE8DC", rot: -1, h: 70 },
          ].map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                backgroundColor: item.bg,
                padding: "6px 6px 24px",
                transform: `rotate(${item.rot}deg)`,
                boxShadow: "0 4px 16px rgba(35,31,28,0.25)",
                width: 72,
              }}
            >
              <div style={{ height: item.h, backgroundColor: "rgba(35,31,28,0.08)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:max-w-md xl:max-w-lg" style={{ backgroundColor: "#F7F3EC" }}>

        <div className="lg:hidden mb-10">
          <p className="font-bold text-[#231F1C] uppercase tracking-widest text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Galeria & Ateliê
          </p>
          <p className="text-[#B5222A] text-sm italic" style={{ fontFamily: "'Caveat', cursive" }}>painel administrativo</p>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "#B5222A" }}>
            <Lock size={20} color="#F7F3EC" />
          </div>

          <h2 className="font-bold text-[#231F1C] text-2xl sm:text-3xl leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Entrar no painel
          </h2>
          <p className="text-[#6E5B47] text-sm mb-8">
            Acesso exclusivo para administradores via Google.
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm"
              style={{ backgroundColor: "#FCE8E9", color: "#8F1A21", border: "1px solid rgba(181,34,42,0.2)" }}
              role="alert"
            >
              {error}
            </div>
          )}

          {checkingSession ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div
                className="w-8 h-8 rounded-full border-2 border-[#B5222A] border-t-transparent animate-spin"
                aria-hidden="true"
              />
              <p className="text-sm text-[#6E5B47]">Verificando sessão...</p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: "#FFFFFF",
                  color: "#231F1C",
                  border: "1.5px solid rgba(35,31,28,0.15)",
                  boxShadow: "0 1px 3px rgba(35,31,28,0.08)",
                }}
              >
                <GoogleIcon />
                {loading ? "Redirecionando..." : "Continuar com Google"}
              </button>

              <p className="text-[#6E5B47] text-xs mt-6 leading-relaxed">
                Use a conta <strong>raissabarros@alu.ufc.br</strong> cadastrada como admin.
                Outras contas Google não terão acesso ao painel.
              </p>
            </>
          )}

          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(35,31,28,0.1)" }}>
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-widest transition-colors"
              style={{ color: "#6E5B47" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#B5222A" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6E5B47" }}
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
