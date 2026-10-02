import { supabase } from '../lib/supabase'
import type { CountdownConfig } from '../config/countdown'
import { DEFAULT_COUNTDOWN_CONFIG } from '../config/countdown'

const STORAGE_KEY = 'bank_materi_countdown'
const NODE_SETTINGS_ID = 'app-setting-countdown'

export const settingsService = {
  // Ambil pengaturan countdown (dari cache lokal dulu, lalu sync dari Supabase jika ada)
  async getCountdownConfig(): Promise<CountdownConfig> {
    let currentConfig: CountdownConfig = { ...DEFAULT_COUNTDOWN_CONFIG }

    // 1. Coba baca dari localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.tkaDate && parsed.utbkDate) {
          currentConfig = { ...currentConfig, ...parsed }
        }
      }
    } catch {
      // Abaikan jika error parse
    }

    // 2. Coba sync dari Supabase
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select('description')
        .eq('id', NODE_SETTINGS_ID)
        .single()

      if (!error && data?.description) {
        const remoteParsed = JSON.parse(data.description)
        if (remoteParsed.tkaDate && remoteParsed.utbkDate) {
          currentConfig = { ...currentConfig, ...remoteParsed }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig))
        }
      }
    } catch {
      // Tetap gunakan cached / default jika offline
    }

    return currentConfig
  },

  // Simpan pengaturan countdown oleh admin ke Supabase & LocalStorage
  async saveCountdownConfig(config: CountdownConfig): Promise<void> {
    // 1. Simpan ke local storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      // Abaikan
    }

    // 2. Upsert ke Supabase
    const payload = {
      id: NODE_SETTINGS_ID,
      section: 'snbt',
      parent_id: null,
      node_type: 'section',
      name: 'Countdown Settings',
      description: JSON.stringify(config),
      sort_order: 9999,
      is_active: false, // Tidak ditampilkan di daftar kurikulum
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('nodes')
      .upsert(payload, { onConflict: 'id' })

    if (error) {
      console.warn('Gagal menyimpan countdown ke cloud database:', error.message)
    }
  },
}
