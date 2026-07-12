import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { ShoppingBag, X, Plus, Minus, ChevronRight, Sparkles, Package, Menu } from "lucide-react"
import { useArtworks, useStickers, type Artwork, type Sticker } from "../useArtworks"
import heroBg from "../../imports/abstract-6305508_1280.jpg"
import BordaRasgada3 from "../../imports/BordaRasgada-3/index"
import clip1 from "../../imports/image-1.png"
import clip2 from "../../imports/image-2.png"
import clip3 from "../../imports/image-3.png"
import clip4 from "../../imports/image-4.png"
import clip5 from "../../imports/image-5.png"
import clip6 from "../../imports/image-6.png"
import clip7 from "../../imports/image-7.png"
import clip8 from "../../imports/image-8.png"
import oilPaintGif from "../../imports/gif_close_na_pintura_dad_mona.gif"

// ─── Types ────────────────────────────────────────────────────────────────────

type CartItem = { id: number; title: string; price: number; quantity: number; image: string }

const CART_KEY = "ga_cart"
function loadCart(): CartItem[] {
  try { const r = localStorage.getItem(CART_KEY); return r ? JSON.parse(r) : [] } catch { return [] }
}
type Section = "galeria" | "loja"
type Breakpoint = "mobile" | "tablet" | "desktop"

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop")
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      setBp(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop")
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return bp
}

// ─── Constants ────────────────────────────────────────────────────────────────

const periodColors: Record<string, string> = {
  sage: "bg-[#6E7F5C] text-[#F7F3EC]",
  blush: "bg-[#C9878B] text-[#F7F3EC]",
  mustard: "bg-[#D9A441] text-[#231F1C]",
  coral: "bg-[#E07856] text-[#F7F3EC]",
}

const allPeriods = ["Todos", "Renascimento", "Pós-impressionismo", "Modernismo", "Surrealismo", "Simbolismo", "Barroco", "Barroco Flamengo"]

// ─── Decorative Atoms ─────────────────────────────────────────────────────────

// 8 clips em ordem: gold bull, pink bull, pink binder, purple round,
// champagne bull, yellow round, olive binder, mint bull
const CLIPS = [clip1, clip2, clip3, clip4, clip5, clip6, clip7, clip8]

// Rotações leves e alternadas para look "colocado à mão"
const CLIP_ROTATIONS = [-6, 5, -8, 7, -5, 8, -7, 6]

function Clip({ index = 0 }: { index?: number }) {
  const i = Math.abs(index) % CLIPS.length
  const src = CLIPS[i]
  const rotate = CLIP_ROTATIONS[i]
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 z-10 pointer-events-none"
      style={{
        width: 48,
        height: 48,
        top: -30,                                      // gripa a borda superior do card
        transform: `translateX(-50%) rotate(${rotate}deg)`,
      }}
    >
      <img
        src={src as string}
        alt=""
        draggable={false}
        className="w-full h-full object-contain select-none"
        style={{ mixBlendMode: "multiply" }}           // remove fundo branco
      />
    </div>
  )
}

function TornEdge({ fromRed }: { fromRed: boolean }) {
  return (
    <div aria-hidden="true" className="relative h-10 overflow-hidden" style={{ marginBottom: -1 }}>
      
    </div>
  )
}

// ─── Cards ────────────────────────────────────────────────────────────────────

// Rotações base por índice — fallback caso o campo venha zerado do localStorage
const CARD_ROTATIONS = [-2, 1.5, -1.5, 2.5, -1, 2, -2.5, 1]

function PaintingCard({ painting, onView, interactive }: {
  painting: Artwork; onView: (p: Artwork) => void; interactive: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const baseRot = painting.rotation || CARD_ROTATIONS[(painting.id - 1) % CARD_ROTATIONS.length]
  const rot = interactive ? baseRot : 0
  const transform = hovered
    ? "rotate(0deg) scale(1.05) translateY(-6px)"
    : `rotate(${rot}deg)`

  return (
    <div
      className="relative cursor-pointer"
      style={{
        transform,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        isolation: "isolate",
        willChange: "transform",
      }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={() => onView(painting)}
    >
      <Clip index={painting.id - 1} />
      <div
        className="bg-white"
        style={{
          padding: "10px 10px 40px 10px",
          boxShadow: hovered
            ? "0 20px 40px rgba(35,31,28,0.22), 0 4px 10px rgba(35,31,28,0.12)"
            : "0 4px 14px rgba(35,31,28,0.10), 0 1px 3px rgba(35,31,28,0.06)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${periodColors[painting.periodColor] ?? "bg-[#6E7F5C] text-[#F7F3EC]"}`}>
            {painting.period}
          </span>
        </div>
        <div className="bg-[#EFE8DC] overflow-hidden" style={{ width: 220, height: 270 }}>
          <img src={painting.image} alt={`${painting.title} — ${painting.artist}`} className="w-full h-full object-cover" />
        </div>
        <div className="pt-2 px-1">
          <p className="font-bold text-[#231F1C] text-sm leading-tight truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
            {painting.title}
          </p>
          <p className="text-[#6E5B47] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {painting.artist} · {painting.year}
          </p>
        </div>
      </div>
    </div>
  )
}


function StickerCard({ sticker, onAdd, interactive }: {
  sticker: Sticker; onAdd: (s: Sticker) => void; interactive: boolean
}) {
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const baseRot = sticker.rotation || CARD_ROTATIONS[(sticker.id - 101) % CARD_ROTATIONS.length]
  const rot = interactive ? baseRot : 0
  const transform = hovered
    ? "rotate(0deg) scale(1.05) translateY(-6px)"
    : `rotate(${rot}deg)`

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    onAdd(sticker)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{
        transform,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        isolation: "isolate",
        willChange: "transform",
      }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={() => navigate(`/loja/${sticker.id}`)}
    >
      <Clip index={sticker.id - 101 + 3} />
      <div className="bg-[#EFE8DC]" style={{ padding: "10px 10px 16px 10px", borderRadius: 8, boxShadow: hovered ? "0 20px 40px rgba(35,31,28,0.18), 0 4px 10px rgba(35,31,28,0.1)" : "0 4px 14px rgba(35,31,28,0.09)", transition: "box-shadow 0.3s ease" }}>
        {sticker.badge && (
          <div className="absolute top-4 right-4 z-10">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${sticker.badge === "NOVO" ? "bg-[#D9A441] text-[#231F1C]" : "bg-[#E07856] text-white"}`}>
              {sticker.badge}
            </span>
          </div>
        )}
        <div className="relative bg-white overflow-hidden" style={{ width: 220, height: 220, borderRadius: 4 }}>
          <img src={sticker.image} alt={sticker.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 inset-x-0 py-1 px-2 flex items-center justify-between" style={{ background: "rgba(239,232,220,0.88)" }}>
            <p className="text-[10px] uppercase tracking-widest text-[#6E5B47] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cartela de Adesivos</p>
            <span className="text-[9px] uppercase tracking-wider text-[#B5222A] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Detalhes →
            </span>
          </div>
        </div>
        <div className="mt-3 px-1">
          <p className="font-bold text-[#231F1C] text-sm leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{sticker.title}</p>
          <p className="text-[#6E5B47] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{sticker.description}</p>
          <p className="text-[#B5222A] text-xs italic mt-1.5 mb-3" style={{ fontFamily: "'Caveat', cursive" }}>{sticker.note}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#B5222A] font-bold text-base whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              R$ {sticker.price.toFixed(2).replace(".", ",")}
            </span>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center whitespace-nowrap font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-md transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: added ? "#6E7F5C" : "#B5222A", color: "#F7F3EC", flexShrink: 0 }}
            >
              {added ? "✓ Ok!" : "+ Carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ items, onClose, onUpdate, isMobile }: {
  items: CartItem[]; onClose: () => void; onUpdate: (id: number, delta: number) => void; isMobile: boolean
}) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(35,31,28,0.45)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-50 flex flex-col" style={{ width: isMobile ? "100%" : 360, background: "#F7F3EC", boxShadow: "-4px 0 24px rgba(35,31,28,0.15)", maxWidth: "100vw" }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(35,31,28,0.1)" }}>
          <div>
            <h3 className="font-bold text-lg text-[#231F1C]" style={{ fontFamily: "'Playfair Display', serif" }}>Meu Carrinho</h3>
            <p className="text-[#B5222A] text-xs italic mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>arte para levar junto ✦</p>
          </div>
          <button onClick={onClose} aria-label="Fechar carrinho" className="p-2 rounded-full transition-colors hover:bg-[#EFE8DC]">
            <X size={18} className="text-[#231F1C]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <Package size={40} className="mx-auto mb-3 text-[#C9A876]" />
              <p className="text-[#6E5B47] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Seu carrinho está vazio</p>
              <p className="text-[#B5222A] text-sm italic mt-1" style={{ fontFamily: "'Caveat', cursive" }}>adicione algumas cartelas!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="rounded overflow-hidden flex-shrink-0 bg-[#EFE8DC]" style={{ width: 60, height: 60 }}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#231F1C] leading-tight truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                  <p className="text-[#B5222A] text-sm font-bold mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>R$ {item.price.toFixed(2).replace(".", ",")}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => onUpdate(item.id, -1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-[#EFE8DC]" style={{ border: "1px solid rgba(35,31,28,0.15)" }}>
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-[#231F1C] w-5 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdate(item.id, 1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-[#EFE8DC]" style={{ border: "1px solid rgba(35,31,28,0.15)" }}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <span className="text-xs text-[#6E5B47] font-medium whitespace-nowrap">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="px-6 pb-8 pt-4" style={{ borderTop: "1px solid rgba(35,31,28,0.1)" }}>
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-[#6E5B47] text-sm">Total</span>
              <span className="text-[#B5222A] font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button className="w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#B5222A", color: "#F7F3EC" }}>
              Finalizar Pedido
            </button>
            <p className="text-center text-[#B5222A] text-xs italic mt-2" style={{ fontFamily: "'Caveat', cursive" }}>frete grátis acima de R$ 120,00</p>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Painting Modal ───────────────────────────────────────────────────────────

function PaintingModal({ painting, onClose }: { painting: Artwork; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(35,31,28,0.6)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div className="relative bg-[#F7F3EC] rounded-lg overflow-hidden w-full" style={{ maxWidth: 680, boxShadow: "0 20px 60px rgba(35,31,28,0.3)" }} onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} aria-label="Fechar" className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
            <X size={18} className="text-[#231F1C]" />
          </button>
          <div className="flex flex-col sm:flex-row">
            <div className="bg-[#231F1C] flex items-center justify-center p-8" style={{ minHeight: 260 }}>
              <div className="bg-white shadow-2xl" style={{ padding: "8px 8px 32px" }}>
                <img src={painting.image} alt={painting.title} className="object-cover block" style={{ width: 160, height: 200 }} />
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${periodColors[painting.periodColor] ?? "bg-[#6E7F5C] text-[#F7F3EC]"}`}>
                  {painting.period}
                </span>
                <h2 className="font-bold text-2xl text-[#231F1C] mt-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{painting.title}</h2>
                <p className="text-[#6E5B47] text-sm mt-1">{painting.artist}</p>
                <p className="text-[#B5222A] italic mt-3 leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: 15 }}>"{painting.quote}"</p>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(35,31,28,0.08)" }}>
                  <p className="text-xs text-[#6E5B47] uppercase tracking-wider mb-0.5">Ano de criação</p>
                  <p className="text-[#231F1C] font-semibold text-sm">{painting.year}</p>
                </div>
              </div>
              <p className="text-[#B5222A] text-xs italic mt-4" style={{ fontFamily: "'Caveat', cursive" }}>acervo público · domínio comum</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const bp = useBreakpoint()
  const isDesktop = bp === "desktop"
  const isMobile = bp === "mobile"
  const [searchParams] = useSearchParams()

  const { artworks } = useArtworks()
  const { stickers } = useStickers()

  const activeArtworks = artworks.filter((a) => a.status === "active")
  const activeStickers = stickers.filter((s) => s.status === "active")

  const [section, setSection] = useState<Section>(
    searchParams.get("section") === "loja" ? "loja" : "galeria"
  )
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [activePeriod, setActivePeriod] = useState("Todos")
  const [viewingPainting, setViewingPainting] = useState<Artwork | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  function addToCart(sticker: Sticker) {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === sticker.id)
      if (ex) return prev.map((i) => i.id === sticker.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: sticker.id, title: sticker.title, price: sticker.price, quantity: 1, image: sticker.image }]
    })
  }

  function updateCart(id: number, delta: number) {
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0))
  }

  const filteredPaintings = activePeriod === "Todos"
    ? activeArtworks
    : activeArtworks.filter((p) => p.period === activePeriod)

  const availablePeriods = ["Todos", ...Array.from(new Set(activeArtworks.map((a) => a.period)))]

  function goTo(s: Section) { setSection(s); setMobileMenuOpen(false) }

  return (
    <div className="min-h-screen bg-[#F7F3EC] overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#F7F3EC] flex items-center justify-between px-4 sm:px-8 md:px-16" style={{ height: 68, borderBottom: "1px solid rgba(35,31,28,0.08)" }}>
        <div>
          <p className="font-bold text-[#231F1C] uppercase tracking-widest text-base sm:text-lg leading-none" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.12em" }}>
            Galeria & Ateliê
          </p>
          <p className="text-[#B5222A] text-xs italic leading-none mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>arte que você pode levar</p>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {(["galeria", "loja"] as Section[]).map((s) => (
            <button key={s} onClick={() => goTo(s)} className="relative text-sm font-semibold uppercase tracking-widest transition-colors pb-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: section === s ? "#B5222A" : "#6E5B47" }}>
              {s === "galeria" ? "Galeria" : "Loja"}
              {section === s && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#B5222A]" />}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setCartOpen(true)} aria-label="Abrir carrinho" className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#EFE8DC]" style={{ color: "#B5222A" }}>
            <ShoppingBag size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block whitespace-nowrap">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: "#B5222A", color: "#F7F3EC" }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Menu" className="md:hidden p-2 rounded-lg hover:bg-[#EFE8DC]" style={{ color: "#231F1C" }}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[68px] z-20 bg-[#F7F3EC] px-4 py-4 flex flex-col gap-1" style={{ borderBottom: "1px solid rgba(35,31,28,0.1)" }}>
          {(["galeria", "loja"] as Section[]).map((s) => (
            <button key={s} onClick={() => goTo(s)} className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: section === s ? "#B5222A" : "transparent", color: section === s ? "#F7F3EC" : "#6E5B47" }}>
              {s === "galeria" ? "Galeria" : "Loja de Adesivos"}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section
        className="relative"
        style={{
          backgroundImage: `url(${heroBg as string})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        {/* overlay vermelho para manter legibilidade */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(181,34,42,0.82)" }} />
        <div className="px-4 sm:px-8 md:px-16 pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-20 relative z-10" style={{ position: "relative", zIndex: 1 }}>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            <div className="flex-1">
              <p className="text-[#F7F3EC] text-xs sm:text-sm uppercase tracking-[0.25em] mb-3 opacity-80">Curadoria Editorial · {new Date().getFullYear()}</p>
              <h2 className="font-bold text-[#F7F3EC] uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 7vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "0.04em" }}>
                Arte que<br /><span style={{ fontStyle: "italic" }}>vive além</span><br />das molduras
              </h2>
              <p className="mt-4 text-[#F7F3EC] opacity-85" style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(16px, 3vw, 22px)" }}>
                pinturas históricas · cartelas de adesivos · curadoria afetiva ✦
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <button onClick={() => goTo("galeria")} className="inline-flex items-center gap-2 whitespace-nowrap font-bold text-sm uppercase tracking-widest px-5 py-3 rounded-lg transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: section === "galeria" ? "#F7F3EC" : "rgba(247,243,236,0.15)", color: section === "galeria" ? "#B5222A" : "#F7F3EC", border: "2px solid #F7F3EC" }}>
                  Visitar Galeria <ChevronRight size={14} />
                </button>
                <button onClick={() => goTo("loja")} className="inline-flex items-center gap-2 whitespace-nowrap font-bold text-sm uppercase tracking-widest px-5 py-3 rounded-lg transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: section === "loja" ? "#F7F3EC" : "rgba(247,243,236,0.15)", color: section === "loja" ? "#B5222A" : "#F7F3EC", border: "2px solid #F7F3EC" }}>
                  <Sparkles size={14} /> Ver Adesivos
                </button>
              </div>
            </div>
            <div className="hidden lg:flex items-end gap-3 flex-shrink-0 pb-4">
              {activeArtworks.slice(0, 4).map((p, i) => (
                <div key={p.id} className="bg-white cursor-pointer transition-transform hover:scale-105 flex-shrink-0" style={{ padding: "6px 6px 26px", transform: `rotate(${[-4, 3, -2, 5][i]}deg) translateY(${[0, 20, -10, 30][i]}px)`, boxShadow: "0 6px 20px rgba(35,31,28,0.28)", width: 86 }} onClick={() => { goTo("galeria"); setViewingPainting(p) }}>
                  <img src={p.image} alt={p.title} className="w-full object-cover" style={{ height: 96 }} />
                  <p className="text-[8px] text-center mt-1.5 text-[#231F1C] truncate font-medium">{p.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Papel rasgado — último elemento, parte branca invade a galeria */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{ bottom: -20, height: 50, zIndex: 10, "--fill-0": "#F7F3EC" } as React.CSSProperties}
        >
          <BordaRasgada3 />
        </div>
      </section>

      {/* GALLERY */}
      {section === "galeria" && (
        <section className="p-[64px]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h2 className="font-bold text-[#231F1C] uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>Galeria</h2>
                <p className="text-[#B5222A] text-lg sm:text-xl italic" style={{ fontFamily: "'Caveat', cursive" }}>obras do acervo</p>
              </div>
              <p className="text-[#6E5B47] text-sm mt-2 max-w-lg">Uma seleção curada de obras-primas da pintura mundial. Toque para explorar.</p>
            </div>
            <div className="flex gap-2 mb-10 sm:mb-12 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" style={{ scrollbarWidth: "none" }}>
              {availablePeriods.map((period) => (
                <button key={period} onClick={() => setActivePeriod(period)} className="flex-shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: activePeriod === period ? "#231F1C" : "#EFE8DC", color: activePeriod === period ? "#F7F3EC" : "#6E5B47", border: activePeriod === period ? "none" : "1px solid rgba(35,31,28,0.12)" }}>
                  {period}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-14 gap-x-6 sm:gap-x-8 justify-items-center">
              {filteredPaintings.map((painting) => (
                <PaintingCard key={painting.id} painting={painting} onView={setViewingPainting} interactive={isDesktop} />
              ))}
            </div>
            {filteredPaintings.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#B5222A] text-2xl italic" style={{ fontFamily: "'Caveat', cursive" }}>nenhuma obra encontrada...</p>
                <button onClick={() => setActivePeriod("Todos")} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest border transition-colors" style={{ border: "1.5px solid #B5222A", color: "#B5222A" }}>
                  Ver todas as obras
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SHOP */}
      {section === "loja" && (
        <section className="px-4 sm:px-8 md:px-16 py-10 sm:py-14 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h2 className="font-bold text-[#231F1C] uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>Loja</h2>
                <p className="text-[#B5222A] text-lg sm:text-xl italic" style={{ fontFamily: "'Caveat', cursive" }}>cartelas de adesivos</p>
              </div>
              <p className="text-[#6E5B47] text-sm mt-2 max-w-lg">Leve as obras-primas com você — em vinil, em papel, em todo lugar.</p>
            </div>
            <div className="relative mb-10 sm:mb-12 flex">
              <div className="relative bg-white px-4 sm:px-6 py-4 rounded shadow-md max-w-xs sm:max-w-sm" style={{ transform: "rotate(-1.5deg)", boxShadow: "0 3px 12px rgba(35,31,28,0.1)" }}>
                <div aria-hidden="true" className="absolute left-1/2 z-10 pointer-events-none" style={{ width: 44, height: 44, top: -28, transform: "translateX(-50%) rotate(5deg)" }}>
                  <img src={clip5 as string} alt="" draggable={false} className="w-full h-full object-contain select-none" style={{ mixBlendMode: "multiply" }} />
                </div>
                <p className="text-[#231F1C] text-sm">✦ Impressão de alta qualidade · Vinil resistente à água</p>
                <p className="text-[#B5222A] text-xs italic mt-1" style={{ fontFamily: "'Caveat', cursive" }}>enviamos em até 3 dias úteis</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-6 sm:gap-x-8 justify-items-center">
              {activeStickers.map((sticker) => (
                <StickerCard key={sticker.id} sticker={sticker} onAdd={addToCart} interactive={isDesktop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO SECTION */}
      <section
        className="relative overflow-hidden mt-10 sm:mt-16"
        style={{ height: "clamp(320px, 55vw, 620px)" }}
      >
        <img
          src={oilPaintGif as unknown as string}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark ink overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(35,31,28,0.38) 0%, rgba(35,31,28,0.18) 50%, rgba(35,31,28,0.52) 100%)" }}
        />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-[0px]">
          <p
            className="text-[#F7F3EC] text-xs sm:text-sm uppercase tracking-[0.28em] mb-4 opacity-75"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            processo criativo
          </p>
          <h2
            className="font-bold text-[#F7F3EC] uppercase leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              letterSpacing: "0.04em",
              textShadow: "0 2px 24px rgba(35,31,28,0.5)",
            }}
          >
            Tinta sobre<br />
            <span style={{ fontStyle: "italic", color: "#F7C5A0" }}>tela viva</span>
          </h2>
          <p
            className="mt-4 text-[#F7F3EC] opacity-80 max-w-sm"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(16px, 2.5vw, 20px)" }}
          >
            cada adesivo carrega o gesto original do pintor ✦
          </p>
        </div>
      </section>

      {/* FEATURED BANNER */}
      <section style={{ backgroundColor: "#B5222A" }} className="p-[64px]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-8 sm:gap-10 text-center sm:text-left">
            <div className="flex-shrink-0">
              <div className="bg-white shadow-2xl mx-auto sm:mx-0" style={{ padding: "8px 8px 32px", transform: "rotate(-3deg)", boxShadow: "0 8px 32px rgba(35,31,28,0.3)", width: 160 }}>
                <img src={activeArtworks.find((a) => a.title === "O Beijo")?.image ?? activeArtworks[0]?.image ?? ""} alt="Destaque" className="object-cover w-full" style={{ height: 196 }} />
                <p className="text-center text-[10px] mt-2 text-[#231F1C] font-medium">O Beijo · Klimt</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#F7F3EC] text-xs uppercase tracking-[0.2em] opacity-80 mb-2">Destaque da coleção</p>
              <h3 className="font-bold text-[#F7F3EC] uppercase leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Cartela Ouro & <span style={{ fontStyle: "italic" }}>Amor</span></h3>
              <p className="text-[#F7F3EC] opacity-80 text-sm mt-3 max-w-md leading-relaxed mx-auto sm:mx-0">6 adesivos laminados com acabamento dourado inspirados em Klimt. Edição limitada de 200 unidades — colecionável.</p>
              <p className="text-[#F7F3EC] opacity-70 text-lg italic mt-2" style={{ fontFamily: "'Caveat', cursive" }}>"amor que brilha além do tempo" ✦</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-5">
                <span className="text-[#F7F3EC] font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>R$ 52,90</span>
                <button
                  onClick={() => { const s = activeStickers.find((s) => s.id === 105); if (s) { goTo("loja"); addToCart(s) } }}
                  className="inline-flex items-center justify-center whitespace-nowrap font-bold text-sm uppercase tracking-widest px-5 py-3 rounded-lg transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F7F3EC", color: "#B5222A" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#EFE8DC" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F7F3EC" }}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </section>
      <TornEdge fromRed />

      {/* NOTES */}
      <section className="px-4 sm:px-8 md:px-16 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { text: "Todas as obras são de domínio público — arte para todos.", rotate: -2, tape: "#C9A876" },
            { text: "Adesivos em vinil de alta qualidade, impressão UV resistente.", rotate: 1, tape: "#D9A441" },
            { text: "Cada cartela é embalada com papel kraft e lacre de cera.", rotate: -1.5, tape: "#E8C7C9" },
          ].map((note, i) => (
            <div key={i} className="flex justify-center">
              <div className="relative bg-[#EFE8DC] px-5 sm:px-6 py-5 rounded shadow-md w-full max-w-xs" style={{ transform: `rotate(${note.rotate}deg)`, boxShadow: "0 2px 12px rgba(35,31,28,0.08)" }}>
                <div aria-hidden="true" className="absolute left-1/2 z-10 pointer-events-none" style={{ width: 44, height: 44, top: -28, transform: `translateX(-50%) rotate(${CLIP_ROTATIONS[i + 2]}deg)` }}>
                  <img src={CLIPS[i + 2] as string} alt="" draggable={false} className="w-full h-full object-contain select-none" style={{ mixBlendMode: "multiply" }} />
                </div>
                <p className="text-[#231F1C] text-sm leading-relaxed">{note.text}</p>
                <p className="text-[#B5222A] text-xs italic mt-2" style={{ fontFamily: "'Caveat', cursive" }}>— curadoria Galeria & Ateliê</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-4 sm:px-8 md:px-16 py-10 sm:py-12" style={{ backgroundColor: "#231F1C" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            <div>
              <h4 className="font-bold text-[#F7F3EC] text-lg sm:text-xl uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Galeria & Ateliê</h4>
              <p className="text-[#B5222A] italic mt-1" style={{ fontFamily: "'Caveat', cursive" }}>arte que você pode levar ✦</p>
              <p className="text-[#6E5B47] text-xs mt-3 max-w-xs leading-relaxed">Uma galeria editorial de pinturas históricas e uma lojinha de cartelas de adesivos artísticos.</p>
            </div>
            <div className="flex gap-10 sm:gap-12">
              <div>
                <p className="text-[#C9A876] text-xs uppercase tracking-widest mb-3">Navegar</p>
                {["Galeria", "Loja", "Coleções", "Sobre"].map((item) => (
                  <p key={item} className="text-[#EFE8DC] text-sm mb-2 hover:text-[#B5222A] cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
              <div>
                <p className="text-[#C9A876] text-xs uppercase tracking-widest mb-3">Atendimento</p>
                {["Envios", "Trocas", "FAQ", "Contato"].map((item) => (
                  <p key={item} className="text-[#EFE8DC] text-sm mb-2 hover:text-[#B5222A] cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(247,243,236,0.08)" }}>
            <p className="text-[#6E5B47] text-xs">© {new Date().getFullYear()} Galeria & Ateliê. Obras em domínio público.</p>
            <p className="text-[#B5222A] text-xs italic" style={{ fontFamily: "'Caveat', cursive" }}>feito com amor e muito café</p>
            <a
              href="/admin"
              className="text-xs font-semibold uppercase tracking-widest transition-colors"
              style={{ color: "#6E5B47", fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#B5222A" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6E5B47" }}
            >
              Área Admin →
            </a>
          </div>
        </div>
      </footer>

      {cartOpen && <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onUpdate={updateCart} isMobile={isMobile} />}
      {viewingPainting && <PaintingModal painting={viewingPainting} onClose={() => setViewingPainting(null)} />}
    </div>
  )
}
