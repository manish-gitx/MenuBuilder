import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// Success response helper
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

// Paginated response helper
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): NextResponse<PaginatedResponse<T[]>> {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrevious: pagination.page > 1
    }
  })
}

// Error response helper
export function errorResponse(error: string, statusCode: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status: statusCode })
}

// Handle different types of errors
export function handleError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((err: { path: (string | number)[]; message: string }) => `${err.path.join('.')}: ${err.message}`).join(', ')
    return errorResponse(`Validation error: ${validationErrors}`, 400)
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return errorResponse('A record with this value already exists', 409)
      case 'P2025':
        return errorResponse('Record not found', 404)
      case 'P2003':
        return errorResponse('Foreign key constraint failed', 400)
      case 'P2014':
        return errorResponse('Invalid relation', 400)
      default:
        return errorResponse('Database error occurred', 500)
    }
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse('Internal server error', 500)
}

// Generate random share token
export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Business logic validation helpers
export async function validateCategoryCanAcceptItems(prisma: { category: { findFirst: (args: { where: { parentCategoryId: string } }) => Promise<unknown> } }, categoryId: string): Promise<boolean> {
  // Check if category has subcategories
  const hasSubcategories = await prisma.category.findFirst({
    where: { parentCategoryId: categoryId }
  })
  
  return !hasSubcategories
}

export async function validateCategoryCanAcceptSubcategories(prisma: { menuItem: { findFirst: (args: { where: { categoryId: string } }) => Promise<unknown> } }, categoryId: string): Promise<boolean> {
  // Check if category has menu items
  const hasMenuItems = await prisma.menuItem.findFirst({
    where: { categoryId }
  })
  
  return !hasMenuItems
}

// Common query options for including relations
export const defaultMenuInclude = {
  categories: {
    include: {
      menuItems: {
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      },
      childCategories: {
        include: {
          menuItems: {
            include: {
              tags: {
                include: {
                  tag: true
                }
              }
            }
          }
        }
      }
    }
  }
}

export const defaultCategoryInclude = {
  menuItems: {
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  },
  childCategories: {
    include: {
      menuItems: {
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      }
    }
  }
}

export const defaultMenuItemInclude = {
  tags: {
    include: {
      tag: true
    }
  },
  category: {
    select: {
      id: true,
      name: true,
      menuId: true
    }
  }
}

// Format menu item with tags for response
export function formatMenuItemResponse(item: Record<string, unknown>) {
  return {
    ...item,
    tags: (item.tags as { tag: unknown }[])?.map((tagRelation: { tag: unknown }) => tagRelation.tag) || []
  }
}

// Format category with nested structure
export function formatCategoryResponse(category: Record<string, unknown>) {
  return {
    ...category,
    menuItems: (category.menuItems as Record<string, unknown>[])?.map(formatMenuItemResponse) || [],
    childCategories: (category.childCategories as Record<string, unknown>[])?.map(formatCategoryResponse) || []
  }
}

// Format complete menu response
export function formatMenuResponse(menu: Record<string, unknown>) {
  return {
    ...menu,
    categories: (menu.categories as Record<string, unknown>[])?.map(formatCategoryResponse) || []
  }
} 