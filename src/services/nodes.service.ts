import { supabase } from '../lib/supabase'
import type { Node, Section, NodeType } from '../types'
import { initialNodes } from '../utils/initialData'

export interface CreateNodeInput {
  id?: string
  section: Section
  parent_id: string | null
  node_type: NodeType
  name: string
  description?: string | null
  sort_order?: number
  is_active?: boolean
}

export const nodesService = {
  // 1. Mengambil semua node berdasarkan section (TKA atau SNBT)
  async getBySection(section: Section): Promise<Node[]> {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        return initialNodes.filter((n) => n.section === section && n.is_active)
      }

      return (data || []) as Node[]
    } catch {
      return initialNodes.filter((n) => n.section === section && n.is_active)
    }
  },

  // 2. Mengambil 1 node spesifik berdasarkan ID
  async getById(id: string): Promise<Node | null> {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        const fallback = initialNodes.find((n) => n.id === id)
        return fallback || null
      }

      return data as Node
    } catch {
      return initialNodes.find((n) => n.id === id) || null
    }
  },

  // 3. Mengambil semua anak-anak (children) di bawah parent tertentu
  async getChildren(parentId: string): Promise<Node[]> {
    try {
      const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('parent_id', parentId)
        .order('sort_order', { ascending: true })

      if (error) {
        return initialNodes
          .filter((n) => n.parent_id === parentId)
          .sort((a, b) => a.sort_order - b.sort_order)
      }

      return (data || []) as Node[]
    } catch {
      return initialNodes
        .filter((n) => n.parent_id === parentId)
        .sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  // 4. Mengambil jejak leluhur (parent) untuk Breadcrumb
  async getAncestors(currentNode: Node): Promise<Node[]> {
    const ancestors: Node[] = []
    let current: Node | null = currentNode

    while (current && current.parent_id) {
      const parent: Node | null = await this.getById(current.parent_id)
      if (parent) {
        ancestors.unshift(parent)
        current = parent
      } else {
        break
      }
    }

    return ancestors
  },

  // 5. TAMBAH NODE BARU (Create)
  async createNode(input: CreateNodeInput): Promise<Node> {
    const now = new Date().toISOString()
    const newNodeId =
      input.id ||
      `${input.section}-${input.node_type}-${Date.now()}`

    const payload = {
      id: newNodeId,
      section: input.section,
      parent_id: input.parent_id,
      node_type: input.node_type,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active ?? true,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('nodes')
      .insert([payload])
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal menambah data: ${error.message}`)
    }

    return data as Node
  },

  // 6. EDIT NODE (Update / Rename / Urutan)
  async updateNode(id: string, updates: Partial<Node>): Promise<Node> {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('nodes')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Gagal memperbarui data: ${error.message}`)
    }

    return data as Node
  },

  // 7. CEK ISI ANAK BAB (Safe Deletion Check)
  async checkHasChildren(id: string): Promise<{ childNodesCount: number; resourcesCount: number }> {
    const { count: childNodesCount } = await supabase
      .from('nodes')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id)

    const { count: resourcesCount } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
      .eq('node_id', id)

    return {
      childNodesCount: childNodesCount || 0,
      resourcesCount: resourcesCount || 0,
    }
  },

  // 8. HAPUS NODE (Delete)
  async deleteNode(id: string): Promise<void> {
    const { error } = await supabase
      .from('nodes')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Gagal menghapus data: ${error.message}`)
    }
  },

  // 9. UPDATE URUTAN BANYAK NODE SEKALIGUS (Drag & Drop Reorder)
  async reorderNodes(orderedIds: string[]): Promise<void> {
    try {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('nodes')
          .update({ sort_order: index + 1, updated_at: new Date().toISOString() })
          .eq('id', id)
      )
      await Promise.all(updates)
    } catch (err) {
      console.error('Gagal memperbarui urutan nodes:', err)
      throw new Error('Gagal memperbarui urutan bab/materi.')
    }
  },
}