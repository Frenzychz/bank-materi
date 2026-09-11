import { supabase } from '../lib/supabase'

export const authService = {
  // Fungsi Login: Bisa pakai Username atau Email!
  async login(identifier: string, password: string) {
    let email = identifier.trim()

    // Trik pintar: Jika tidak ada tanda @, otomatis tambahkan @admin.com
    if (!email.includes('@')) {
      email = `${email}@admin.com`
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  // Fungsi Logout
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  },

  // Cek apakah ada sesi login aktif saat ini
  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  // Cek user yang sedang login
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },
}