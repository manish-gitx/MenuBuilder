import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { menuApi } from '@/lib/api'
import { toast } from '@/components/ui/Toast'

interface CreateMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateMenuModal({ isOpen, onClose, onSuccess }: CreateMenuModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Menu name is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await menuApi.createMenu({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic
      })
      
      toast.success('Menu created successfully!')
      setFormData({ name: '', description: '', isPublic: false })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to create menu:', error)
      toast.error('Failed to create menu. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', description: '', isPublic: false })
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Menu"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Menu Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Wedding Catering Menu"
          error={errors.name}
          disabled={isLoading}
        />
        
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of your menu..."
          rows={3}
          disabled={isLoading}
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            disabled={isLoading}
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
            Make this menu public
          </label>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            Create Menu
          </Button>
        </div>
      </form>
    </Modal>
  )
}