"use client"

import React, { useEffect, useState } from "react";
import { Category, categoryApi, Menu, menuApi, MenuItem, menuItemApi, Tag, tagApi} from "@/lib/api";
import { ChevronDown, ChevronUp, EllipsisVertical, Menu as MenuIcon, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { MenuItemCard } from "@/components/ui/MenuItemCard";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [menu,setMenu]=useState<Menu | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false)
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false)
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showGallery, setShowGallery] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: "",
    description: ""
  })
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: "",
    description: "",
    selectedSubCategoryId: "",
    selectedTags: [] as string[]
  })
  const [editMenuItemFormData, setEditMenuItemFormData] = useState({
    name: "",
    description: "",
    selectedTags: [] as string[]
  })
  const [editCategoryFormData, setEditCategoryFormData] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    const getCategories = async (menuId: string) => {
      try {
        const response = await categoryApi.getCategories({
          menuId: menuId,
          includeItems: true,
        })
        setCategories(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(null)
      }
    }
    const getCurrentMenu=async(menuId:string)=>{
      try{
        const response=await menuApi.getMenu(menuId)
        console.log(response.data,"menu")
        setMenu(response.data)
      }
      catch(error){
        console.error('Failed to fetch menu:', error)
        setMenu(null)
      }
    }

    const getTags = async () => {
      try {
        const response = await tagApi.getTags({ limit: 100 })
        setTags(response.data)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }

    getCategories(resolvedParams.id)
    getCurrentMenu(resolvedParams.id)
    getTags()
  }, [resolvedParams.id])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await categoryApi.createCategory({
        menuId: resolvedParams.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,

      })
      
      toast.success("Category created successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
      // Reset form and close modal
      setFormData({ name: "", description: "" })
      setIsAddModalOpen(false)
      
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error("Failed to create category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setEditMenuItemFormData({
      name: item.name,
      description: item.description || "",
      selectedTags: item.tags?.map(tag => tag.id) || []
    })
    setIsEditMenuItemModalOpen(true)
  }

  const handleImageUpload = async (item: MenuItem, file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`/api/menu-items/${item.id}/upload-image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      toast.success('Image uploaded successfully!')

      // Refresh categories to show updated image
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)

    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image. Please try again.')
    }
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setEditCategoryFormData({
      name: category.name,
      description: category.description || ""
    })
    setIsEditCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all sub-categories and menu items within it. This action cannot be undone.`)) {
      return
    }

    try {
      await categoryApi.deleteCategory(category.id)
      toast.success("Category deleted successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error("Failed to delete category. Please try again.")
    }
  }

  const handleDeleteSubCategory = async (subCategory: Category) => {
    if (!confirm(`Are you sure you want to delete "${subCategory.name}"? This will also delete all menu items within it. This action cannot be undone.`)) {
      return
    }

    try {
      await categoryApi.deleteCategory(subCategory.id)
      toast.success("Sub-category deleted successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
    } catch (error) {
      console.error('Failed to delete sub-category:', error)
      toast.error("Failed to delete sub-category. Please try again.")
    }
  }

  const handleDeleteMenuItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await menuItemApi.deleteMenuItem(item.id)
      toast.success("Menu item deleted successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast.error("Failed to delete menu item. Please try again.")
    }
  }

  const handleAddSubCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setIsAddSubCategoryModalOpen(true)
  }

  const handleAddMenuItem = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    const category = categories?.find(cat => cat.id === categoryId)
    
    // If category has sub-categories, reset the selectedSubCategoryId so user can choose
    if (category?.childCategories && category.childCategories.length > 0) {
      setMenuItemFormData(prev => ({ ...prev, selectedSubCategoryId: "", selectedTags: [] }))
    } else {
      // If no sub-categories, we'll add directly to the main category
      setMenuItemFormData(prev => ({ ...prev, selectedSubCategoryId: categoryId, selectedTags: [] }))
    }
    
    setIsAddMenuItemModalOpen(true)
  }

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subCategoryFormData.name.trim() || !selectedCategoryId) {
      toast.error("Sub-category name is required")
      return
    }

    setIsLoading(true)
    
    try {
      await categoryApi.createCategory({
        menuId: resolvedParams.id,
        name: subCategoryFormData.name.trim(),
        description: subCategoryFormData.description.trim() || undefined,
        parentCategoryId: selectedCategoryId,
      })
      
      toast.success("Sub-category created successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
      // Reset form and close modal
      setSubCategoryFormData({ name: "", description: "" })
      setIsAddSubCategoryModalOpen(false)
      setSelectedCategoryId(null)
      
    } catch (error) {
      console.error('Failed to create sub-category:', error)
      toast.error("Failed to create sub-category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!menuItemFormData.name.trim()) {
      toast.error("Menu item name is required")
      return
    }

    // Determine which category to add the item to
    const selectedCategory = categories?.find(cat => cat.id === selectedCategoryId)
    const targetCategoryId = selectedCategory?.childCategories && selectedCategory.childCategories.length > 0 
      ? menuItemFormData.selectedSubCategoryId 
      : selectedCategoryId

    if (!targetCategoryId) {
      toast.error("Please select a sub-category")
      return
    }

    setIsLoading(true)
    
    try {
      await menuItemApi.createMenuItem({
        categoryId: targetCategoryId,
        name: menuItemFormData.name.trim(),
        description: menuItemFormData.description.trim() || undefined,
        tagIds: menuItemFormData.selectedTags.length > 0 ? menuItemFormData.selectedTags : undefined,
      })
      
      toast.success("Menu item created successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
      // Reset form and close modal
      setMenuItemFormData({ name: "", description: "", selectedSubCategoryId: "", selectedTags: [] })
      setIsAddMenuItemModalOpen(false)
      setSelectedCategoryId(null)
      
    } catch (error) {
      console.error('Failed to create menu item:', error)
      toast.error("Failed to create menu item. Please try again.")
        } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editMenuItemFormData.name.trim() || !selectedMenuItem) {
      toast.error("Menu item name is required")
      return
    }

    setIsLoading(true)
    
    try {
      await menuItemApi.updateMenuItem(selectedMenuItem.id, {
        name: editMenuItemFormData.name.trim(),
        description: editMenuItemFormData.description.trim() || undefined,
        tagIds: editMenuItemFormData.selectedTags.length > 0 ? editMenuItemFormData.selectedTags : undefined,
      })
      
      toast.success("Menu item updated successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
      // Reset form and close modal
      setEditMenuItemFormData({ name: "", description: "", selectedTags: [] })
      setIsEditMenuItemModalOpen(false)
      setSelectedMenuItem(null)
      
    } catch (error) {
      console.error('Failed to update menu item:', error)
      toast.error("Failed to update menu item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editCategoryFormData.name.trim() || !selectedCategory) {
      toast.error("Category name is required")
      return
    }

    setIsLoading(true)
    
    try {
      await categoryApi.updateCategory(selectedCategory.id, {
        name: editCategoryFormData.name.trim(),
        description: editCategoryFormData.description.trim() || undefined,
      })
      
      toast.success("Category updated successfully!")
      
      // Refresh categories list
      const updatedCategories = await categoryApi.getCategories({
        menuId: resolvedParams.id,
        includeItems: true,
      })
      setCategories(updatedCategories.data)
      
      // Reset form and close modal
      setEditCategoryFormData({ name: "", description: "" })
      setIsEditCategoryModalOpen(false)
      setSelectedCategory(null)
      
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error("Failed to update category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Category reordering functions
  const moveCategoryUp = async (categoryId: string) => {
    if (!categories) return
    
    const currentIndex = categories.findIndex(cat => cat.id === categoryId)
    if (currentIndex <= 0) return // Already at top
    
    const newCategories = [...categories]
    const temp = newCategories[currentIndex]
    newCategories[currentIndex] = newCategories[currentIndex - 1]
    newCategories[currentIndex - 1] = temp
    
    setCategories(newCategories)
    await updateCategorySortOrder(newCategories)
  }

  const moveCategoryDown = async (categoryId: string) => {
    if (!categories) return
    
    const currentIndex = categories.findIndex(cat => cat.id === categoryId)
    if (currentIndex >= categories.length - 1) return // Already at bottom
    
    const newCategories = [...categories]
    const temp = newCategories[currentIndex]
    newCategories[currentIndex] = newCategories[currentIndex + 1]
    newCategories[currentIndex + 1] = temp
    
    setCategories(newCategories)
    await updateCategorySortOrder(newCategories)
  }

  // Sub-category reordering functions
  const moveSubCategoryUp = async (subCategoryId: string) => {
    if (!categories) return
    
    const updatedCategories = categories.map(cat => {
      if (cat.childCategories?.some(sub => sub.id === subCategoryId)) {
        const currentIndex = cat.childCategories.findIndex(sub => sub.id === subCategoryId)
        if (currentIndex <= 0) return cat // Already at top
        
        const newSubCategories = [...cat.childCategories]
        const temp = newSubCategories[currentIndex]
        newSubCategories[currentIndex] = newSubCategories[currentIndex - 1]
        newSubCategories[currentIndex - 1] = temp
        
        updateCategorySortOrder(newSubCategories)
        return { ...cat, childCategories: newSubCategories }
      }
      return cat
    })
    
    setCategories(updatedCategories)
  }

  const moveSubCategoryDown = async (subCategoryId: string) => {
    if (!categories) return
    
    const updatedCategories = categories.map(cat => {
      if (cat.childCategories?.some(sub => sub.id === subCategoryId)) {
        const currentIndex = cat.childCategories.findIndex(sub => sub.id === subCategoryId)
        if (currentIndex >= cat.childCategories.length - 1) return cat // Already at bottom
        
        const newSubCategories = [...cat.childCategories]
        const temp = newSubCategories[currentIndex]
        newSubCategories[currentIndex] = newSubCategories[currentIndex + 1]
        newSubCategories[currentIndex + 1] = temp
        
        updateCategorySortOrder(newSubCategories)
        return { ...cat, childCategories: newSubCategories }
      }
      return cat
    })
    
    setCategories(updatedCategories)
  }

  // Menu item reordering functions
  const moveMenuItemUp = async (itemId: string) => {
    if (!categories) return
    
    const updatedCategories = categories.map(cat => {
      // Check direct menu items
      if (cat.menuItems?.some(item => item.id === itemId)) {
        const currentIndex = cat.menuItems.findIndex(item => item.id === itemId)
        if (currentIndex <= 0) return cat // Already at top
        
        const newItems = [...cat.menuItems]
        const temp = newItems[currentIndex]
        newItems[currentIndex] = newItems[currentIndex - 1]
        newItems[currentIndex - 1] = temp
        
        updateMenuItemSortOrder(newItems)
        return { ...cat, menuItems: newItems }
      }
      
      // Check sub-category menu items
      const updatedChildCategories = cat.childCategories?.map(subCat => {
        if (subCat.menuItems?.some(item => item.id === itemId)) {
          const currentIndex = subCat.menuItems.findIndex(item => item.id === itemId)
          if (currentIndex <= 0) return subCat // Already at top
          
          const newItems = [...subCat.menuItems]
          const temp = newItems[currentIndex]
          newItems[currentIndex] = newItems[currentIndex - 1]
          newItems[currentIndex - 1] = temp
          
          updateMenuItemSortOrder(newItems)
          return { ...subCat, menuItems: newItems }
        }
        return subCat
      })
      
      return { ...cat, childCategories: updatedChildCategories }
    })
    
    setCategories(updatedCategories)
  }

  const moveMenuItemDown = async (itemId: string) => {
    if (!categories) return
    
    const updatedCategories = categories.map(cat => {
      // Check direct menu items
      if (cat.menuItems?.some(item => item.id === itemId)) {
        const currentIndex = cat.menuItems.findIndex(item => item.id === itemId)
        if (currentIndex >= cat.menuItems.length - 1) return cat // Already at bottom
        
        const newItems = [...cat.menuItems]
        const temp = newItems[currentIndex]
        newItems[currentIndex] = newItems[currentIndex + 1]
        newItems[currentIndex + 1] = temp
        
        updateMenuItemSortOrder(newItems)
        return { ...cat, menuItems: newItems }
      }
      
      // Check sub-category menu items
      const updatedChildCategories = cat.childCategories?.map(subCat => {
        if (subCat.menuItems?.some(item => item.id === itemId)) {
          const currentIndex = subCat.menuItems.findIndex(item => item.id === itemId)
          if (currentIndex >= subCat.menuItems.length - 1) return subCat // Already at bottom
          
          const newItems = [...subCat.menuItems]
          const temp = newItems[currentIndex]
          newItems[currentIndex] = newItems[currentIndex + 1]
          newItems[currentIndex + 1] = temp
          
          updateMenuItemSortOrder(newItems)
          return { ...subCat, menuItems: newItems }
        }
        return subCat
      })
      
      return { ...cat, childCategories: updatedChildCategories }
    })
    
    setCategories(updatedCategories)
  }

  // Function to get all images from menu items
  const getAllImages = (): Array<{item: MenuItem, imageUrl: string}> => {
    const images: Array<{item: MenuItem, imageUrl: string}> = []
    
    categories?.forEach(category => {
      // Check direct menu items
      category.menuItems?.forEach(item => {
        if (item.imageUrl) {
          images.push({ item, imageUrl: item.imageUrl })
        }
      })
      
      // Check sub-category menu items
      category.childCategories?.forEach(subCategory => {
        subCategory.menuItems?.forEach(item => {
          if (item.imageUrl) {
            images.push({ item, imageUrl: item.imageUrl })
          }
        })
      })
    })
    
    return images
  }

  // Gallery Component
  const GalleryComponent = () => {
    const images = getAllImages()
    
    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-white text-xl font-medium mb-2">No Images Yet</h3>
          <p className="text-gray-400 text-center">
            Upload images to your menu items to see them here
          </p>
        </div>
      )
    }
    
    return (
      <div className="p-6">
        <h2 className="text-white text-lg font-bold mb-4">
          All Images ({images.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(({ item, imageUrl }, index) => (
            <div key={`${item.id}-${index}`} className="bg-zinc-800 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate">
                  {item.name}
                </h3>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.icon && <span className="mr-1">{tag.icon}</span>}
                        {tag.name}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{item.tags.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const updateCategorySortOrder = async (categories: Category[]) => {
    try {
      const updatePromises = categories.map((category, index) =>
        categoryApi.updateCategory(category.id, { sortOrder: index })
      )
      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Failed to update category sort order:', error)
      toast.error('Failed to update category order')
    }
  }

  const updateMenuItemSortOrder = async (menuItems: MenuItem[]) => {
    try {
      const updatePromises = menuItems.map((item, index) =>
        menuItemApi.updateMenuItem(item.id, { sortOrder: index })
      )
      await Promise.all(updatePromises)
    } catch (error) {
      console.error('Failed to update menu item sort order:', error)
      toast.error('Failed to update menu item order')
    }
  }
   
  // Category Component with Up/Down buttons
  const CategoryComponent = ({ category, categoryIndex }: { category: Category, categoryIndex: number }) => {
    const isExpanded = expandedCategories.has(category.id)
    const hasSubcategories = category.childCategories && category.childCategories.length > 0
    const hasDirectItems = category.menuItems && category.menuItems.length > 0

    return (
      <div className="no-select">
        <div>
          {/* Main Category Header */}
          <div className="flex flex-col px-6 py-4 gap-4 relative">
            {/* Red border for every category */}
            <div className="bg-red-500 w-1 h-6 rounded-tr-lg rounded-br-lg absolute top-5 left-0"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-bold tracking-wide">
                  {category.name} ({(category._count?.menuItems || 0) + (category.childCategories?.reduce((sum, child) => sum + (child._count?.menuItems || 0), 0) || 0)})
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row gap-2">
                {/* Up/Down buttons for category reordering */}
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => moveCategoryUp(category.id)}
                    disabled={categoryIndex === 0}
                    className={`text-white hover:text-gray-300 transition-colors ${categoryIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => moveCategoryDown(category.id)}
                    disabled={categories ? categoryIndex === categories.length - 1 : true}
                    className={`text-white hover:text-gray-300 transition-colors ${categories && categoryIndex === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => handleEditCategory(category)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleCategory(category.id)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                 {isExpanded ? (
                   <ChevronUp className="w-4 h-4" />
                 ) : (
                   <ChevronDown className="w-4 h-4" />
                 )}
               </button>
              </div>
            </div>

            {/* Show content when expanded */}
            {isExpanded && (
              <div>
                <div className="border-b-1 border-slate-300 mb-4"></div>
                
                {/* Sub-categories */}
                {hasSubcategories && (
                  <div className="space-y-4 mb-4">
                    {category.childCategories?.map((subCategory, subIndex) => (
                      <SubCategoryComponent 
                        key={subCategory.id} 
                        subCategory={subCategory} 
                        subIndex={subIndex}
                        totalSubCategories={category.childCategories?.length || 0}
                      />
                    ))}
                  </div>
                )}

                {/* Direct menu items (if no sub-categories) */}
                {hasDirectItems && !hasSubcategories && (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {category.menuItems?.map((item, itemIndex) => (
                      <MenuItemComponent 
                        key={item.id} 
                        item={item} 
                        itemIndex={itemIndex}
                        totalItems={category.menuItems?.length || 0}
                      />
                    ))}
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4 justify-center overflow-hidden">
                  <button 
                    onClick={() => handleAddSubCategory(category.id)}
                    className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded text-sm font-medium transition-colors w-full"
                  >
                    + Add-sub-category
                  </button>
                  <button 
                    onClick={() => handleAddMenuItem(category.id)}
                    className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded text-sm font-medium transition-colors w-full"
                  >
                    + Add item
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-2 bg-zinc-700"></div>
        </div>
      </div>
    )
  }

  // SubCategory Component with Up/Down buttons
  const SubCategoryComponent = ({ subCategory, subIndex, totalSubCategories }: { 
    subCategory: Category, 
    subIndex: number, 
    totalSubCategories: number 
  }) => {
    return (
      <div className="pl-4 no-select">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-white text-sm font-bold tracking-wide">
              {subCategory.name.split('').join(' ').toUpperCase()} ({subCategory._count?.menuItems || 0})
            </div>
          </div>
          <div className="flex gap-2">
            {/* Up/Down buttons for sub-category reordering */}
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveSubCategoryUp(subCategory.id)}
                disabled={subIndex === 0}
                className={`text-white hover:text-gray-300 transition-colors ${subIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button 
                onClick={() => moveSubCategoryDown(subCategory.id)}
                disabled={subIndex === totalSubCategories - 1}
                className={`text-white hover:text-gray-300 transition-colors ${subIndex === totalSubCategories - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <button 
              onClick={() => handleDeleteSubCategory(subCategory)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
       
        {/* Menu items in sub-category */}
        {subCategory.menuItems && subCategory.menuItems.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {subCategory.menuItems.map((item, itemIndex) => (
              <MenuItemComponent 
                key={item.id} 
                item={item} 
                itemIndex={itemIndex}
                totalItems={subCategory.menuItems?.length || 0}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // MenuItem Component with Up/Down buttons
  const MenuItemComponent = ({ item, itemIndex, totalItems }: { 
    item: MenuItem, 
    itemIndex: number, 
    totalItems: number 
  }) => {
    return (
      <div className="relative no-select">
        <div className="flex items-center gap-2 border-b-1 border-slate-300">
          {/* Up/Down buttons for menu item reordering */}
          <div className="flex flex-col gap-1 py-2">
            <button 
              onClick={() => moveMenuItemUp(item.id)}
              disabled={itemIndex === 0}
              className={`text-white hover:text-gray-300 transition-colors ${itemIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button 
              onClick={() => moveMenuItemDown(item.id)}
              disabled={itemIndex === totalItems - 1}
              className={`text-white hover:text-gray-300 transition-colors ${itemIndex === totalItems - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1">
            <MenuItemCard 
              item={item} 
              onEdit={handleEditMenuItem}
              onDelete={handleDeleteMenuItem}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1E1E1E] min-h-screen w-full dark static select-none">

      <header className="flex flex-col gap-3 p-2 border-b-1 border-slate-300">
        <div className="flex justify-between">
          <span className="text-sky-50 text-xl font-bold">Menu</span>
      
          <div className="flex gap-4">
            <Search className="w-6 h-6  text-sky-50" />
            <ImageIcon className="w-6 h-6 text-sky-50" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sky-50 font-bold text-2xl">{menu?.name}</span>
          <span className="text-sky-50 font-medium text-sm ">{menu?.description}</span>
        </div>
      </header>

      {/* Category main div */}
      <div className="pb-32">
        {categories === null ? (
          <div className="text-white text-center py-8">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-white text-center py-8">No categories found</div>
        ) : (
          <div>
            {categories.map((category, categoryIndex) => (
              <CategoryComponent key={category.id} category={category} categoryIndex={categoryIndex} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white rounded-md px-3 py-2 flex items-center gap-1 shadow-lg border border-gray-200 hover:bg-gray-100 transition no-select touch-manipulation"
          >
            <Plus className="w-4 h-4 text-black" />
            <span className="text-black font-semibold">ADD</span>
          </button>

          <button className="bg-black rounded-md px-3 py-2 flex items-center gap-1 shadow-lg border border-gray-200 hover:bg-gray-100 transition no-select touch-manipulation">
            <MenuIcon className="w-4 h-4 text-sky-50" />
            <span className="text-sky-50 font-semibold">MENU</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter category description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
          />
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white" 
              variant="primary"
              isLoading={isLoading}
            >
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Sub-Category Modal */}
      <Modal
        isOpen={isAddSubCategoryModalOpen}
        onClose={() => setIsAddSubCategoryModalOpen(false)}
        title="Add New Sub-Category"
        size="md"
      >
        <form onSubmit={handleCreateSubCategory} className="space-y-4">
          <Input
            label="Sub-Category Name"
            placeholder="Enter sub-category name"
            value={subCategoryFormData.name}
            onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter sub-category description"
            value={subCategoryFormData.description}
            onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddSubCategoryModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white" 
              variant="primary"
              isLoading={isLoading}
            >
              Create Sub-Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Menu Item Modal */}
      <Modal
        isOpen={isAddMenuItemModalOpen}
        onClose={() => setIsAddMenuItemModalOpen(false)}
        title="Add New Menu Item"
        size="md"
      >
        <form onSubmit={handleCreateMenuItem} className="space-y-4">
          {/* Sub-category dropdown - only show if selected category has sub-categories */}
          {selectedCategoryId && categories?.find(cat => cat.id === selectedCategoryId)?.childCategories && categories.find(cat => cat.id === selectedCategoryId)!.childCategories!.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Select Sub-Category *
              </label>
              <select
                value={menuItemFormData.selectedSubCategoryId}
                onChange={(e) => setMenuItemFormData(prev => ({ ...prev, selectedSubCategoryId: e.target.value }))}
                className="w-full h-10 px-3 py-2 text-sm text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="">Choose a sub-category...</option>
                {categories.find(cat => cat.id === selectedCategoryId)?.childCategories?.map(subCat => (
                  <option key={subCat.id} value={subCat.id}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Menu Item Name"
            placeholder="Enter menu item name"
            value={menuItemFormData.name}
            onChange={(e) => setMenuItemFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter menu item description"
            value={menuItemFormData.description}
            onChange={(e) => setMenuItemFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />

          {/* Tags Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tags (Optional)
            </label>
            <div className="relative">
              <select
                multiple
                value={menuItemFormData.selectedTags}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                  setMenuItemFormData(prev => ({ ...prev, selectedTags: selectedOptions }))
                }}
                className="w-full min-h-[120px] px-3 py-2 text-sm text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {tags.map(tag => (
                  <option 
                    key={tag.id} 
                    value={tag.id}
                    className="py-2 px-2"
                  >
                    {tag.icon ? `${tag.icon} ${tag.name}` : tag.name} ({tag.type})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Hold Ctrl/Cmd to select multiple tags
              </p>
            </div>
            
            {/* Selected Tags Display */}
            {menuItemFormData.selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-gray-500">Selected:</span>
                {menuItemFormData.selectedTags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId)
                  return tag ? (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.icon && <span>{tag.icon}</span>}
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => {
                          setMenuItemFormData(prev => ({
                            ...prev,
                            selectedTags: prev.selectedTags.filter(id => id !== tagId)
                          }))
                        }}
                        className="ml-1 text-white/70 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddMenuItemModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white" 
              variant="primary"
              isLoading={isLoading}
            >
              Create Menu Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Menu Item Modal */}
      <Modal
        isOpen={isEditMenuItemModalOpen}
        onClose={() => setIsEditMenuItemModalOpen(false)}
        title="Edit Menu Item"
        size="md"
      >
        <form onSubmit={handleUpdateMenuItem} className="space-y-4">
          <Input
            label="Menu Item Name"
            placeholder="Enter menu item name"
            value={editMenuItemFormData.name}
            onChange={(e) => setEditMenuItemFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter menu item description"
            value={editMenuItemFormData.description}
            onChange={(e) => setEditMenuItemFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />

          {/* Tags Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tags (Optional)
            </label>
            <div className="relative">
              <select
                multiple
                value={editMenuItemFormData.selectedTags}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                  setEditMenuItemFormData(prev => ({ ...prev, selectedTags: selectedOptions }))
                }}
                className="w-full min-h-[120px] px-3 py-2 text-sm text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {tags.map(tag => (
                  <option 
                    key={tag.id} 
                    value={tag.id}
                    className="py-2 px-2"
                  >
                    {tag.icon ? `${tag.icon} ${tag.name}` : tag.name} ({tag.type})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Hold Ctrl/Cmd to select multiple tags
              </p>
            </div>
            
            {/* Selected Tags Display */}
            {editMenuItemFormData.selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-gray-500">Selected:</span>
                {editMenuItemFormData.selectedTags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId)
                  return tag ? (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.icon && <span>{tag.icon}</span>}
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => {
                          setEditMenuItemFormData(prev => ({
                            ...prev,
                            selectedTags: prev.selectedTags.filter(id => id !== tagId)
                          }))
                        }}
                        className="ml-1 text-white/70 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMenuItemModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white" 
              variant="primary"
              isLoading={isLoading}
            >
              Update Menu Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        title="Edit Category"
        size="md"
      >
        <form onSubmit={handleUpdateCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={editCategoryFormData.name}
            onChange={(e) => setEditCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter category description"
            value={editCategoryFormData.description}
            onChange={(e) => setEditCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditCategoryModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white" 
              variant="primary"
              isLoading={isLoading}
            >
              Update Category
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
