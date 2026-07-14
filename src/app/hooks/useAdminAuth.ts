import { useCallback, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../services/supabase"

const ADMIN_DENIED_MESSAGE =
  "Acesso restrito. Use a conta admin autorizada (raissabarros@alu.ufc.br)."

const PROFILE_WAIT_MS = 500
const PROFILE_MAX_ATTEMPTS = 12

async function fetchProfileRole(userId: string) {
  for (let attempt = 0; attempt < PROFILE_MAX_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (data) return { profile: data, error: null as null }
    if (error && error.code !== "PGRST116") {
      return { profile: null, error }
    }

    if (attempt < PROFILE_MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, PROFILE_WAIT_MS))
    }
  }

  return { profile: null, error: null as null }
}

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const syncSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession)

    if (!nextSession) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    let profile: { role: string } | null = null
    let profileError: { message: string } | null = null

    const result = await fetchProfileRole(nextSession.user.id)
    profile = result.profile
    profileError = result.error

    if (profileError) {
      setIsAdmin(false)
      setError(`Não foi possível verificar permissões: ${profileError.message}`)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!profile) {
      setIsAdmin(false)
      setError(
        "Perfil ainda não disponível. Aguarde alguns segundos e tente entrar novamente."
      )
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile.role !== "admin") {
      setIsAdmin(false)
      setError(ADMIN_DENIED_MESSAGE)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    setIsAdmin(true)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true

    async function init() {
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      if (active) await syncSession(initialSession)
    }

    void init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true)
      void syncSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [syncSession])

  async function signInWithGoogle() {
    setError(null)
    setLoading(true)

    const redirectTo = `${window.location.origin}/admin`

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "select_account" },
      },
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    }
  }

  async function signOut() {
    setError(null)
    setLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
    setLoading(false)
  }

  function clearError() {
    setError(null)
  }

  return {
    session,
    isAdmin,
    loading,
    error,
    signInWithGoogle,
    signOut,
    clearError,
  }
}
