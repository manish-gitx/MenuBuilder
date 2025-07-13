import { useState } from 'react'
import { MenuItem, Tag } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { MenuItemCard } from './MenuItemCard'
import { CreateMenuItemModal } from './CreateMenuItemModal'
import { clsx } from 'clsx'

interface MenuItemsViewProps {
  menuItems: MenuItem[]
  selectedCategoryId: string | null
  selectedCategoryName?: string
  availableTags: Tag[]
  onCreateMenuItem: (data: {
    name: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => void
  onUpdateMenuItem: (id: string, data: {
    name?: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => void
  onDeleteMenuItem: (id: string) => void
  onUploadImage: (id: string, file: File) => void
  onSelectItem: (item: MenuItem | null) => void
  selectedItem: MenuItem | null
}

type ViewMode = 'grid' | 'list'

export function MenuItemsView({
  menuItems,
  selectedCategoryId,
  selectedCategoryName,
  availableTags,
  onCreateMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onUploadImage,
  onSelectItem,
  selectedItem
}: MenuItemsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Filter items based on search
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.ingredients?.toLowerCase().includes(query)
    )
  })

  const handleCreateMenuItem = (data: {
    name: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => {
    onCreateMenuItem(data)
    setShowCreateModal(false)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {selectedCategoryName || 'All Menu Items'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'list' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Add Item Button */}
            <Button
              onClick={() => setShowCreateModal(true)}
              disabled={!selectedCategoryId}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selectedCategoryId ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 mb-4 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Select a category
            </h3>
            <p className="text-muted-foreground">
              Choose a category from the sidebar to view and manage menu items
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 mb-4 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No items found' : 'No items yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : `Add your first menu item to ${selectedCategoryName}`
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          <SortableContext
            items={filteredItems.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className={clsx(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  viewMode={viewMode}
                  isSelected={selectedItem?.id === item.id}
                  availableTags={availableTags}
                  onEdit={(data) => onUpdateMenuItem(item.id, data)}
                  onDelete={() => onDeleteMenuItem(item.id)}
                  onUploadImage={(file) => onUploadImage(item.id, file)}
                  onSelect={() => onSelectItem(item)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Create Item Modal */}
      <CreateMenuItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMenuItem}
        availableTags={availableTags}
        categoryName={selectedCategoryName}
      />
    </div>
  )
}