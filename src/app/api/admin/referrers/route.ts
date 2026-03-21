import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleError } from '@/lib/utils'
import { z } from 'zod'

function isAdmin(userId: string) {
  const adminIds = (process.env.ADMIN_USER_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean)
  if (adminIds.length === 0) return true
  return adminIds.includes(userId)
}

const createReferrerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  code: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Code must be lowercase letters, numbers and hyphens'),
  rewardAmount: z.number().min(0),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return errorResponse('Unauthorized', 401)
    }

    const referrers = await prisma.referrer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
        orders: { select: { referralCode: true } },
      },
    })

    const data = referrers.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      code: r.code,
      rewardAmount: r.rewardAmount,
      createdAt: r.createdAt,
      orderCount: r._count.orders,
      totalEarned: r._count.orders * r.rewardAmount,
    }))

    return successResponse(data)
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const data = createReferrerSchema.parse(body)

    const referrer = await prisma.referrer.create({ data })
    return successResponse(referrer, 'Referrer created')
  } catch (error) {
    return handleError(error)
  }
}
