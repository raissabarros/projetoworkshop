import { useCallback, useEffect, useState } from "react"
import {
  createArtwork,
  deleteArtwork,
  fetchArtworks,
  updateArtwork,
} from "../services/catalog"
import type { Artwork, ArtworkInput } from "../types/catalog"

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchArtworks()
      setArtworks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar obras")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function addArtwork(data: ArtworkInput) {
    const created = await createArtwork(data)
    setArtworks((prev) => [...prev, created])
    return created
  }

  async function updateArtworkById(id: number, changes: Partial<ArtworkInput> & { status?: Artwork["status"] }) {
    const updated = await updateArtwork(id, changes)
    setArtworks((prev) => prev.map((a) => (a.id === id ? updated : a)))
    return updated
  }

  async function deleteArtworkById(id: number) {
    await deleteArtwork(id)
    setArtworks((prev) => prev.filter((a) => a.id !== id))
  }

  async function toggleArtworkStatus(id: number) {
    const current = artworks.find((a) => a.id === id)
    if (!current) return

    const nextStatus = current.status === "active" ? "paused" : "active"
    await updateArtworkById(id, { status: nextStatus })
  }

  return {
    artworks,
    loading,
    error,
    refetch: load,
    addArtwork,
    updateArtwork: updateArtworkById,
    deleteArtwork: deleteArtworkById,
    toggleArtworkStatus,
  }
}
