import { supabase } from "./supabase"
import type { Artwork, ArtworkInput, CatalogStatus, Sticker } from "../types/catalog"

type ArtworkRow = {
  id: number
  title: string
  artist: string
  year: string
  period: string
  period_color: string
  quote: string
  image_url: string
  rotation: number
  status: CatalogStatus
  created_at: string
}

type StickerRow = {
  id: number
  title: string
  description: string
  price: number
  badge: string | null
  image_url: string
  rotation: number
  note: string
  status: CatalogStatus
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR")
}

function mapArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    year: row.year,
    period: row.period,
    periodColor: row.period_color,
    quote: row.quote,
    image: row.image_url,
    rotation: Number(row.rotation),
    status: row.status,
    createdAt: formatDate(row.created_at),
  }
}

type StickerImageRow = {
  sticker_id: number
  image_url: string
  sort_order: number
}

function mapSticker(row: StickerRow, gallery: string[]): Sticker {
  const photos = gallery.length > 0 ? gallery : [row.image_url]

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    badge: row.badge,
    image: photos[0],
    gallery: photos,
    rotation: Number(row.rotation),
    note: row.note,
    status: row.status,
  }
}

function toArtworkPayload(data: ArtworkInput | Partial<ArtworkInput>) {
  const payload: Record<string, unknown> = {}

  if (data.title !== undefined) payload.title = data.title
  if (data.artist !== undefined) payload.artist = data.artist
  if (data.year !== undefined) payload.year = data.year
  if (data.period !== undefined) payload.period = data.period
  if (data.periodColor !== undefined) payload.period_color = data.periodColor
  if (data.quote !== undefined) payload.quote = data.quote
  if (data.image !== undefined) payload.image_url = data.image
  if (data.rotation !== undefined) payload.rotation = data.rotation
  if (data.status !== undefined) payload.status = data.status

  return payload
}

export async function fetchArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("id", { ascending: true })

  if (error) throw error
  return (data as ArtworkRow[]).map(mapArtwork)
}

export async function createArtwork(input: ArtworkInput): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .insert({
      ...toArtworkPayload(input),
      status: "active",
    })
    .select()
    .single()

  if (error) throw error
  return mapArtwork(data as ArtworkRow)
}

export async function updateArtwork(id: number, changes: Partial<ArtworkInput> & { status?: CatalogStatus }): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .update(toArtworkPayload(changes))
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return mapArtwork(data as ArtworkRow)
}

export async function deleteArtwork(id: number): Promise<void> {
  const { error } = await supabase.from("artworks").delete().eq("id", id)
  if (error) throw error
}

export async function fetchStickers(): Promise<Sticker[]> {
  const [{ data: stickers, error: stickersError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from("stickers").select("*").order("id", { ascending: true }),
    supabase
      .from("sticker_images")
      .select("sticker_id, image_url, sort_order")
      .order("sort_order", { ascending: true }),
  ])

  if (stickersError) throw stickersError
  if (imagesError) throw imagesError

  const galleryBySticker = new Map<number, string[]>()

  for (const row of (images ?? []) as StickerImageRow[]) {
    const current = galleryBySticker.get(row.sticker_id) ?? []
    current.push(row.image_url)
    galleryBySticker.set(row.sticker_id, current)
  }

  return ((stickers ?? []) as StickerRow[]).map((row) =>
    mapSticker(row, galleryBySticker.get(row.id) ?? [])
  )
}

export async function updateStickerStatus(id: number, status: CatalogStatus): Promise<void> {
  const { error } = await supabase.from("stickers").update({ status }).eq("id", id)
  if (error) throw error
}
