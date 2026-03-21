import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleError } from '@/lib/utils'

function isAdmin(userId: string) {
  const adminIds = (process.env.ADMIN_USER_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean)
  if (adminIds.length === 0) return true
  return adminIds.includes(userId)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    await prisma.referrer.delete({ where: { id } })
    return successResponse(null, 'Referrer deleted')
  } catch (error) {
    return handleError(error)
  }
}
