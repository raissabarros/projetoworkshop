import { useCallback, useEffect, useState } from "react"
import { fetchStickers, updateStickerStatus } from "../services/catalog"
import type { Sticker } from "../types/catalog"

export function useStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchStickers()
      setStickers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar adesivos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function toggleStickerStatus(id: number) {
    const current = stickers.find((s) => s.id === id)
    if (!current) return

    const nextStatus = current.status === "active" ? "paused" : "active"
    await updateStickerStatus(id, nextStatus)
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    )
  }

  return {
    stickers,
    loading,
    error,
    refetch: load,
    toggleStickerStatus,
  }
}
