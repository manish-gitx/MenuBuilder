import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateTagSchema, uuidSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError } from '@/lib/utils'

// GET /api/tags/[id] - Get a specific tag
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const tagId = uuidSchema.parse(resolvedParams.id)
    
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    })
    
    if (!tag) {
      return errorResponse('Tag not found', 404)
    }
    
    return successResponse(tag)
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/tags/[id] - Update a specific tag
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const tagId = uuidSchema.parse(resolvedParams.id)
    const body = await request.json()
    const validatedData = updateTagSchema.parse(body)
    
    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId }
    })
    
    if (!existingTag) {
      return errorResponse('Tag not found', 404)
    }
    
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true
      }
    })
    
    return successResponse(updatedTag, 'Tag updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

// DELETE /api/tags/[id] - Delete a specific tag
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const tagId = uuidSchema.parse(resolvedParams.id)
    
    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId }
    })
    
    if (!existingTag) {
      return errorResponse('Tag not found', 404)
    }
    
    // Delete the tag (cascade will handle menu item tags)
    await prisma.tag.delete({
      where: { id: tagId }
    })
    
    return successResponse(null, 'Tag deleted successfully')
  } catch (error) {
    return handleError(error)
  }
} 