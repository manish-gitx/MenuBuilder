import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createMenuItemSchema, menuItemQuerySchema } from '@/lib/validations'
import { successResponse, paginatedResponse, errorResponse, handleError, formatMenuItemResponse, defaultMenuItemInclude, validateCategoryCanAcceptItems } from '@/lib/utils'

// GET /api/menu-items - Get menu items with filtering and pagination
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
    
    const validatedQuery = menuItemQuerySchema.parse(queryParams)
    
    const where: any = {
      category: {
        menu: {
          userId: userId // Only show items from user's menus
        }
      }
    }
    
    if (validatedQuery.categoryId) {
      where.categoryId = validatedQuery.categoryId
    }
    
    if (validatedQuery.search) {
      where.OR = [
        { name: { contains: validatedQuery.search, mode: 'insensitive' } },
        { description: { contains: validatedQuery.search, mode: 'insensitive' } },
        { ingredients: { contains: validatedQuery.search, mode: 'insensitive' } }
      ]
    }
    
    if (validatedQuery.tagIds && validatedQuery.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: validatedQuery.tagIds
          }
        }
      }
    }
    
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    
    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        skip,
        take: validatedQuery.limit,
        orderBy: { sortOrder: 'asc' },
        include: defaultMenuItemInclude
      }),
      prisma.menuItem.count({ where })
    ])
    
    const formattedItems = menuItems.map(formatMenuItemResponse)
    
    return paginatedResponse(formattedItems, {
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      total
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/menu-items - Create a new menu item
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
    const validatedData = createMenuItemSchema.parse(body)
    
    // Check if category exists and can accept menu items
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
      include: {
        menu: {
          select: {
            userId: true
          }
        }
      }
    })
    
    if (!category) {
      return errorResponse('Category not found', 404)
    }
    
    // Check if the menu belongs to the current user
    if (category.menu.userId !== userId) {
      return errorResponse('Unauthorized', 403)
    }
    
    const canAcceptItems = await validateCategoryCanAcceptItems(prisma, validatedData.categoryId)
    if (!canAcceptItems) {
      return errorResponse('Cannot add menu items to a category that has subcategories', 400)
    }
    
    // Create menu item
    const { tagIds, ...menuItemData } = validatedData
    
    const menuItem = await prisma.menuItem.create({
      data: menuItemData,
      include: defaultMenuItemInclude
    })
    
    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      await prisma.menuItemTag.createMany({
        data: tagIds.map(tagId => ({
          menuItemId: menuItem.id,
          tagId
        }))
      })
      
      // Fetch the updated menu item with tags
      const updatedMenuItem = await prisma.menuItem.findUnique({
        where: { id: menuItem.id },
        include: defaultMenuItemInclude
      })
      
      return successResponse(formatMenuItemResponse(updatedMenuItem), 'Menu item created successfully')
    }
    
    return successResponse(formatMenuItemResponse(menuItem), 'Menu item created successfully')
  } catch (error) {
    return handleError(error)
  }
} 