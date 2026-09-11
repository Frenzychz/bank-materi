import { supabase } from '../lib/supabase'
import type { Section, NodeType, ResourceCategory, SourceType } from '../types'
import { initialNodes, initialResources } from '../utils/initialData'

export interface SearchResultItem {
  id: string
  title: string
  description: string | null
  resultType: 'node' | 'resource'
  nodeType?: NodeType
  category?: ResourceCategory
  sourceType?: SourceType
  url?: string | null
  targetNodeId: string
  section: Section
  breadcrumbs: string[]
}

export const searchService = {
  async search(section: Section, rawQuery: string): Promise<SearchResultItem[]> {
    const query = rawQuery.trim().toLowerCase()
    if (!query) return []

    try {
      // 1. Ambil semua nodes aktif di section ini untuk referensi hierarki breadcrumb
      const { data: sectionNodesData, error: nodesErr } = await supabase
        .from('nodes')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)

      const nodes = (nodesErr || !sectionNodesData ? initialNodes.filter((n) => n.section === section && n.is_active) : sectionNodesData)

      // Buat map id -> node untuk pencarian breadcrumbs O(1)
      const nodeMap = new Map<string, (typeof nodes)[0]>()
      nodes.forEach((n) => nodeMap.set(n.id, n))

      // Fungsi bantuan untuk membuat jejak breadcrumb: [Mapel, Bab, Sub-bab]
      const getBreadcrumbTrail = (startNodeId: string): string[] => {
        const trail: string[] = []
        let curr = nodeMap.get(startNodeId)

        while (curr && curr.parent_id) {
          if (curr.node_type !== 'section') {
            trail.unshift(curr.name)
          }
          curr = nodeMap.get(curr.parent_id)
        }
        return trail
      }

      const results: SearchResultItem[] = []

      // 2. Cari di dalam NODES (Topik / Bab / Sub-bab / Koleksi)
      nodes.forEach((node) => {
        // Jangan sertakan root section itu sendiri
        if (node.node_type === 'section') return

        const nameMatch = node.name.toLowerCase().includes(query)
        const descMatch = node.description ? node.description.toLowerCase().includes(query) : false

        if (nameMatch || descMatch) {
          const breadcrumbs = getBreadcrumbTrail(node.id)
          results.push({
            id: node.id,
            title: node.name,
            description: node.description,
            resultType: 'node',
            nodeType: node.node_type,
            targetNodeId: node.id,
            section: node.section,
            breadcrumbs,
          })
        }
      })

      // 3. Cari di dalam RESOURCES (PDF, Video YouTube, Latsol) yang berstatus published
      const validNodeIds = Array.from(nodeMap.keys())
      
      const { data: resData, error: resErr } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'published')
        .in('node_id', validNodeIds)

      const allResources = (resErr || !resData ? initialResources.filter((r) => validNodeIds.includes(r.node_id) && r.status === 'published') : resData)

      allResources.forEach((res) => {
        const titleMatch = res.title.toLowerCase().includes(query)
        const descMatch = res.description ? res.description.toLowerCase().includes(query) : false

        if (titleMatch || descMatch) {
          const parentTrail = getBreadcrumbTrail(res.node_id)
          results.push({
            id: res.id,
            title: res.title,
            description: res.description,
            resultType: 'resource',
            category: res.category,
            sourceType: res.source_type,
            url: res.url,
            targetNodeId: res.node_id,
            section,
            breadcrumbs: parentTrail,
          })
        }
      })

      // 4. Urutkan: Judul yang persis / diawali query di atas, disusul alfabetis
      return results.sort((a, b) => {
        const aTitle = a.title.toLowerCase()
        const bTitle = b.title.toLowerCase()
        const aStarts = aTitle.startsWith(query) ? 1 : 0
        const bStarts = bTitle.startsWith(query) ? 1 : 0
        if (aStarts !== bStarts) return bStarts - aStarts
        return aTitle.localeCompare(bTitle)
      })
    } catch {
      return []
    }
  },
}
