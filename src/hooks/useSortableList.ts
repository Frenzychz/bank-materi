import { useState } from 'react'

export function useSortableList<T extends { id: string }>(
  items: T[],
  onReorder: (newItems: T[]) => void | Promise<void>
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const reordered = [...items]
    const [movedItem] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, movedItem)

    setDraggedIndex(null)
    setDragOverIndex(null)
    onReorder(reordered)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const moveUp = (index: number) => {
    if (index <= 0) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(index - 1, 0, moved)
    onReorder(reordered)
  }

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(index + 1, 0, moved)
    onReorder(reordered)
  }

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    moveUp,
    moveDown,
  }
}
