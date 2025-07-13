import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateMenuItemSchema, uuidSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError, formatMenuItemResponse, defaultMenuItemInclude } from '@/lib/utils'
import { deleteImageFromS3 } from '@/lib/s3'

// GET /api/menu-items/[id] - Get a specific menu item
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const menuItemId = uuidSchema.parse((await params).id)
    
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: defaultMenuItemInclude
    })
    
    if (!menuItem) {
      return errorResponse('Menu item not found', 404)
    }
    
    return successResponse(formatMenuItemResponse(menuItem))
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/menu-items/[id] - Update a specific menu item
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const menuItemId = uuidSchema.parse((await params).id)
    const body = await request.json()
    const validatedData = updateMenuItemSchema.parse(body)
    
    // Check if menu item exists
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: defaultMenuItemInclude
    })
    
    if (!existingMenuItem) {
      return errorResponse('Menu item not found', 404)
    }
    
    // Handle tag updates if provided
    const { tagIds, ...menuItemData } = validatedData
    
    // Update the menu item
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: menuItemData,
      include: defaultMenuItemInclude
    })
    
    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      await prisma.menuItemTag.deleteMany({
        where: { menuItemId }
      })
      
      // Add new tags
      if (tagIds.length > 0) {
        await prisma.menuItemTag.createMany({
          data: tagIds.map(tagId => ({
            menuItemId,
            tagId
          }))
        })
      }
      
      // Fetch the updated menu item with new tags
      const menuItemWithTags = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        include: defaultMenuItemInclude
      })
      
      if (!menuItemWithTags) {
        return errorResponse('Menu item not found after update', 500)
      }
      
      return successResponse(formatMenuItemResponse(menuItemWithTags), 'Menu item updated successfully')
    }
    
    return successResponse(formatMenuItemResponse(updatedMenuItem), 'Menu item updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/menu-items/[id] - Delete a specific menu item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const menuItemId = uuidSchema.parse((await params).id)
    
    // Check if menu item exists
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    })
    
    if (!existingMenuItem) {
      return errorResponse('Menu item not found', 404)
    }
    
    // Delete image from S3 if it exists
    if (existingMenuItem.imageUrl) {
      try {
        await deleteImageFromS3(existingMenuItem.imageUrl)
      } catch (error) {
        console.error('Failed to delete image from S3:', error)
        // Continue with deletion even if S3 deletion fails
      }
    }
    
    // Delete the menu item (cascade will handle tags)
    await prisma.menuItem.delete({
      where: { id: menuItemId }
    })
    
    return successResponse(null, 'Menu item deleted successfully')
  } catch (error) {
    return handleError(error)
  }
} 