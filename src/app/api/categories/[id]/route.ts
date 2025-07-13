import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { updateCategorySchema, uuidSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError, formatCategoryResponse, defaultCategoryInclude } from '@/lib/utils'

// GET /api/categories/[id] - Get a specific category with all its data
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const categoryId = uuidSchema.parse(params.id)
    
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        ...defaultCategoryInclude,
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
    
    return successResponse(formatCategoryResponse(category))
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/categories/[id] - Update a specific category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = uuidSchema.parse(params.id)
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    if (!existingCategory) {
      return errorResponse('Category not found', 404)
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: validatedData,
      include: defaultCategoryInclude
    })
    
    return successResponse(formatCategoryResponse(updatedCategory), 'Category updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/categories/[id] - Delete a specific category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = uuidSchema.parse(params.id)
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    if (!existingCategory) {
      return errorResponse('Category not found', 404)
    }
    
    // Delete the category (cascade will handle related data)
    await prisma.category.delete({
      where: { id: categoryId }
    })
    
    // If this was the last subcategory, update parent
    if (existingCategory.parentCategoryId) {
      const remainingSiblings = await prisma.category.count({
        where: { parentCategoryId: existingCategory.parentCategoryId }
      })
      
      if (remainingSiblings === 0) {
        await prisma.category.update({
          where: { id: existingCategory.parentCategoryId },
          data: { hasSubcategories: false }
        })
      }
    }
    
    return successResponse(null, 'Category deleted successfully')
  } catch (error) {
    return handleError(error)
  }
} 