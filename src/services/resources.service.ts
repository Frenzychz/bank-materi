import { supabase } from '../lib/supabase'
import type { Resource, ResourceCategory, SourceType, ResourceStatus } from '../types'
import { initialResources } from '../utils/initialData'

export interface CreateResourceInput {
  node_id: string
  category: ResourceCategory
  title: string
  description?: string | null
  source_type: SourceType
  url?: string | null
  file_path?: string | null
  status?: ResourceStatus
  sort_order?: number
}

export const resourcesService = {
  // 1. Mengambil semua resource published milik bab tertentu (untuk Publik)
  async getByNodeId(nodeId: string): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('node_id', nodeId)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })

      if (error) {
        return initialResources
          .filter((r) => r.node_id === nodeId && r.status === 'published')
          .sort((a, b) => a.sort_order - b.sort_order)
      }

      return (data || []) as Resource[]
    } catch {
      return initialResources
        .filter((r) => r.node_id === nodeId && r.status === 'published')
        .sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  // 2. Mengambil SEMUA resource (Draft, Published, Hidden) milik bab tertentu (khusus Admin)
  async getAllByNodeId(nodeId: string): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('node_id', nodeId)
        .order('sort_order', { ascending: true })

      if (error) {
        return initialResources
          .filter((r) => r.node_id === nodeId)
          .sort((a, b) => a.sort_order - b.sort_order)
      }

      return (data || []) as Resource[]
    } catch {
      return initialResources
        .filter((r) => r.node_id === nodeId)
        .sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  // 3. TAMBAH RESOURCE BARU (Create)
  async createResource(input: CreateResourceInput): Promise<Resource> {
    const now = new Date().toISOString()
    const payload = {
      node_id: input.node_id,
      category: input.category,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      source_type: input.source_type,
      url: input.url?.trim() || null,
      file_path: input.file_path?.trim() || null,
      status: input.status || 'published',
      sort_order: input.sort_order ?? 1,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([payload])
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal menambah materi: ${error.message}`)
    }

    return data as Resource
  },

  // 4. EDIT / GANTI RESOURCE (Update)
  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource> {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('resources')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal memperbarui materi: ${error.message}`)
    }

    return data as Resource
  },

  // 5. HAPUS RESOURCE (Delete)
  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Gagal menghapus materi: ${error.message}`)
    }
  },

  // 6. UPLOAD PDF KE SUPABASE STORAGE (DENGAN PENJAGA MAKSIMAL 50 MB)
  async uploadPdf(file: File, nodeId: string): Promise<{ publicUrl: string; filePath: string }> {
    // Validasi Ukuran File (Maksimal 50 MB = 52.428.800 bytes)
    const MAX_SIZE_BYTES = 50 * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(
        `Ukuran file PDF (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 50 MB! Silakan upload file ini ke Google Drive, lalu gunakan opsi Google Drive di form.`
      )
    }

    // Buat nama file yang unik dan aman dari karakter aneh
    const fileExt = file.name.split('.').pop()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
    const filePath = `pdfs/${nodeId}/${Date.now()}_${cleanFileName}.${fileExt}`

    // Upload ke bucket 'materials'
    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Gagal mengupload file ke storage: ${uploadError.message}`)
    }

    // Dapatkan URL publik yang bisa diakses langsung di tab baru
    const { data } = supabase.storage.from('materials').getPublicUrl(filePath)

    return {
      publicUrl: data.publicUrl,
      filePath: filePath,
    }
  },

  // 7. UPDATE URUTAN BANYAK RESOURCE SEKALIGUS (Drag & Drop Reorder)
  async reorderResources(orderedIds: string[]): Promise<void> {
    try {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('resources')
          .update({ sort_order: index + 1, updated_at: new Date().toISOString() })
          .eq('id', id)
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Gagal memperbarui urutan resources:', err)
      throw new Error('Gagal memperbarui urutan materi.')
    }
  },
}