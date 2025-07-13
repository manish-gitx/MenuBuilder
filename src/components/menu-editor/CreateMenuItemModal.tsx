import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/lib/api'
import { clsx } from 'clsx'

interface CreateMenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => void
  availableTags: Tag[]
  categoryName?: string
}

export function CreateMenuItemModal({
  isOpen,
  onClose,
  onSubmit,
  availableTags,
  categoryName
}: CreateMenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    tagIds: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      ingredients: formData.ingredients.trim() || undefined,
      tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined
    })
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      ingredients: '',
      tagIds: []
    })
    setErrors({})
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      ingredients: '',
      tagIds: []
    })
    setErrors({})
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
      onClose={handleClose}
      title="Create Menu Item"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {categoryName && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Adding item to: <span className="font-medium text-foreground">{categoryName}</span>
            </p>
          </div>
        )}
        
        <Input
          label="Item Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Chicken Biryani"
          error={errors.name}
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
          <label className="text-sm font-medium text-foreground mb-3 block">Tags</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={clsx(
                  'text-sm px-3 py-2 rounded-lg border transition-colors text-left',
                  formData.tagIds.includes(tag.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-muted'
                )}
              >
                <div className="flex items-center">
                  {tag.icon && <span className="mr-2">{tag.icon}</span>}
                  <span className="font-medium">{tag.name}</span>
                </div>
                <div className="text-xs opacity-70 mt-1 capitalize">{tag.type.replace('_', ' ')}</div>
              </button>
            ))}
          </div>
          
          {formData.tagIds.length > 0 && (
            <div className="mt-3 p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Selected tags:</p>
              <div className="flex flex-wrap gap-1">
                {formData.tagIds.map(tagId => {
                  const tag = availableTags.find(t => t.id === tagId)
                  if (!tag) return null
                  return (
                    <span
                      key={tag.id}
                      className="text-xs px-2 py-1 bg-background rounded-full flex items-center gap-1"
                    >
                      {tag.icon && <span>{tag.icon}</span>}
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.name.trim()}>
            Create Item
          </Button>
        </div>
      </form>
    </Modal>
  )
}