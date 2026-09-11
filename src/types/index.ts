// Definisi tipe-tipe data yang akan dipakai di website kita

export type NodeType =
  | 'section'
  | 'fundamental'
  | 'subject'
  | 'material'
  | 'submaterial'
  | 'practice_collection'

export type Section = 'tka' | 'snbt'

export type ResourceCategory = 'materi' | 'latihan_soal'

export type SourceType = 'pdf' | 'google_drive' | 'youtube'

export type ResourceStatus = 'draft' | 'published' | 'hidden'

// Struktur data untuk materi/kategori (hierarki)
export interface Node {
  id: string
  section: Section
  parent_id: string | null
  node_type: NodeType
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Struktur data untuk file/link materi (PDF, Drive, YouTube)
export interface Resource {
  id: string
  node_id: string
  category: ResourceCategory
  title: string
  description: string | null
  source_type: SourceType
  url: string | null
  file_path: string | null
  status: ResourceStatus
  sort_order: number
  created_at: string
  updated_at: string
}