import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuItem, Tag } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { 
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'
import { useDropzone } from 'react-dropzone'
import React from 'react'

interface MenuItemCardProps {
  item: MenuItem
  viewMode: 'grid' | 'list'
  isSelected: boolean
  availableTags: Tag[]
  onEdit: (data: {
    name?: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => void
  onDelete: () => void
  onUploadImage: (file: File) => void
  onSelect: () => void
}

export function MenuItemCard({
  item,
  viewMode,
  isSelected,
  availableTags,
  onEdit,
  onDelete,
  onUploadImage,
  onSelect
}: MenuItemCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'menuItem',
      item,
      categoryId: item.categoryId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUploadImage(acceptedFiles[0])
        setShowImageUpload(false)
      }
    }
  })

  if (viewMode === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          'group flex items-center gap-4 p-4 bg-card border border-border/50 rounded-lg transition-all',
          isSelected ? 'border-primary bg-primary/5' : 'hover:border-border',
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

        {/* Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {item.tags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${tag.color}20`, 
                    color: tag.color 
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <ItemActions
          onEdit={() => setShowEditModal(true)}
          onDelete={onDelete}
          onUploadImage={() => setShowImageUpload(true)}
        />

        {/* Modals */}
        <EditItemModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onEdit}
          item={item}
          availableTags={availableTags}
        />

        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          onUpload={onUploadImage}
          itemName={item.name}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      </div>
    )
  }

  // Grid view
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group bg-card border border-border/50 rounded-xl overflow-hidden transition-all hover:shadow-lg cursor-pointer',
        isSelected ? 'border-primary shadow-lg' : 'hover:border-border',
        isDragging && 'opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1 bg-black/20 hover:bg-black/40 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Bars3Icon className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ItemActions
          onEdit={() => setShowEditModal(true)}
          onDelete={onDelete}
          onUploadImage={() => setShowImageUpload(true)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Image */}
      <div className="relative w-full h-48 bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">{item.name}</h3>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.ingredients && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            <span className="font-medium">Ingredients:</span> {item.ingredients}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${tag.color}20`, 
                  color: tag.color 
                }}
              >
                {tag.name}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEdit}
        item={item}
        availableTags={availableTags}
      />

      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={onUploadImage}
        itemName={item.name}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
    </div>
  )
}

interface ItemActionsProps {
  onEdit: () => void
  onDelete: () => void
  onUploadImage: () => void
  onClick?: (e: React.MouseEvent) => void
}

function ItemActions({ onEdit, onDelete, onUploadImage, onClick }: ItemActionsProps) {
  return (
    <HeadlessMenu as="div" className="relative">
      <HeadlessMenu.Button 
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        onClick={onClick}
      >
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
        <HeadlessMenu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg bg-card shadow-lg ring-1 ring-border focus:outline-none">
          <div className="p-1">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  )}
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Item
                </button>
              )}
            </HeadlessMenu.Item>
            
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUploadImage()
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  )}
                >
                  <PhotoIcon className="w-4 h-4" />
                  Upload Image
                </button>
              )}
            </HeadlessMenu.Item>
            
            <div className="border-t border-border my-1" />
            
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
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
  )
}

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name?: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => void
  item: MenuItem
  availableTags: Tag[]
}

function EditItemModal({ isOpen, onClose, onSubmit, item, availableTags }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    tagIds: [] as string[]
  })

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: item.name,
        description: item.description || '',
        ingredients: item.ingredients || '',
        tagIds: item.tags?.map(tag => tag.id) || []
      })
    }
  }, [isOpen, item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Menu Item"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Chicken Biryani"
        />
        
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the dish..."
          rows={3}
        />
        
        <Textarea
          label="Ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
          placeholder="List of ingredients..."
          rows={3}
        />

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={clsx(
                  'text-sm px-3 py-1 rounded-full border transition-colors',
                  formData.tagIds.includes(tag.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-muted'
                )}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.name.trim()}>
            Update Item
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
  itemName: string
  getRootProps: any
  getInputProps: any
  isDragActive: boolean
}

function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  itemName,
  getRootProps,
  getInputProps,
  isDragActive
}: ImageUploadModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Image for ${itemName}`}
      size="md"
    >
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-border'
        )}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary">Drop the image here...</p>
        ) : (
          <>
            <p className="text-foreground mb-2">Drag & drop an image here, or click to select</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>
    </Modal>
  )
}