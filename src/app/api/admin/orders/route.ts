import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleError } from '@/lib/utils'

function isAdmin(userId: string) {
  const adminIds = (process.env.ADMIN_USER_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean)
  // If no ADMIN_USER_IDS configured, allow any authenticated user
  if (adminIds.length === 0) return true
  return adminIds.includes(userId)
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return errorResponse('Unauthorized', 401)
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        referrer: { select: { name: true, code: true, rewardAmount: true } },
      },
    })

    return successResponse(orders)
  } catch (error) {
    return handleError(error)
  }
}
