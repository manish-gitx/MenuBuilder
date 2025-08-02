import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shareTokenSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError, formatMenuResponse, defaultMenuInclude, formatCategoryResponse, defaultCategoryInclude } from '@/lib/utils'

// GET /api/menus/share/[token] - Get a menu by share token for public access
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token: paramToken } = await params
    const { token } = shareTokenSchema.parse({ token: paramToken })
    
    const menu = await prisma.menu.findUnique({
      where: { shareToken: token },
      // include: defaultMenuInclude
    })
    
    if (!menu) {
      return errorResponse('Menu not found or share token is invalid', 404)
    }
    
    // Fetch categories for this menu
    const categories = await prisma.category.findMany({
      where: {
        menuId: menu.id,
        parentCategoryId: null // Get root categories
      },
      orderBy: { sortOrder: 'asc' },
      include: defaultCategoryInclude
    })
    
    const formattedCategories = categories.map(formatCategoryResponse)
    
    // Only return public menus or any menu accessed via share token
    // (share tokens can be used to access private menus)
    
    return successResponse({
      menu: formatMenuResponse(menu),
      categories: formattedCategories
    })
  } catch (error) {
    return handleError(error)
  }
} 