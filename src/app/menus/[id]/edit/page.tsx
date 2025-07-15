"use client"

import React, { useEffect, useState } from "react";
import { Category, categoryApi, Menu, menuApi} from "@/lib/api";
import { ChevronDown, ChevronUp, EllipsisVertical, Menu as MenuIcon, Plus, Search } from "lucide-react";
import { Image } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [menu,setMenu]=useState<Menu | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    const getCategories = async (menuId: string) => {
      try {
        const response = await categoryApi.getCategories({
          menuId: menuId,
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

    getCategories(resolvedParams.id)
    getCurrentMenu(resolvedParams.id)
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
  
  return (
    <div className="bg-zinc-950  w-screen h-screen dark static">

      <header className="flex flex-col gap-3 p-2 border-b-1 border-slate-300">
        <div className="flex justify-between">
          <span className="text-sky-50 text-xl font-bold">Menu</span>
      
          <div className="flex gap-4">
            <Search className="w-6 h-6  text-sky-50" />
            <Image className="w-6 h-6 text-sky-50" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sky-50 font-bold text-2xl">{menu?.name}</span>
          <span className="text-sky-50 font-medium text-sm ">{menu?.description}</span>
        </div>
      </header>

      {/* Category main div */}
      <div>
  {categories === null ? (
    <div className="text-white text-center py-8">Loading categories...</div>
  ) : categories.length === 0 ? (
    <div className="text-white text-center py-8">No categories found</div>
  ) : (
    categories.map((category) => {
      const isExpanded = expandedCategories.has(category.id)
      return (
        <div key={category.id}>
          <div className="flex flex-col px-6 py-4 gap-4 relative">
            {/* Red border for every category */}
            <div className="bg-red-500 w-1 h-6 rounded-tr-lg rounded-br-lg absolute top-5 left-0"></div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold tracking-wide">
                {category.name} ({category._count?.menuItems || 0})
              </span>

              {/* Chevron with click handler */}
              <div className="flex flex-row gap-2">
                <EllipsisVertical className="text-white w-4 h-4" />
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

            {/* Show buttons when expanded */}
            {isExpanded && (
<div>
  <div className="border-b-1 border-slate-300 mb-4">
    </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2 justify-center  overflow-hidden">
                <button className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded text-sm font-medium transition-colors w-full">
                  + Add-sub-category
                </button>
                <button className="bg-white hover:bg-gray-100 text-black px-3 py-1 rounded text-sm font-medium transition-colors w-full">
                  + Add item
                </button>
              </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-2 bg-zinc-700"></div>
        </div>
      )
    })
  )}
</div>



      <div className="absolute bottom-3 right-3">
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white rounded-md px-3 py-2 flex items-center gap-1 shadow border border-gray-200 hover:bg-gray-100 transition "
          >
            <Plus className="w-4 h-4 text-black" />
            <span className="text-black font-semibold">ADD</span>
          </button>

          <button className="bg-black rounded-md px-3 py-2 flex items-center gap-1 shadow border border-gray-200 hover:bg-gray-100 transition">
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

    </div>
  )
}
