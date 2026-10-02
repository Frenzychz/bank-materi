import type { Resource } from '../../types'
import { useSortableList } from '../../hooks/useSortableList'
import DraggableResourceCard from './DraggableResourceCard'

interface SortableResourceGridProps {
  resources: Resource[]
  onReorder: (newResources: Resource[]) => void
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
}

export default function SortableResourceGrid({
  resources,
  onReorder,
  onEdit,
  onDelete,
}: SortableResourceGridProps) {
  const dnd = useSortableList(resources, onReorder)

  if (resources.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((res, index) => (
        <DraggableResourceCard
          key={res.id}
          res={res}
          index={index}
          total={resources.length}
          isDragging={dnd.draggedIndex === index}
          isDragOver={dnd.dragOverIndex === index}
          onDragStart={() => dnd.handleDragStart(index)}
          onDragOver={(e) => dnd.handleDragOver(e, index)}
          onDrop={(e) => dnd.handleDrop(e, index)}
          onDragEnd={dnd.handleDragEnd}
          onMoveUp={() => dnd.moveUp(index)}
          onMoveDown={() => dnd.moveDown(index)}
          onEdit={() => onEdit(res)}
          onDelete={() => onDelete(res)}
        />
      ))}
    </div>
  )
}
