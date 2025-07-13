import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/utils'

// GET /api/health - Health check endpoint with database connectivity test
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get counts from database
    const [tagCount, menuCount, categoryCount, menuItemCount] = await Promise.all([
      prisma.tag.count(),
      prisma.menu.count(),
      prisma.category.count(),
      prisma.menuItem.count()
    ])
    
    return successResponse({
      status: 'API is healthy! 🚀',
      database: 'Connected successfully to Neon PostgreSQL',
      timestamp: new Date().toISOString(),
      stats: {
        totalTags: tagCount,
        totalMenus: menuCount,
        totalCategories: categoryCount,
        totalMenuItems: menuItemCount
      },
      endpoints: {
        menus: '/api/menus',
        categories: '/api/categories',
        menuItems: '/api/menu-items',
        tags: '/api/tags'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return errorResponse(`Health check failed: ${error}`, 500)
  } finally {
    await prisma.$disconnect()
  }
} 