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

export type SubjectGroup = 'wajib' | 'pilihan'

// Struktur data untuk materi/kategori (hierarki)
export interface Node {
  id: string
  section: Section
  parent_id: string | null
  node_type: NodeType
  subject_group?: SubjectGroup | null
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

// Helper untuk mendeteksi apakah suatu node di TKA masuk kelompok Wajib
export function isTkaWajib(node: Node): boolean {
  if (node.section !== 'tka' || node.node_type !== 'subject') return false
  if (node.subject_group === 'wajib') return true
  if (node.subject_group === 'pilihan') return false

  const lowerId = node.id.toLowerCase()
  const lowerName = node.name.toLowerCase()
  const lowerDesc = (node.description || '').toLowerCase()

  if (lowerDesc.includes('[wajib]') || lowerId.includes('wajib') || lowerName.includes('(wajib)')) {
    return true
  }
  if (lowerDesc.includes('[pilihan]') || lowerName.includes('(pilihan)')) {
    return false
  }

  // Standar default TKA Wajib: Matematika, Bahasa Indonesia, Bahasa Inggris
  if (
    lowerId === 'tka-mat' ||
    lowerId === 'tka-bindo' ||
    lowerId === 'tka-bing' ||
    (lowerName.includes('matematika') && !lowerName.includes('lanjut')) ||
    lowerName === 'bahasa indonesia' ||
    lowerName === 'bahasa inggris'
  ) {
    return true
  }

  return false
}

// Helper untuk membersihkan tag internal [wajib]/[pilihan] dari deskripsi agar tampil rapi di UI
export function cleanDescription(desc: string | null | undefined): string | null {
  if (!desc) return null
  const cleaned = desc.replace(/\[(wajib|pilihan)\]/gi, '').trim()
  return cleaned || null
}