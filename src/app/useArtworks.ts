import { useState, useEffect } from "react"
import monaLisa from "../imports/image_1.png"
import starryNight from "../imports/image_2.png"
import abaporu from "../imports/image_3.png"
import persistencia from "../imports/image_4.png"
import oBeijo from "../imports/image_5.png"

export type ArtworkStatus = "active" | "paused"

export type Artwork = {
  id: number
  title: string
  artist: string
  year: string
  period: string
  periodColor: string
  quote: string
  image: string
  rotation: number
  status: ArtworkStatus
  createdAt: string
}

export type Sticker = {
  id: number
  title: string
  description: string
  price: number
  badge: string | null
  image: string
  rotation: number
  note: string
  status: ArtworkStatus
}

const periodColorMap: Record<string, string> = {
  "Renascimento": "sage",
  "Pós-impressionismo": "blush",
  "Modernismo": "mustard",
  "Surrealismo": "coral",
  "Simbolismo": "mustard",
  "Barroco": "sage",
  "Barroco Flamengo": "blush",
  "Outro": "sage",
}

export function getPeriodColor(period: string): string {
  return periodColorMap[period] ?? "sage"
}

const SEED_ARTWORKS: Artwork[] = [
  { id: 1, title: "Mona Lisa", artist: "Leonardo da Vinci", year: "1503–1519", period: "Renascimento", periodColor: "sage", quote: "O sorriso mais enigmático da história da arte", image: monaLisa as unknown as string, rotation: -1, status: "active", createdAt: "2024-01-01" },
  { id: 2, title: "A Noite Estrelada", artist: "Vincent van Gogh", year: "1889", period: "Pós-impressionismo", periodColor: "blush", quote: "Sonho com pintura, então pinto meu sonho", image: starryNight as unknown as string, rotation: 1, status: "active", createdAt: "2024-01-02" },
  { id: 3, title: "Abaporu", artist: "Tarsila do Amaral", year: "1928", period: "Modernismo", periodColor: "mustard", quote: "A mais importante obra da arte moderna brasileira", image: abaporu as unknown as string, rotation: -2, status: "active", createdAt: "2024-01-03" },
  { id: 4, title: "A Persistência da Memória", artist: "Salvador Dalí", year: "1931", period: "Surrealismo", periodColor: "coral", quote: "O único diferencial entre a loucura e mim é que não sou louco", image: persistencia as unknown as string, rotation: 1.5, status: "active", createdAt: "2024-01-04" },
  { id: 5, title: "O Beijo", artist: "Gustav Klimt", year: "1907–1908", period: "Simbolismo", periodColor: "mustard", quote: "Arte é linha, cor e forma a serviço do amor", image: oBeijo as unknown as string, rotation: -1.5, status: "active", createdAt: "2024-01-05" },
  { id: 6, title: "A Dama em Azul", artist: "Johannes Vermeer", year: "c. 1664", period: "Barroco", periodColor: "sage", quote: "Silêncio e luz como linguagem própria", image: "https://images.unsplash.com/photo-1583934583792-262536fa7003?w=400&h=520&fit=crop&auto=format", rotation: 2, status: "active", createdAt: "2024-01-06" },
  { id: 7, title: "Flores em Cesta", artist: "Jan Brueghel, o Velho", year: "c. 1615", period: "Barroco Flamengo", periodColor: "blush", quote: "A eternidade capturada em pétalas de tinta", image: "https://images.unsplash.com/photo-1584727638057-78254f636b5a?w=400&h=520&fit=crop&auto=format", rotation: -2, status: "active", createdAt: "2024-01-07" },
  { id: 8, title: "Cena Mitológica", artist: "Escola Italiana", year: "séc. XVII", period: "Renascimento", periodColor: "sage", quote: "Onde os deuses habitam entre os mortais", image: "https://images.unsplash.com/photo-1746039076922-7d8f7c38d972?w=400&h=520&fit=crop&auto=format", rotation: 1, status: "active", createdAt: "2024-01-08" },
]

const SEED_STICKERS: Sticker[] = [
  { id: 101, title: "Clássicos do Renascimento", description: "8 adesivos · vinil fosco · impermeáveis", price: 45.9, badge: null, image: monaLisa as unknown as string, rotation: -1, note: "feito com amor ✦", status: "active" },
  { id: 102, title: "Noites Van Gogh", description: "8 adesivos · brilhosos · cor viva", price: 45.9, badge: null, image: starryNight as unknown as string, rotation: 1.5, note: "edição especial", status: "active" },
  { id: 103, title: "Brasil Moderno", description: "6 adesivos · Tarsila & amigos · mat", price: 38.9, badge: "NOVO", image: abaporu as unknown as string, rotation: -2, note: "arte brasileira ♥", status: "active" },
  { id: 104, title: "Sonhos Surrealistas", description: "8 adesivos · Dalí · vinil holográfico", price: 52.9, badge: "LIMITADO", image: persistencia as unknown as string, rotation: 1, note: "só 200 unidades", status: "active" },
  { id: 105, title: "Ouro & Amor (Klimt)", description: "6 adesivos · dourados · laminados", price: 52.9, badge: "LIMITADO", image: oBeijo as unknown as string, rotation: -1.5, note: "brilho especial ✦", status: "active" },
  { id: 106, title: "Mix de Mestres", description: "12 adesivos · seleção curatorial", price: 68.9, badge: null, image: "https://images.unsplash.com/photo-1584727638057-78254f636b5a?w=400&h=400&fit=crop&auto=format", rotation: 2, note: "para colecionadores", status: "active" },
]

const ARTWORKS_KEY = "ga_artworks"
const STICKERS_KEY = "ga_stickers"

function loadFromStorage<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return seed
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seed
  } catch {
    return seed
  }
}

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>(() => loadFromStorage(ARTWORKS_KEY, SEED_ARTWORKS))

  useEffect(() => {
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks))
  }, [artworks])

  function addArtwork(data: Omit<Artwork, "id" | "status" | "createdAt">) {
    setArtworks((prev) => [
      ...prev,
      { ...data, id: Date.now(), status: "active", createdAt: new Date().toLocaleDateString("pt-BR") },
    ])
  }

  function updateArtwork(id: number, changes: Partial<Artwork>) {
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)))
  }

  function deleteArtwork(id: number) {
    setArtworks((prev) => prev.filter((a) => a.id !== id))
  }

  function toggleArtworkStatus(id: number) {
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a))
    )
  }

  return { artworks, addArtwork, updateArtwork, deleteArtwork, toggleArtworkStatus }
}

export function useStickers() {
  const [stickers, setStickers] = useState<Sticker[]>(() => loadFromStorage(STICKERS_KEY, SEED_STICKERS))

  useEffect(() => {
    localStorage.setItem(STICKERS_KEY, JSON.stringify(stickers))
  }, [stickers])

  function toggleStickerStatus(id: number) {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s))
    )
  }

  return { stickers, toggleStickerStatus }
}

export const PERIODS = [
  "Renascimento",
  "Pós-impressionismo",
  "Modernismo",
  "Surrealismo",
  "Simbolismo",
  "Barroco",
  "Barroco Flamengo",
  "Outro",
]
