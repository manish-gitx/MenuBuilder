import { useState } from 'react'
import { Category } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { 
  PlusIcon, 
  FolderIcon, 
  FolderOpenIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'
import React from 'react'

interface CategorySidebarProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
  onCreateCategory: (data: { name: string; description?: string; parentCategoryId?: string }) => void
  onUpdateCategory: (id: string, data: { name?: string; description?: string }) => void
  onDeleteCategory: (id: string) => void
  onReorderCategories: (categories: Category[]) => void
}

interface CategoryFormData {
  name: string
  description: string
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories
}: CategorySidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null)

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCreateCategory = (formData: CategoryFormData) => {
    onCreateCategory({
      name: formData.name,
      description: formData.description || undefined,
      parentCategoryId: parentCategoryId || undefined
    })
    setShowCreateModal(false)
    setParentCategoryId(null)
  }

  const handleEditCategory = (formData: CategoryFormData) => {
    if (editingCategory) {
      onUpdateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description || undefined
      })
      setEditingCategory(null)
    }
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.childCategories && category.childCategories.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryId === category.id

    return (
      <div key={category.id}>
        <SortableCategoryItem
          category={category}
          level={level}
          isSelected={isSelected}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onSelect={() => onSelectCategory(category.id)}
          onToggleExpanded={() => toggleExpanded(category.id)}
          onEdit={() => setEditingCategory(category)}
          onDelete={() => onDeleteCategory(category.id)}
          onAddSubcategory={() => {
            setParentCategoryId(category.id)
            setShowCreateModal(true)
          }}
        />
        
        {hasChildren && isExpanded && category.childCategories && (
          <div className="ml-4">
            {category.childCategories.map(child => 
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const topLevelCategories = categories.filter(cat => !cat.parentCategoryId)

  return (
    <div className="w-80 bg-card border-r border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectCategory(null)}
          className={clsx(
            'w-full justify-start',
            selectedCategoryId === null && 'bg-accent text-accent-foreground'
          )}
        >
          <FolderIcon className="w-4 h-4 mr-2" />
          All Items
        </Button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4">
        <SortableContext
          items={topLevelCategories.map(cat => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {topLevelCategories.map(category => renderCategory(category))}
          </div>
        </SortableContext>
        
        {topLevelCategories.length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No categories yet
            </p>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              Create Category
            </Button>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      <CategoryFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setParentCategoryId(null)
        }}
        onSubmit={handleCreateCategory}
        title="Create Category"
        parentCategory={parentCategoryId ? categories.find(c => c.id === parentCategoryId) : undefined}
      />

      {/* Edit Category Modal */}
      <CategoryFormModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditCategory}
        title="Edit Category"
        initialData={editingCategory ? {
          name: editingCategory.name,
          description: editingCategory.description || ''
        } : undefined}
      />
    </div>
  )
}

interface SortableCategoryItemProps {
  category: Category
  level: number
  isSelected: boolean
  isExpanded: boolean
  hasChildren: boolean
  onSelect: () => void
  onToggleExpanded: () => void
  onEdit: () => void
  onDelete: () => void
  onAddSubcategory: () => void
}

function SortableCategoryItem({
  category,
  level,
  isSelected,
  isExpanded,
  hasChildren,
  onSelect,
  onToggleExpanded,
  onEdit,
  onDelete,
  onAddSubcategory
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      type: 'category',
      category,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group flex items-center gap-2 p-2 rounded-lg transition-colors',
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity"
      >
        <Bars3Icon className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Expand/Collapse Button */}
      <button
        onClick={onToggleExpanded}
        className={clsx(
          'p-1 rounded',
          hasChildren ? 'hover:bg-muted' : 'invisible'
        )}
      >
        {hasChildren && (
          isExpanded ? 
            <ChevronDownIcon className="w-4 h-4" /> : 
            <ChevronRightIcon className="w-4 h-4" />
        )}
      </button>

      {/* Category Icon */}
      <div className="flex-shrink-0">
        {hasChildren ? (
          isExpanded ? 
            <FolderOpenIcon className="w-5 h-5" /> : 
            <FolderIcon className="w-5 h-5" />
        ) : (
          <FolderIcon className="w-5 h-5" />
        )}
      </div>

      {/* Category Name */}
      <button
        onClick={onSelect}
        className="flex-1 text-left font-medium truncate"
      >
        {category.name}
      </button>

      {/* Item Count */}
      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
        {category._count?.menuItems || 0}
      </span>

      {/* Actions Menu */}
      <HeadlessMenu as="div" className="relative">
        <HeadlessMenu.Button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity">
          <EllipsisVerticalIcon className="w-4 h-4" />
        </HeadlessMenu.Button>
        
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-card shadow-lg ring-1 ring-border focus:outline-none">
            <div className="p-1">
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={onEdit}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                    )}
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Category
                  </button>
                )}
              </HeadlessMenu.Item>
              
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={onAddSubcategory}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                    )}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Subcategory
                  </button>
                )}
              </HeadlessMenu.Item>
              
              <div className="border-t border-border my-1" />
              
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={onDelete}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      active ? 'bg-destructive text-destructive-foreground' : 'text-destructive'
                    )}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </HeadlessMenu.Item>
            </div>
          </HeadlessMenu.Items>
        </Transition>
      </HeadlessMenu>
    </div>
  )
}

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => void
  title: string
  initialData?: CategoryFormData
  parentCategory?: Category
}

function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  parentCategory
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  })

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { name: '', description: '' })
    }
  }, [isOpen, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
      setFormData({ name: '', description: '' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {parentCategory && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Creating subcategory under: <span className="font-medium text-foreground">{parentCategory.name}</span>
            </p>
          </div>
        )}
        
        <Input
          label="Category Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Main Course"
        />
        
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this category..."
          rows={3}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.name.trim()}>
            {initialData ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </form>
    </Modal>
  )
}