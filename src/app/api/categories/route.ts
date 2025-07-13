import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createCategorySchema, categoryQuerySchema } from '@/lib/validations'
import { successResponse, paginatedResponse, errorResponse, handleError, formatCategoryResponse, defaultCategoryInclude, validateCategoryCanAcceptSubcategories } from '@/lib/utils'

// GET /api/categories - Get categories with hierarchical structure
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = categoryQuerySchema.parse(queryParams)
    
    // Verify the menu belongs to the current user
    const menu = await prisma.menu.findUnique({
      where: { 
        id: validatedQuery.menuId,
        userId: userId 
      }
    })
    
    if (!menu) {
      return errorResponse('Menu not found or unauthorized', 404)
    }
    
    const where: Record<string, unknown> = {
      menuId: validatedQuery.menuId
    }
    
    if (validatedQuery.parentCategoryId) {
      where.parentCategoryId = validatedQuery.parentCategoryId
    } else {
      // If no parent specified, get root categories
      where.parentCategoryId = null
    }
    
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: validatedQuery.limit,
        orderBy: { sortOrder: 'asc' },
        include: validatedQuery.includeItems ? defaultCategoryInclude : {
          childCategories: {
            include: {
              childCategories: true
            }
          }
        }
      }),
      prisma.category.count({ where })
    ])
    
    const formattedCategories = categories.map(formatCategoryResponse)
    
    return paginatedResponse(formattedCategories, {
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      total
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)
    
    // Verify the menu belongs to the current user
    const menu = await prisma.menu.findUnique({
      where: { 
        id: validatedData.menuId,
        userId: userId 
      }
    })
    
    if (!menu) {
      return errorResponse('Menu not found or unauthorized', 404)
    }
    
    // Check if parent category exists and can accept subcategories
    if (validatedData.parentCategoryId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentCategoryId }
      })
      
      if (!parentCategory) {
        return errorResponse('Parent category not found', 404)
      }
      
      if (parentCategory.menuId !== validatedData.menuId) {
        return errorResponse('Parent category must be in the same menu', 400)
      }
      
      const canAcceptSubcategories = await validateCategoryCanAcceptSubcategories(prisma, validatedData.parentCategoryId)
      if (!canAcceptSubcategories) {
        return errorResponse('Cannot add subcategories to a category that has menu items', 400)
      }
      
      // Update parent category to indicate it now has subcategories
      await prisma.category.update({
        where: { id: validatedData.parentCategoryId },
        data: { hasSubcategories: true }
      })
    }
    
    const category = await prisma.category.create({
      data: validatedData,
      include: defaultCategoryInclude
    })
    
    return successResponse(formatCategoryResponse(category), 'Category created successfully')
  } catch (error) {
    return handleError(error)
  }
} 