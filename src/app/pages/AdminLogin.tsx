import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff, Lock } from "lucide-react"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem("ga_admin", "1")
      navigate("/admin/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between flex-1 px-16 py-12"
        style={{ backgroundColor: "#B5222A" }}
      >
        {/* Logo */}
        <div>
          <p className="font-bold text-[#F7F3EC] uppercase tracking-widest text-xl" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.12em" }}>
            Galeria & Ateliê
          </p>
          <p className="text-[#F7F3EC] text-sm italic mt-1 opacity-80" style={{ fontFamily: "'Caveat', cursive" }}>
            arte que você pode levar ✦
          </p>
        </div>

        {/* Big headline */}
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

        {/* Decorative polaroids */}
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

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:max-w-md xl:max-w-lg" style={{ backgroundColor: "#F7F3EC" }}>

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <p className="font-bold text-[#231F1C] uppercase tracking-widest text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Galeria & Ateliê
          </p>
          <p className="text-[#B5222A] text-sm italic" style={{ fontFamily: "'Caveat', cursive" }}>painel administrativo</p>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "#B5222A" }}>
            <Lock size={20} color="#F7F3EC" />
          </div>

          <h2 className="font-bold text-[#231F1C] text-2xl sm:text-3xl leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Entrar no painel
          </h2>
          <p className="text-[#6E5B47] text-sm mb-8">
            Acesse para gerenciar obras e adesivos da galeria.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#231F1C] mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@galeria.com"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  backgroundColor: "#EFE8DC",
                  border: "1.5px solid rgba(35,31,28,0.12)",
                  color: "#231F1C",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "#B5222A" }}
                onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(35,31,28,0.12)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#231F1C] mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#EFE8DC",
                    border: "1.5px solid rgba(35,31,28,0.12)",
                    color: "#231F1C",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "#B5222A" }}
                  onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(35,31,28,0.12)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-[#EFE8DC]"
                  style={{ color: "#6E5B47" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Hint */}
            <p className="text-[#B5222A] text-xs italic" style={{ fontFamily: "'Caveat', cursive" }}>
              ✦ clique em entrar para acessar o painel
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: loading ? "#C9878B" : "#B5222A",
                color: "#F7F3EC",
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#8F1A21" }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#B5222A" }}
            >
              {loading ? "Entrando..." : "Entrar no Painel"}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(35,31,28,0.1)" }}>
            <a
              href="/"
              className="text-xs font-semibold uppercase tracking-widest transition-colors"
              style={{ color: "#6E5B47" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#B5222A" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6E5B47" }}
            >
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
