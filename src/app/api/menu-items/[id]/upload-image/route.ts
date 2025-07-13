import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uuidSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError } from '@/lib/utils'
import { deleteImageFromS3, s3 } from '@/lib/s3'
import { v4 as uuidv4 } from 'uuid'

// POST /api/menu-items/[id]/upload-image - Upload an image for a menu item
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const menuItemId = uuidSchema.parse((await params).id)
    
    // Check if menu item exists
    const existingMenuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    })
    
    if (!existingMenuItem) {
      return errorResponse('Menu item not found', 404)
    }
    
    // Get the form data
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return errorResponse('No image file provided', 400)
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return errorResponse('Only image files are allowed', 400)
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return errorResponse('Image size must be less than 5MB', 400)
    }
    
    try {
      // Convert file to buffer
      const buffer = await file.arrayBuffer()
      
      // Generate unique filename with UUID
      const fileExtension = file.name.split('.').pop()
      const fileName = `menu-items/${uuidv4()}.${fileExtension}`
      
      // Upload directly to S3
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || 'menu-catering',
        Key: fileName,
        Body: Buffer.from(buffer),
        ContentType: file.type,
        ACL: 'public-read' as const
      }
      
      const uploadResult = await s3.upload(uploadParams).promise()
      const imageUrl = uploadResult.Location
      
      // Delete old image if it exists
      if (existingMenuItem.imageUrl) {
        try {
          await deleteImageFromS3(existingMenuItem.imageUrl)
        } catch (error) {
          console.error('Failed to delete old image:', error)
          // Continue even if deletion fails
        }
      }
      
      // Update menu item with new image URL
      const updatedMenuItem = await prisma.menuItem.update({
        where: { id: menuItemId },
        data: { imageUrl },
        select: {
          id: true,
          name: true,
          imageUrl: true
        }
      })
      
      return successResponse({
        menuItem: updatedMenuItem,
        uploadedImageUrl: imageUrl,
        s3Key: fileName
      }, 'Image uploaded successfully')
    } catch (uploadError) {
      console.error('S3 upload error:', uploadError)
      return errorResponse('Failed to upload image', 500)
    }
  } catch (error) {
    return handleError(error)
  }
} 