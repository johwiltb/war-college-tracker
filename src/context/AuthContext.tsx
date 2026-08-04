import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { appConfig, isSupabaseConfigured } from '../lib/config'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  configured: boolean
  user: User | null
  loading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let active = true
    supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return
      setUser(data.user)
      setError(authError?.message ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    configured: isSupabaseConfigured,
    user,
    loading,
    error,
    signIn: async () => {
      if (!supabase) throw new Error('Supabase is not configured. Continue in guest mode or add the environment variables.')
      setError(null)
      const redirectTo = `${window.location.origin}${appConfig.basePath}`
      const { error: signInError } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })
      if (signInError) {
        setError(signInError.message)
        throw signInError
      }
    },
    signOut: async () => {
      if (!supabase) return
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        setError(signOutError.message)
        throw signOutError
      }
    },
  }), [error, loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
