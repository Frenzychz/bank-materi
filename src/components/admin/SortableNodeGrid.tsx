import type { Node } from '../../types'
import { useSortableList } from '../../hooks/useSortableList'
import DraggableNodeCard from './DraggableNodeCard'

interface SortableNodeGridProps {
  nodes: Node[]
  onReorder: (newNodes: Node[]) => void
  onEdit: (node: Node) => void
  onDelete: (node: Node) => void
  badge?: string
  badgeColor?: string
}

export default function SortableNodeGrid({
  nodes,
  onReorder,
  onEdit,
  onDelete,
  badge,
  badgeColor,
}: SortableNodeGridProps) {
  const dnd = useSortableList(nodes, onReorder)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {nodes.map((node, index) => (
        <DraggableNodeCard
          key={node.id}
          node={node}
          index={index}
          total={nodes.length}
          isDragging={dnd.draggedIndex === index}
          isDragOver={dnd.dragOverIndex === index}
          badge={badge}
          badgeColor={badgeColor}
          onDragStart={() => dnd.handleDragStart(index)}
          onDragOver={(e) => dnd.handleDragOver(e, index)}
          onDrop={(e) => dnd.handleDrop(e, index)}
          onDragEnd={dnd.handleDragEnd}
          onMoveUp={() => dnd.moveUp(index)}
          onMoveDown={() => dnd.moveDown(index)}
          onEdit={() => onEdit(node)}
          onDelete={() => onDelete(node)}
        />
      ))}
    </div>
  )
}
