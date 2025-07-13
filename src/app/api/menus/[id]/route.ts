import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { updateMenuSchema, uuidSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError, formatMenuResponse, defaultMenuInclude } from '@/lib/utils'

// GET /api/menus/[id] - Get a specific menu with all its data
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const menuId = uuidSchema.parse((await params).id)
    
    const menu = await prisma.menu.findUnique({
      where: { 
        id: menuId,
        userId: userId // Ensure user can only access their own menus
      },
      include: defaultMenuInclude
    })
    
    if (!menu) {
      return errorResponse('Menu not found', 404)
    }
    
    return successResponse(formatMenuResponse(menu))
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/menus/[id] - Update a specific menu
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const menuId = uuidSchema.parse((await params).id)
    const body = await request.json()
    const validatedData = updateMenuSchema.parse(body)
    
    // Check if menu exists and belongs to the user
    const existingMenu = await prisma.menu.findUnique({
      where: { 
        id: menuId,
        userId: userId 
      }
    })
    
    if (!existingMenu) {
      return errorResponse('Menu not found', 404)
    }
    
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        shareToken: true,
        userId: true,
        userEmail: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return successResponse(updatedMenu, 'Menu updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/menus/[id] - Delete a specific menu
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const menuId = uuidSchema.parse((await params).id)
    
    // Check if menu exists and belongs to the user
    const existingMenu = await prisma.menu.findUnique({
      where: { 
        id: menuId,
        userId: userId 
      }
    })
    
    if (!existingMenu) {
      return errorResponse('Menu not found', 404)
    }
    
    // Delete the menu (cascade will handle related data)
    await prisma.menu.delete({
      where: { id: menuId }
    })
    
    return successResponse(null, 'Menu deleted successfully')
  } catch (error) {
    return handleError(error)
  }
} 