'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'
import { CategorySidebar } from '@/components/menu-editor/CategorySidebar'
import { MenuItemsView } from '@/components/menu-editor/MenuItemsView'
import { DragDropProvider } from '@/components/menu-editor/DragDropContext'
import { toast } from '@/components/ui/Toast'
import { 
  menuApi, 
  categoryApi, 
  menuItemApi, 
  tagApi,
  Menu, 
  Category, 
  MenuItem, 
  Tag 
} from '@/lib/api'
import { 
  ArrowLeftIcon,
  EyeIcon,
  ShareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function MenuEditor() {
  const router = useRouter()
  const params = useParams()
  const { userId } = useAuth()
  const menuId = params.id as string

  const [menu, setMenu] = useState<Menu | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    if (!userId || !menuId) return

    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load menu, categories, and tags in parallel
        const [menuResponse, tagsResponse] = await Promise.all([
          menuApi.getMenu(menuId),
          tagApi.getTags({ limit: 100 })
        ])

        setMenu(menuResponse.data)
        setCategories(menuResponse.data.categories || [])
        setAvailableTags(tagsResponse.data)

        // If there are categories, select the first one
        if (menuResponse.data.categories && menuResponse.data.categories.length > 0) {
          const firstCategory = menuResponse.data.categories[0]
          setSelectedCategoryId(firstCategory.id)
          loadMenuItems(firstCategory.id)
        }
      } catch (error) {
        console.error('Failed to load menu data:', error)
        toast.error('Failed to load menu')
        router.push('/home')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, menuId, router])

  // Load menu items for selected category
  const loadMenuItems = async (categoryId: string | null) => {
    if (!categoryId) {
      setMenuItems([])
      return
    }

    try {
      const response = await menuItemApi.getMenuItems({
        categoryId,
        limit: 100
      })
      setMenuItems(response.data)
    } catch (error) {
      console.error('Failed to load menu items:', error)
      toast.error('Failed to load menu items')
    }
  }

  // Handle category selection
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
    setSelectedItem(null)
    loadMenuItems(categoryId)
  }

  // Category CRUD operations
  const handleCreateCategory = async (data: {
    name: string
    description?: string
    parentCategoryId?: string
  }) => {
    try {
      const response = await categoryApi.createCategory({
        menuId,
        ...data
      })
      
      // Add to categories list
      setCategories(prev => [...prev, response.data])
      toast.success('Category created successfully')
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error('Failed to create category')
    }
  }

  const handleUpdateCategory = async (id: string, data: {
    name?: string
    description?: string
  }) => {
    try {
      const response = await categoryApi.updateCategory(id, data)
      
      // Update categories list
      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, ...response.data } : cat
      ))
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all items in it.')) {
      return
    }

    try {
      await categoryApi.deleteCategory(id)
      
      // Remove from categories list
      setCategories(prev => prev.filter(cat => cat.id !== id))
      
      // If deleted category was selected, clear selection
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null)
        setMenuItems([])
      }
      
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  // Menu Item CRUD operations
  const handleCreateMenuItem = async (data: {
    name: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => {
    if (!selectedCategoryId) return

    try {
      const response = await menuItemApi.createMenuItem({
        categoryId: selectedCategoryId,
        ...data
      })
      
      // Add to menu items list
      setMenuItems(prev => [...prev, response.data])
      toast.success('Menu item created successfully')
    } catch (error) {
      console.error('Failed to create menu item:', error)
      toast.error('Failed to create menu item')
    }
  }

  const handleUpdateMenuItem = async (id: string, data: {
    name?: string
    description?: string
    ingredients?: string
    tagIds?: string[]
  }) => {
    try {
      const response = await menuItemApi.updateMenuItem(id, data)
      
      // Update menu items list
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...response.data } : item
      ))
      
      // Update selected item if it's the one being edited
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, ...response.data })
      }
      
      toast.success('Menu item updated successfully')
    } catch (error) {
      console.error('Failed to update menu item:', error)
      toast.error('Failed to update menu item')
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return
    }

    try {
      await menuItemApi.deleteMenuItem(id)
      
      // Remove from menu items list
      setMenuItems(prev => prev.filter(item => item.id !== id))
      
      // Clear selection if deleted item was selected
      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }
      
      toast.success('Menu item deleted successfully')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const handleUploadImage = async (id: string, file: File) => {
    try {
      const response = await menuItemApi.uploadImage(id, file)
      
      // Update menu items list with new image URL
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, imageUrl: response.data.imageUrl } : item
      ))
      
      // Update selected item if it's the one with uploaded image
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, imageUrl: response.data.imageUrl })
      }
      
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image')
    }
  }

  // Get selected category name
  const selectedCategoryName = selectedCategoryId 
    ? categories.find(cat => cat.id === selectedCategoryId)?.name
    : undefined

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Menu not found</h2>
          <p className="text-muted-foreground mb-4">The menu you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/home')}>
            Go back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/home')}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="h-6 w-px bg-border" />
            
            <div>
              <h1 className="text-xl font-semibold text-foreground">{menu.name}</h1>
              <p className="text-sm text-muted-foreground">Menu Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/menus/${menuId}/preview`)}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (menu.shareToken) {
                  const shareUrl = `${window.location.origin}/share/${menu.shareToken}`
                  navigator.clipboard.writeText(shareUrl)
                  toast.success('Share link copied to clipboard!')
                }
              }}
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/menus/${menuId}/settings`)}
            >
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <DragDropProvider>
          {/* Categories Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategories={setCategories}
          />

          {/* Menu Items View */}
          <MenuItemsView
            menuItems={menuItems}
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={selectedCategoryName}
            availableTags={availableTags}
            onCreateMenuItem={handleCreateMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onUploadImage={handleUploadImage}
            onSelectItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </DragDropProvider>
      </div>
    </div>
  )
}