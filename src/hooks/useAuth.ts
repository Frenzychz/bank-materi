import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { authService } from '../services/auth.service'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Periksa sesi login saat website pertama kali dibuka
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // 2. Pasang pendengar otomatis jika status login berubah (misal: baru login atau logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (identifier: string, password: string) => {
    return await authService.login(identifier, password)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}