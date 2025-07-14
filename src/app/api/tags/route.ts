import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTagSchema, tagQuerySchema } from '@/lib/validations'
import { successResponse, paginatedResponse, handleError } from '@/lib/utils'
import { Prisma } from '@prisma/client'

// GET /api/tags - Get all tags with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = tagQuerySchema.parse(queryParams)
    
    const where: Prisma.TagWhereInput = {}
    
    if (validatedQuery.type) {
      where.type = validatedQuery.type
    }
    
    if (validatedQuery.search) {
      where.name = {
        contains: validatedQuery.search,
        mode: 'insensitive'
      }
    }
    
    const skip = (validatedQuery.page - 1) * validatedQuery.limit
    
    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: validatedQuery.limit,
        orderBy: { name: 'asc' },
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
      }),
      prisma.tag.count({ where })
    ])
    
    return paginatedResponse(tags, {
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      total
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createTagSchema.parse(body)
    
    const tag = await prisma.tag.create({
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
    
    return successResponse(tag, 'Tag created successfully')
  } catch (error) {
    return handleError(error)
  }
} 