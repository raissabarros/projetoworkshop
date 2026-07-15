import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn, ShoppingBag, Plus, Minus } from "lucide-react"
import { useStickers, type Sticker } from "../useArtworks"

// ─── Cart persistence (shared with Home via localStorage) ─────────────────────

const CART_KEY = "ga_cart"

type CartItem = { id: number; title: string; price: number; quantity: number; image: string }

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

// ─── Zoom Modal ───────────────────────────────────────────────────────────────

function ZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(23,18,16,0.94)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-[92vw] max-h-[90vh] object-contain select-none"
        style={{ boxShadow: "0 12px 60px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        aria-label="Fechar zoom"
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "rgba(247,243,236,0.12)", border: "1px solid rgba(247,243,236,0.2)" }}
      >
        <X size={18} className="text-[#F7F3EC]" />
      </button>
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-50 tracking-wider uppercase"
        style={{ color: "#F7F3EC", fontFamily: "'DM Sans', sans-serif" }}
      >
        Clique ou Esc para fechar
      </p>
    </div>
  )
}

// ─── Photo Gallery ─────────────────────────────────────────────────────────────

function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(() => setActive((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setActive((i) => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prev, next])

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main photo */}
        <div
          className="relative overflow-hidden bg-[#231F1C] group"
          style={{ borderRadius: 2 }}
        >
          <img
            src={photos[active]}
            alt={`${title} — foto ${active + 1} de ${photos.length}`}
            className="w-full object-cover cursor-zoom-in transition-transform duration-500"
            style={{ maxHeight: 480, minHeight: 280 }}
            onClick={() => setZoomed(true)}
          />

          {/* Zoom hint */}
          <button
            onClick={() => setZoomed(true)}
            aria-label="Ampliar foto"
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(35,31,28,0.6)", border: "1px solid rgba(247,243,236,0.25)" }}
          >
            <ZoomIn size={15} className="text-[#F7F3EC]" />
          </button>

          {/* Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(35,31,28,0.55)", border: "1px solid rgba(247,243,236,0.2)" }}
              >
                <ChevronLeft size={18} className="text-[#F7F3EC]" />
              </button>
              <button
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(35,31,28,0.55)", border: "1px solid rgba(247,243,236,0.2)" }}
              >
                <ChevronRight size={18} className="text-[#F7F3EC]" />
              </button>
            </>
          )}

          {/* Photo counter pill */}
          {photos.length > 1 && (
            <div
              className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(35,31,28,0.6)", color: "#F7F3EC", fontFamily: "'DM Sans', sans-serif" }}
            >
              {active + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                className="flex-shrink-0 overflow-hidden transition-all"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  outline: i === active ? "2.5px solid #B5222A" : "2px solid transparent",
                  outlineOffset: 2,
                  opacity: i === active ? 1 : 0.52,
                  transform: i === active ? "scale(1)" : "scale(0.97)",
                }}
              >
                <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoomed && (
        <ZoomModal
          src={photos[active]}
          alt={`${title} — ampliado`}
          onClose={() => setZoomed(false)}
        />
      )}
    </>
  )
}


// ─── Product Detail Page ───────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { stickers, loading } = useStickers()

  const stickerId = Number(id)
  const sticker = stickers.find((s) => s.id === stickerId)

  const photos = sticker?.gallery.length ? sticker.gallery : []

  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => { saveCart(cart) }, [cart])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  function handleAddToCart() {
    if (!sticker) return
    setCart((prev) => {
      const ex = prev.find((i) => i.id === sticker.id)
      if (ex) return prev.map((i) => i.id === sticker.id ? { ...i, quantity: i.quantity + qty } : i)
      return [...prev, { id: sticker.id, title: sticker.title, price: sticker.price, quantity: qty, image: sticker.image }]
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col items-center justify-center gap-3 px-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#B5222A] border-t-transparent animate-spin" aria-hidden="true" />
        <p className="text-sm text-[#6E5B47]">Carregando produto...</p>
      </div>
    )
  }

  // 404-ish: sticker not found
  if (!sticker) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#B5222A] text-2xl italic" style={{ fontFamily: "'Caveat', cursive" }}>
          produto não encontrado...
        </p>
        <button
          onClick={() => navigate("/?section=loja")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
          style={{ backgroundColor: "#B5222A", color: "#F7F3EC", fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={14} /> Voltar à Loja
        </button>
      </div>
    )
  }

  // Derive spec values from sticker description field + sensible defaults
  const specQty = sticker.description.match(/(\d+) adesivos/)?.[1]
  const specFinish = sticker.description.toLowerCase().includes("brilho") ? "Brilhoso" :
                     sticker.description.toLowerCase().includes("holográfico") ? "Holográfico" :
                     sticker.description.toLowerCase().includes("doura") ? "Dourado laminado" : "Fosco"

  return (
    <div className="min-h-screen bg-[#F7F3EC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 bg-[#F7F3EC] flex items-center justify-between px-4 sm:px-8 md:px-16"
        style={{ height: 68, borderBottom: "1px solid rgba(35,31,28,0.08)" }}
      >
        <Link to="/" className="flex flex-col leading-none group">
          <span
            className="font-bold text-[#231F1C] uppercase tracking-widest text-base leading-none transition-colors group-hover:text-[#B5222A]"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.12em" }}
          >
            Galeria & Ateliê
          </span>
          <span
            className="text-[#B5222A] text-xs italic leading-none mt-0.5"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            arte que você pode levar
          </span>
        </Link>

        <button
          onClick={() => navigate("/?section=loja")}
          aria-label={`Carrinho (${cartCount} itens)`}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#EFE8DC]"
          style={{ color: "#B5222A" }}
        >
          <ShoppingBag size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block whitespace-nowrap">
            Carrinho
          </span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "#B5222A", color: "#F7F3EC" }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div
        className="px-4 sm:px-8 md:px-16 py-3"
        style={{ borderBottom: "1px solid rgba(35,31,28,0.06)" }}
      >
        <nav aria-label="Navegação" className="flex items-center gap-1.5 text-xs" style={{ color: "#6E5B47" }}>
          <Link
            to="/"
            className="hover:text-[#B5222A] transition-colors font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Início
          </Link>
          <ChevronRight size={12} className="opacity-40 flex-shrink-0" />
          <Link
            to="/?section=loja"
            className="hover:text-[#B5222A] transition-colors font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Loja
          </Link>
          <ChevronRight size={12} className="opacity-40 flex-shrink-0" />
          <span className="text-[#231F1C] font-semibold truncate max-w-[200px] sm:max-w-none">
            {sticker.title}
          </span>
        </nav>
      </div>

      {/* ── Back button ────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 md:px-16 pt-5 pb-1">
        <button
          onClick={() => navigate("/?section=loja")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#B5222A]"
          style={{ color: "#6E5B47", fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={15} />
          Voltar à Loja
        </button>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="px-4 sm:px-8 md:px-16 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">

          {/* ── Title block — above gallery ─────────────────────────── */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {sticker.badge && (
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: sticker.badge === "NOVO" ? "#D9A441" : "#E07856",
                    color: sticker.badge === "NOVO" ? "#231F1C" : "#F7F3EC",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {sticker.badge}
                </span>
              )}
            </div>
            <h1
              className="font-bold text-[#231F1C] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
            >
              {sticker.title}
            </h1>
            <p className="text-[#6E5B47] text-sm mt-1 leading-relaxed">
              {sticker.description}
            </p>
            <p
              className="text-[#B5222A] italic mt-1"
              style={{ fontFamily: "'Caveat', cursive", fontSize: 17 }}
            >
              {sticker.note}
            </p>
          </div>

          {/* ── Two columns: gallery + specs ────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* Left: gallery */}
            <div className="lg:w-[56%] flex-shrink-0">
              <PhotoGallery photos={photos} title={sticker.title} />
            </div>

            {/* Right: specs + price + CTA */}
            <div className="flex-1 flex flex-col justify-between">

              {/* Compact specs table */}
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(35,31,28,0.09)" }}
              >
                {([
                  specQty ? ["Quantidade", `${specQty} adesivos`] : null,
                  ["Material", "Vinil impresso"],
                  ["Acabamento", specFinish],
                  ["Resistência", "Impermeável · UV"],
                  ["Formato", "Folha A4"],
                  ["Envio", "3–5 dias úteis"],
                  ["Embalagem", "Kraft + lacre de cera"],
                ] as ([string, string] | null)[]).filter(Boolean).map(([label, value], i, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-3 py-2"
                    style={{
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(35,31,28,0.07)" : "none",
                      background: i % 2 === 0 ? "transparent" : "rgba(35,31,28,0.025)",
                    }}
                  >
                    <span
                      className="text-[11px] uppercase tracking-wide"
                      style={{ color: "#6E5B47", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#231F1C", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2">
                <span
                  className="font-bold text-[#B5222A]"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", lineHeight: 1 }}
                >
                  R$ {sticker.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-[#6E5B47] text-xs">/ cartela</span>
              </div>

              {/* Qty + CTA */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-[#6E5B47]">Qtd.</span>
                  <div
                    className="flex items-center rounded-lg overflow-hidden"
                    style={{ border: "1.5px solid rgba(35,31,28,0.15)" }}
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[#EFE8DC]"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={13} className="text-[#231F1C]" />
                    </button>
                    <span
                      className="w-10 text-center text-sm font-bold text-[#231F1C]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[#EFE8DC]"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={13} className="text-[#231F1C]" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: added ? "#6E7F5C" : "#B5222A",
                    color: "#F7F3EC",
                    transform: added ? "scale(0.99)" : "scale(1)",
                    boxShadow: added ? "none" : "0 4px 14px rgba(181,34,42,0.3)",
                  }}
                >
                  {added ? `✓ ${qty > 1 ? qty + "x " : ""}Adicionado!` : "Adicionar ao Carrinho"}
                </button>

                <p
                  className="text-center text-[#B5222A] text-xs italic"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  frete grátis acima de R$ 120,00
                </p>
              </div>

              {/* Trust badges */}
              <div
                className="mt-4 rounded-lg px-3 py-3 grid grid-cols-2 gap-2"
                style={{ background: "rgba(35,31,28,0.03)", border: "1px solid rgba(35,31,28,0.06)" }}
              >
                {[
                  { icon: "🛡️", text: "Vinil resistente à água" },
                  { icon: "✉️", text: "Envio em até 3 dias úteis" },
                  { icon: "🎨", text: "Impressão UV de qualidade" },
                  { icon: "📦", text: "Embalagem com lacre de cera" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-1.5">
                    <span className="text-sm leading-none mt-0.5">{icon}</span>
                    <span className="text-[10px] text-[#6E5B47] leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer note ─────────────────────────────────────────────── */}
      <div
        className="mt-6 px-4 sm:px-8 md:px-16 py-6"
        style={{ borderTop: "1px solid rgba(35,31,28,0.07)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[#B5222A] italic"
            style={{ fontFamily: "'Caveat', cursive", fontSize: 16 }}
          >
            "arte que você pode levar junto" ✦
          </p>
          <button
            onClick={() => navigate("/?section=loja")}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors hover:text-[#B5222A]"
            style={{ color: "#6E5B47", fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={14} /> Ver mais produtos
          </button>
        </div>
      </div>
    </div>
  )
}
