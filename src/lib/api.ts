// API utilities for menu management
const API_BASE = '/api'

export interface Menu {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  shareToken: string | null
  userId: string
  userEmail: string
  createdAt: string
  updatedAt: string
  _count?: {
    categories: number
  }
}

export interface Category {
  id: string
  menuId: string
  parentCategoryId: string | null
  name: string
  description: string | null
  sortOrder: number
  isActive: boolean
  hasSubcategories: boolean
  createdAt: string
  updatedAt: string
  childCategories?: Category[]
  menuItems?: MenuItem[]
  _count?: {
    menuItems: number
    childCategories: number
  }
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string | null
  ingredients: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags?: Tag[]
}

export interface Tag {
  id: string
  name: string
  type: 'dietary' | 'highlight' | 'cuisine' | 'spice_level'
  color: string
  icon: string | null
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// Menu API functions
export const menuApi = {
  // Get all menus
  getMenus: async (params?: {
    page?: number
    limit?: number
    search?: string
    isPublic?: boolean
  }): Promise<PaginatedResponse<Menu>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.isPublic !== undefined) searchParams.set('isPublic', params.isPublic.toString())

    const response = await fetch(`${API_BASE}/menus?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch menus')
    return response.json()
  },

  // Get single menu
  getMenu: async (id: string): Promise<ApiResponse<Menu & { categories: Category[] }>> => {
    const response = await fetch(`${API_BASE}/menus/${id}`)
    if (!response.ok) throw new Error('Failed to fetch menu')
    return response.json()
  },

  // Create menu
  createMenu: async (data: {
    name: string
    description?: string
    isPublic?: boolean
  }): Promise<ApiResponse<Menu>> => {
    const response = await fetch(`${API_BASE}/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create menu')
    return response.json()
  },

  // Update menu
  updateMenu: async (id: string, data: {
    name?: string
    description?: string
    isPublic?: boolean
  }): Promise<ApiResponse<Menu>> => {
    const response = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update menu')
    return response.json()
  },

  // Delete menu
  deleteMenu: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete menu')
    return response.json()
  }
}

// Category API functions
export const categoryApi = {
  // Get categories
  getCategories: async (params: {
    menuId: string
    parentCategoryId?: string
    includeItems?: boolean
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Category>> => {
    const searchParams = new URLSearchParams()
    searchParams.set('menuId', params.menuId)
    if (params.parentCategoryId) searchParams.set('parentCategoryId', params.parentCategoryId)
    if (params.includeItems) searchParams.set('includeItems', 'true')
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`${API_BASE}/categories?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  // Create category
  createCategory: async (data: {
    menuId: string
    name: string
    description?: string
    parentCategoryId?: string
    sortOrder?: number
  }): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  },

  // Update category
  updateCategory: async (id: string, data: {
    name?: string
    description?: string
    sortOrder?: number
    isActive?: boolean
  }): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update category')
    return response.json()
  },

  // Delete category
  deleteCategory: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete category')
    return response.json()
  }
}

// Menu Item API functions
export const menuItemApi = {
  // Get menu items
  getMenuItems: async (params?: {
    categoryId?: string
    tagIds?: string[]
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<MenuItem>> => {
    const searchParams = new URLSearchParams()
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params?.tagIds?.length) {
      params.tagIds.forEach(id => searchParams.append('tagIds', id))
    }
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`${API_BASE}/menu-items?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch menu items')
    return response.json()
  },

  // Create menu item
  createMenuItem: async (data: {
    categoryId: string
    name: string
    description?: string
    ingredients?: string
    sortOrder?: number
    tagIds?: string[]
  }): Promise<ApiResponse<MenuItem>> => {
    const response = await fetch(`${API_BASE}/menu-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create menu item')
    return response.json()
  },

  // Update menu item
  updateMenuItem: async (id: string, data: {
    name?: string
    description?: string
    ingredients?: string
    sortOrder?: number
    isActive?: boolean
    tagIds?: string[]
  }): Promise<ApiResponse<MenuItem>> => {
    const response = await fetch(`${API_BASE}/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update menu item')
    return response.json()
  },

  // Delete menu item
  deleteMenuItem: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/menu-items/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete menu item')
    return response.json()
  },

  // Upload image
  uploadImage: async (id: string, file: File): Promise<ApiResponse<MenuItem>> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE}/menu-items/${id}/upload-image`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) throw new Error('Failed to upload image')
    return response.json()
  }
}

// Tag API functions
export const tagApi = {
  // Get tags
  getTags: async (params?: {
    type?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Tag>> => {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const response = await fetch(`${API_BASE}/tags?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch tags')
    return response.json()
  },

  // Create tag
  createTag: async (data: {
    name: string
    type: 'dietary' | 'highlight' | 'cuisine' | 'spice_level'
    color?: string
    icon?: string
  }): Promise<ApiResponse<Tag>> => {
    const response = await fetch(`${API_BASE}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create tag')
    return response.json()
  }
}