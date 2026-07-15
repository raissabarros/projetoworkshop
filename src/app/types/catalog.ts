export type CatalogStatus = "active" | "paused"

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
  status: CatalogStatus
  createdAt: string
}

export type Sticker = {
  id: number
  title: string
  description: string
  price: number
  badge: string | null
  image: string
  gallery: string[]
  rotation: number
  note: string
  status: CatalogStatus
}

export type ArtworkInput = Omit<Artwork, "id" | "status" | "createdAt">

const periodColorMap: Record<string, string> = {
  Renascimento: "sage",
  "Pós-impressionismo": "blush",
  Modernismo: "mustard",
  Surrealismo: "coral",
  "Art Nouveau": "mustard",
  Simbolismo: "mustard",
  Barroco: "sage",
  "Barroco Flamengo": "blush",
  Outro: "sage",
}

export function getPeriodColor(period: string): string {
  return periodColorMap[period] ?? "sage"
}

export const PERIODS = [
  "Renascimento",
  "Pós-impressionismo",
  "Modernismo",
  "Surrealismo",
  "Simbolismo",
  "Art Nouveau",
  "Barroco",
  "Barroco Flamengo",
  "Outro",
] as const
