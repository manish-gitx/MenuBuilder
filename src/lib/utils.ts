import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { Category } from './api'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
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
    const validationErrors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
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
export async function validateCategoryCanAcceptItems(prisma: any, categoryId: string): Promise<boolean> {
  // Check if category has subcategories
  const hasSubcategories = await prisma.category.findFirst({
    where: { parentCategoryId: categoryId }
  })
  
  return !hasSubcategories
}

export async function validateCategoryCanAcceptSubcategories(prisma: any, categoryId: string): Promise<boolean> {
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
      },
      _count: {
        select: {
          menuItems: true
        }
      }
    }
  },
  _count: {
    select: {
      menuItems: true,
      childCategories: true
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
export function formatMenuItemResponse(item: any) {
  return {
    ...item,
    tags: item.tags?.map((tagRelation: any) => tagRelation.tag) || []
  }
}

// Format category with nested structure
export function formatCategoryResponse(category: any) {
  return {
    ...category,
    menuItems: category.menuItems?.map(formatMenuItemResponse) || [],
    childCategories: category.childCategories?.map(formatCategoryResponse) || []
  }
}

// Format complete menu response
export function formatMenuResponse(menu: any) {
  return {
    ...menu,
    // categories: menu.categories?.map(formatCategoryResponse) || []
  }
} 

const sortByOrder = <T extends { sortOrder: number }>(arr: T[]): T[] => {
  if (!arr) return [];
  // Create a shallow copy using the spread operator `[...arr]`
  // before sorting to avoid modifying the original array.
  return [...arr].sort((a, b) => a.sortOrder - b.sortOrder);
};


/**
 * Sorts the entire menu structure recursively: categories, sub-categories, and menu items.
 * @param categories The raw array of categories from your API.
 * @returns A new, fully sorted array of categories.
 */
export const sortFullMenu = (categories: Category[]): Category[] => {
  // 1. Sort the top-slevel categories
  const sortedTopLevelCategories = sortByOrder(categories);

  // 2. Iterate through each sorted category to sort its children
  return sortedTopLevelCategories.map(category => {
    // Create a new category object to ensure immutability
    const newCategory = { ...category };

    // 3. Sort the direct menuItems of the category (if any)
    if (newCategory.menuItems) {
      newCategory.menuItems = sortByOrder(newCategory.menuItems);
    }

    // 4. Sort the childCategories (sub-categories)
    if (newCategory.childCategories) {
      const sortedSubCategories = sortByOrder(newCategory.childCategories);

      // 5. For each sub-category, sort its menuItems
      newCategory.childCategories = sortedSubCategories.map(subCategory => {
        const newSubCategory = { ...subCategory };
        if (newSubCategory.menuItems) {
          newSubCategory.menuItems = sortByOrder(newSubCategory.menuItems);
        }
        return newSubCategory;
      });
    }

    return newCategory;
  });
};