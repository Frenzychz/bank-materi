import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan Kunci Anon dari file .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi sederhana agar kita tahu jika kuncinya lupa diisi
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Kunci Supabase belum disetting di file .env.local!')
}

// Inisialisasi client Supabase yang siap digunakan di seluruh website
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')