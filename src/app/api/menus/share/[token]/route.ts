import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shareTokenSchema } from '@/lib/validations'
import { successResponse, errorResponse, handleError, formatMenuResponse, defaultMenuInclude } from '@/lib/utils'

// GET /api/menus/share/[token] - Get a menu by share token for public access
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = shareTokenSchema.parse({ token: (await params).token })
    
    const menu = await prisma.menu.findUnique({
      where: { shareToken: token },
      include: defaultMenuInclude
    })
    
    if (!menu) {
      return errorResponse('Menu not found or share token is invalid', 404)
    }
    
    // Only return public menus or any menu accessed via share token
    // (share tokens can be used to access private menus)
    
    return successResponse(formatMenuResponse(menu))
  } catch (error) {
    return handleError(error)
  }
} 