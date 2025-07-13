import { z } from 'zod'

// Menu validation schemas
export const createMenuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
})

export const updateMenuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
})

// Category validation schemas
export const createCategorySchema = z.object({
  menuId: z.string().uuid('Menu ID must be a valid UUID'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  parentCategoryId: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0).optional()
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
})

// MenuItem validation schemas
export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  tagIds: z.array(z.string().uuid()).optional()
})

export const updateMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional()
})

// Tag validation schemas
export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['dietary', 'highlight', 'cuisine', 'spice_level'], {
    message: 'Type must be one of: dietary, highlight, cuisine, spice_level'
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional(),
  icon: z.string().optional()
})

export const updateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  type: z.enum(['dietary', 'highlight', 'cuisine', 'spice_level'], {
    message: 'Type must be one of: dietary, highlight, cuisine, spice_level'
  }).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional(),
  icon: z.string().optional()
})

// Query parameter validation
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10)
})

export const menuQuerySchema = z.object({
  isPublic: z.coerce.boolean().optional(),
  search: z.string().optional()
}).merge(paginationSchema)

export const categoryQuerySchema = z.object({
  menuId: z.string().uuid(),
  parentCategoryId: z.string().uuid().optional(),
  includeItems: z.coerce.boolean().default(false)
}).merge(paginationSchema)

export const menuItemQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  search: z.string().optional()
}).merge(paginationSchema)

export const tagQuerySchema = z.object({
  type: z.enum(['dietary', 'highlight', 'cuisine', 'spice_level']).optional(),
  search: z.string().optional()
}).merge(paginationSchema)

// Share token validation
export const shareTokenSchema = z.object({
  token: z.string().min(1, 'Share token is required')
})

// Common UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format')

// Type exports
export type CreateMenuInput = z.infer<typeof createMenuSchema>
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type MenuQueryInput = z.infer<typeof menuQuerySchema>
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>
export type MenuItemQueryInput = z.infer<typeof menuItemQuerySchema>
export type TagQueryInput = z.infer<typeof tagQuerySchema> 