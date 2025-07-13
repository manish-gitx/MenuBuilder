import React, { createContext, useContext, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Category, MenuItem } from '@/lib/api'

interface DragDropState {
  activeItem: any
  isDragging: boolean
}

interface DragDropContextValue {
  state: DragDropState
  onDragStart: (event: DragStartEvent) => void
  onDragOver: (event: DragOverEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  reorderCategories: (categories: Category[], activeId: string, overId: string) => Category[]
  reorderMenuItems: (items: MenuItem[], activeId: string, overId: string) => MenuItem[]
  moveItemToCategory: (categoryId: string, itemId: string) => void
}

const DragDropContext = createContext<DragDropContextValue | null>(null)

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider')
  }
  return context
}

interface DragDropProviderProps {
  children: React.ReactNode
  onReorderCategories?: (categories: Category[]) => void
  onReorderMenuItems?: (items: MenuItem[]) => void
  onMoveItemToCategory?: (itemId: string, newCategoryId: string) => void
}

export function DragDropProvider({ 
  children, 
  onReorderCategories,
  onReorderMenuItems,
  onMoveItemToCategory 
}: DragDropProviderProps) {
  const [state, setState] = useState<DragDropState>({
    activeItem: null,
    isDragging: false,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setState({
      activeItem: active.data.current,
      isDragging: true,
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Handle category switching for menu items
    const { active, over } = event
    
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // If dragging a menu item over a category
    if (activeData?.type === 'menuItem' && overData?.type === 'category') {
      if (activeData.categoryId !== over.id) {
        onMoveItemToCategory?.(String(active.id), String(over.id))
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setState({
      activeItem: null,
      isDragging: false,
    })

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Handle category reordering
    if (activeData?.type === 'category' && overData?.type === 'category') {
      // Categories will be reordered by the parent component
      return
    }

    // Handle menu item reordering within the same category
    if (activeData?.type === 'menuItem' && overData?.type === 'menuItem') {
      if (activeData.categoryId === overData.categoryId) {
        // Items will be reordered by the parent component
        return
      }
    }
  }

  const reorderCategories = (categories: Category[], activeId: string, overId: string) => {
    const oldIndex = categories.findIndex(cat => cat.id === activeId)
    const newIndex = categories.findIndex(cat => cat.id === overId)
    
    if (oldIndex === -1 || newIndex === -1) return categories
    
    return arrayMove(categories, oldIndex, newIndex)
  }

  const reorderMenuItems = (items: MenuItem[], activeId: string, overId: string) => {
    const oldIndex = items.findIndex(item => item.id === activeId)
    const newIndex = items.findIndex(item => item.id === overId)
    
    if (oldIndex === -1 || newIndex === -1) return items
    
    return arrayMove(items, oldIndex, newIndex)
  }

  const moveItemToCategory = (categoryId: string, itemId: string) => {
    onMoveItemToCategory?.(itemId, categoryId)
  }

  const contextValue: DragDropContextValue = {
    state,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    reorderCategories,
    reorderMenuItems,
    moveItemToCategory,
  }

  return (
    <DragDropContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
        <DragOverlay>
          {state.activeItem && (
            <div className="bg-card border border-border rounded-lg p-4 shadow-lg opacity-90">
              <div className="font-medium text-foreground">
                {state.activeItem.name || state.activeItem.title}
              </div>
              {state.activeItem.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {state.activeItem.description}
                </div>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </DragDropContext.Provider>
  )
}