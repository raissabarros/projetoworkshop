import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Plus, Pencil, Trash2, PauseCircle, PlayCircle,
  X, LayoutGrid, ExternalLink, Search, ChevronDown,
  AlertTriangle, ImageOff,
} from "lucide-react"
import {
  useArtworks, PERIODS, getPeriodColor,
  type Artwork,
} from "../useArtworks"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const periodBadgeColors: Record<string, string> = {
  sage: "bg-[#6E7F5C] text-[#F7F3EC]",
  blush: "bg-[#C9878B] text-[#F7F3EC]",
  mustard: "bg-[#D9A441] text-[#231F1C]",
  coral: "bg-[#E07856] text-[#F7F3EC]",
}

type FormData = {
  title: string
  artist: string
  year: string
  period: string
  quote: string
  image: string
  rotation: number
}

const EMPTY_FORM: FormData = {
  title: "",
  artist: "",
  year: "",
  period: "Renascimento",
  quote: "",
  image: "",
  rotation: 0,
}

// ─── Form Drawer ─────────────────────────────────────────────────────────────

function ArtworkFormDrawer({ editing, onClose, onSave }: {
  editing: Artwork | null
  onClose: () => void
  onSave: (data: FormData) => void
}) {
  const isEdit = editing !== null
  const [form, setForm] = useState<FormData>(
    isEdit
      ? { title: editing.title, artist: editing.artist, year: editing.year, period: editing.period, quote: editing.quote, image: editing.image, rotation: editing.rotation }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [imgError, setImgError] = useState(false)

  function field(key: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.title.trim()) e.title = "Campo obrigatório"
    if (!form.artist.trim()) e.artist = "Campo obrigatório"
    if (!form.year.trim()) e.year = "Campo obrigatório"
    if (!form.image.trim()) e.image = "Campo obrigatório"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  const inputStyle = (hasErr: boolean) => ({
    backgroundColor: "#EFE8DC",
    border: `1.5px solid ${hasErr ? "#B5222A" : "rgba(35,31,28,0.12)"}`,
    color: "#231F1C",
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: 8,
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  })

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(35,31,28,0.4)" }} onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{ width: "min(520px, 100vw)", background: "#F7F3EC", boxShadow: "-6px 0 32px rgba(35,31,28,0.15)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(35,31,28,0.1)" }}>
          <div>
            <h3 className="font-bold text-lg text-[#231F1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isEdit ? "Editar Obra" : "Nova Obra"}
            </h3>
            <p className="text-[#B5222A] text-xs italic mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>
              {isEdit ? `editando "${editing.title}"` : "preencha os dados da obra ✦"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#EFE8DC] transition-colors">
            <X size={18} className="text-[#231F1C]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Image preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
              URL da Imagem <span className="text-[#B5222A]">*</span>
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => { field("image", e.target.value); setImgError(false) }}
              placeholder="https://..."
              style={inputStyle(!!errors.image)}
            />
            {errors.image && <p className="text-[#B5222A] text-xs mt-1">{errors.image}</p>}

            {/* Preview */}
            <div
              className="mt-3 flex items-center justify-center overflow-hidden rounded-md"
              style={{ height: 140, backgroundColor: "#EFE8DC", border: "1px dashed rgba(35,31,28,0.15)" }}
            >
              {form.image && !imgError ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-full w-full object-cover rounded-md"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#C9A876]">
                  <ImageOff size={24} />
                  <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {imgError ? "Imagem inválida" : "Prévia da imagem"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
              Título <span className="text-[#B5222A]">*</span>
            </label>
            <input type="text" value={form.title} onChange={(e) => field("title", e.target.value)} placeholder="Ex: A Noite Estrelada" style={inputStyle(!!errors.title)} />
            {errors.title && <p className="text-[#B5222A] text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Artist + Year in grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
                Artista <span className="text-[#B5222A]">*</span>
              </label>
              <input type="text" value={form.artist} onChange={(e) => field("artist", e.target.value)} placeholder="Ex: Van Gogh" style={inputStyle(!!errors.artist)} />
              {errors.artist && <p className="text-[#B5222A] text-xs mt-1">{errors.artist}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
                Ano <span className="text-[#B5222A]">*</span>
              </label>
              <input type="text" value={form.year} onChange={(e) => field("year", e.target.value)} placeholder="Ex: 1889" style={inputStyle(!!errors.year)} />
              {errors.year && <p className="text-[#B5222A] text-xs mt-1">{errors.year}</p>}
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
              Período / Movimento
            </label>
            <div className="relative">
              <select
                value={form.period}
                onChange={(e) => field("period", e.target.value)}
                className="appearance-none w-full pr-10"
                style={{ ...inputStyle(false), cursor: "pointer" }}
              >
                {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E5B47] pointer-events-none" />
            </div>
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
              Citação / Curadoria
            </label>
            <textarea
              value={form.quote}
              onChange={(e) => field("quote", e.target.value)}
              placeholder="Uma frase que define esta obra..."
              rows={3}
              style={{ ...inputStyle(false), resize: "vertical" }}
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#231F1C] mb-2">
              Rotação do cartão (−3 a +3)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={form.rotation}
                onChange={(e) => field("rotation", parseFloat(e.target.value))}
                className="flex-1"
                style={{ accentColor: "#B5222A" }}
              />
              <span className="text-sm font-bold text-[#231F1C] w-12 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {form.rotation > 0 ? `+${form.rotation}` : form.rotation}°
              </span>
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-5 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(35,31,28,0.1)" }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', sans-serif", border: "1.5px solid #B5222A", color: "#B5222A", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(181,34,42,0.06)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            className="flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#B5222A", color: "#F7F3EC" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8F1A21" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#B5222A" }}
          >
            {isEdit ? "Salvar Alterações" : "Cadastrar Obra"}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ title, onCancel, onConfirm }: {
  title: string; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(35,31,28,0.5)" }} onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-[#F7F3EC] rounded-xl p-6 w-full max-w-sm shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FEE2E2" }}>
              <AlertTriangle size={18} style={{ color: "#B5222A" }} />
            </div>
            <div>
              <h4 className="font-bold text-[#231F1C]" style={{ fontFamily: "'Playfair Display', serif" }}>Excluir obra?</h4>
              <p className="text-[#6E5B47] text-sm mt-1">
                "<strong>{title}</strong>" será removida permanentemente do acervo.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", border: "1.5px solid rgba(35,31,28,0.2)", color: "#6E5B47" }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#B5222A", color: "#F7F3EC" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8F1A21" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#B5222A" }}
            >
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useState(() => { setTimeout(onDone, 2500) })
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2"
      style={{ backgroundColor: "#231F1C", color: "#F7F3EC", fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="text-[#6E7F5C]">✓</span> {message}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { artworks, addArtwork, updateArtwork, deleteArtwork, toggleArtworkStatus } = useArtworks()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | null>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused">("all")
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) { setToast(msg) }

  function handleLogout() {
    sessionStorage.removeItem("ga_admin")
    navigate("/admin")
  }

  function openNew() { setEditingArtwork(null); setDrawerOpen(true) }
  function openEdit(a: Artwork) { setEditingArtwork(a); setDrawerOpen(true) }
  function closeDrawer() { setDrawerOpen(false); setEditingArtwork(null) }

  function handleSave(data: FormData) {
    const periodColor = getPeriodColor(data.period)
    if (editingArtwork) {
      updateArtwork(editingArtwork.id, { ...data, periodColor })
      showToast("Obra atualizada com sucesso!")
    } else {
      addArtwork({ ...data, periodColor })
      showToast("Obra cadastrada com sucesso!")
    }
    closeDrawer()
  }

  function handleDelete() {
    if (!deletingArtwork) return
    deleteArtwork(deletingArtwork.id)
    showToast("Obra excluída.")
    setDeletingArtwork(null)
  }

  function handleToggle(a: Artwork) {
    toggleArtworkStatus(a.id)
    showToast(a.status === "active" ? `"${a.title}" pausada no site.` : `"${a.title}" reativada no site.`)
  }

  const filtered = artworks.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.artist.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "all" || a.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: artworks.length,
    active: artworks.filter((a) => a.status === "active").length,
    paused: artworks.filter((a) => a.status === "paused").length,
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-30 bg-[#F7F3EC] flex items-center justify-between px-4 sm:px-8 md:px-12" style={{ height: 64, borderBottom: "1px solid rgba(35,31,28,0.1)", boxShadow: "0 1px 8px rgba(35,31,28,0.05)" }}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <p className="font-bold text-[#231F1C] uppercase tracking-widest text-sm sm:text-base leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              Galeria & Ateliê
            </p>
            <p className="text-[#B5222A] text-xs leading-none mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>painel admin</p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "#B5222A", color: "#F7F3EC" }}>
            <LayoutGrid size={10} /> Admin
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[#EFE8DC]"
            style={{ color: "#6E5B47" }}
          >
            <ExternalLink size={13} /> Ver site
          </a>
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', sans-serif", border: "1.5px solid rgba(35,31,28,0.15)", color: "#6E5B47" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#B5222A"; (e.currentTarget as HTMLElement).style.color = "#B5222A" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(35,31,28,0.15)"; (e.currentTarget as HTMLElement).style.color = "#6E5B47" }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-8 md:px-12 py-8 max-w-7xl mx-auto">

        {/* ── PAGE TITLE ── */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="font-bold text-[#231F1C] text-3xl sm:text-4xl uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              Obras
            </h1>
            <p className="text-[#B5222A] text-xl italic" style={{ fontFamily: "'Caveat', cursive" }}>acervo da galeria</p>
          </div>
          <p className="text-[#6E5B47] text-sm mt-1">Gerencie as pinturas exibidas na galeria pública.</p>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Total de Obras", value: stats.total, color: "#231F1C", bg: "#EFE8DC" },
            { label: "Ativas no Site", value: stats.active, color: "#6E7F5C", bg: "rgba(110,127,92,0.1)" },
            { label: "Pausadas", value: stats.paused, color: "#B5222A", bg: "rgba(181,34,42,0.08)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl px-4 sm:px-5 py-4" style={{ backgroundColor: s.bg }}>
              <p className="text-2xl sm:text-3xl font-bold leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif", color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E5B47]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou artista..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "#EFE8DC", border: "1.5px solid rgba(35,31,28,0.12)", color: "#231F1C", fontFamily: "'DM Sans', sans-serif" }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "#B5222A" }}
              onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(35,31,28,0.12)" }}
            />
          </div>

          {/* Status filter */}
          <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1.5px solid rgba(35,31,28,0.12)" }}>
            {(["all", "active", "paused"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className="px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: filterStatus === f ? "#231F1C" : "transparent",
                  color: filterStatus === f ? "#F7F3EC" : "#6E5B47",
                }}
              >
                {f === "all" ? "Todas" : f === "active" ? "Ativas" : "Pausadas"}
              </button>
            ))}
          </div>

          {/* Add button */}
          <button
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap flex-shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#B5222A", color: "#F7F3EC" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8F1A21" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#B5222A" }}
          >
            <Plus size={15} /> Nova Obra
          </button>
        </div>

        {/* ── TABLE (desktop) / CARDS (mobile) ── */}

        {/* Desktop table */}
        <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: "1px solid rgba(35,31,28,0.1)", boxShadow: "0 2px 12px rgba(35,31,28,0.05)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#EFE8DC", borderBottom: "1px solid rgba(35,31,28,0.1)" }}>
                {["Obra", "Artista", "Período", "Ano", "Status", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#6E5B47", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <p className="text-[#B5222A] text-xl italic" style={{ fontFamily: "'Caveat', cursive" }}>
                      {search ? "nenhuma obra encontrada..." : "nenhuma obra cadastrada ainda ✦"}
                    </p>
                    {!search && (
                      <button onClick={openNew} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest" style={{ backgroundColor: "#B5222A", color: "#F7F3EC" }}>
                        <Plus size={12} /> Cadastrar primeira obra
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((artwork, idx) => {
                  const isPaused = artwork.status === "paused"
                  const pColor = periodBadgeColors[artwork.periodColor] ?? "bg-[#6E7F5C] text-[#F7F3EC]"
                  return (
                    <tr
                      key={artwork.id}
                      style={{
                        backgroundColor: isPaused ? "rgba(35,31,28,0.025)" : idx % 2 === 0 ? "#F7F3EC" : "rgba(239,232,220,0.4)",
                        borderBottom: "1px solid rgba(35,31,28,0.06)",
                        opacity: isPaused ? 0.65 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      {/* Thumbnail + Title */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-12 rounded overflow-hidden flex-shrink-0 bg-[#EFE8DC]">
                            <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#231F1C] leading-tight truncate max-w-[180px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {artwork.title}
                            </p>
                            <p className="text-xs text-[#B5222A] italic mt-0.5 truncate" style={{ fontFamily: "'Caveat', cursive" }}>
                              {artwork.quote ? `"${artwork.quote.slice(0, 40)}${artwork.quote.length > 40 ? "..." : ""}"` : "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-[#231F1C] whitespace-nowrap">{artwork.artist}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${pColor}`}>
                          {artwork.period}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-[#6E5B47] whitespace-nowrap">{artwork.year}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{
                            backgroundColor: isPaused ? "rgba(35,31,28,0.08)" : "rgba(110,127,92,0.15)",
                            color: isPaused ? "#6E5B47" : "#6E7F5C",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isPaused ? "#6E5B47" : "#6E7F5C" }} />
                          {isPaused ? "Pausada" : "Ativa"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Edit */}
                          <button
                            onClick={() => openEdit(artwork)}
                            title="Editar"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                            style={{ fontFamily: "'DM Sans', sans-serif", border: "1.5px solid #B5222A", color: "#B5222A", backgroundColor: "transparent" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(181,34,42,0.06)" }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                          >
                            <Pencil size={11} /> Editar
                          </button>

                          {/* Pause/Activate */}
                          <button
                            onClick={() => handleToggle(artwork)}
                            title={isPaused ? "Ativar no site" : "Pausar no site"}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              border: "1.5px solid rgba(35,31,28,0.15)",
                              color: "#6E5B47",
                              backgroundColor: "transparent",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#EFE8DC" }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                          >
                            {isPaused ? <><PlayCircle size={11} /> Ativar</> : <><PauseCircle size={11} /> Pausar</>}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingArtwork(artwork)}
                            title="Excluir"
                            className="inline-flex items-center gap-1 p-1.5 rounded-md transition-colors"
                            style={{ color: "#C9878B" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FEE2E2"; (e.currentTarget as HTMLElement).style.color = "#B5222A" }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C9878B" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#EFE8DC", borderTop: "1px solid rgba(35,31,28,0.08)" }}>
              <p className="text-xs text-[#6E5B47]">{filtered.length} {filtered.length === 1 ? "obra" : "obras"} encontrada{filtered.length !== 1 ? "s" : ""}</p>
              <p className="text-[#B5222A] text-xs italic" style={{ fontFamily: "'Caveat', cursive" }}>acervo Galeria & Ateliê ✦</p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#B5222A] text-xl italic" style={{ fontFamily: "'Caveat', cursive" }}>nenhuma obra encontrada...</p>
            </div>
          ) : (
            filtered.map((artwork) => {
              const isPaused = artwork.status === "paused"
              const pColor = periodBadgeColors[artwork.periodColor] ?? "bg-[#6E7F5C] text-[#F7F3EC]"
              return (
                <div
                  key={artwork.id}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: isPaused ? "rgba(239,232,220,0.4)" : "#EFE8DC",
                    border: "1px solid rgba(35,31,28,0.08)",
                    opacity: isPaused ? 0.7 : 1,
                  }}
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-16 rounded overflow-hidden flex-shrink-0 bg-white">
                      <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-[#231F1C] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {artwork.title}
                        </p>
                        <span
                          className="flex-shrink-0 w-2 h-2 rounded-full mt-1"
                          style={{ backgroundColor: isPaused ? "#6E5B47" : "#6E7F5C" }}
                          title={isPaused ? "Pausada" : "Ativa"}
                        />
                      </div>
                      <p className="text-xs text-[#6E5B47] mt-0.5">{artwork.artist} · {artwork.year}</p>
                      <span className={`mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pColor}`}>
                        {artwork.period}
                      </span>
                    </div>
                  </div>

                  {/* Mobile actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openEdit(artwork)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                      style={{ border: "1.5px solid #B5222A", color: "#B5222A", backgroundColor: "transparent" }}
                    >
                      <Pencil size={11} /> Editar
                    </button>
                    <button
                      onClick={() => handleToggle(artwork)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                      style={{ border: "1.5px solid rgba(35,31,28,0.15)", color: "#6E5B47", backgroundColor: "transparent" }}
                    >
                      {isPaused ? <><PlayCircle size={11} /> Ativar</> : <><PauseCircle size={11} /> Pausar</>}
                    </button>
                    <button
                      onClick={() => setDeletingArtwork(artwork)}
                      className="inline-flex items-center gap-1 p-1.5 rounded-md transition-colors"
                      style={{ color: "#C9878B" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* Overlays */}
      {drawerOpen && <ArtworkFormDrawer editing={editingArtwork} onClose={closeDrawer} onSave={handleSave} />}
      {deletingArtwork && <DeleteConfirm title={deletingArtwork.title} onCancel={() => setDeletingArtwork(null)} onConfirm={handleDelete} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
