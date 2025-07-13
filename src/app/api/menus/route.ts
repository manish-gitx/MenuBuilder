import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createMenuSchema, menuQuerySchema } from '@/lib/validations'
import { successResponse, paginatedResponse, handleError, generateShareToken } from '@/lib/utils'

// GET /api/menus - Get all menus with pagination and filtering
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
    
    const validatedQuery = menuQuerySchema.parse(queryParams)
    
    const where: any = {
      userId: userId // Only show menus created by the current user
    }
    
    if (validatedQuery.isPublic !== undefined) {
      where.isPublic = validatedQuery.isPublic
    }
    
    if (validatedQuery.search) {
      where.OR = [
        { name: { contains: validatedQuery.search, mode: 'insensitive' } },
        { description: { contains: validatedQuery.search, mode: 'insensitive' } }
      ]
    }
    
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    
    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        skip,
        take: validatedQuery.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          isPublic: true,
          shareToken: true,
          userId: true,
          userEmail: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              categories: true
            }
          }
        }
      }),
      prisma.menu.count({ where })
    ])
    
    return paginatedResponse(menus, {
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      total
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/menus - Create a new menu
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Get user info from Clerk
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const body = await request.json()
    const validatedData = createMenuSchema.parse(body)
    
    const menu = await prisma.menu.create({
      data: {
        ...validatedData,
        userId: userId,
        userEmail: user.emailAddresses[0]?.emailAddress || '',
        shareToken: generateShareToken()
      },
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
    
    return successResponse(menu, 'Menu created successfully')
  } catch (error) {
    return handleError(error)
  }
} 