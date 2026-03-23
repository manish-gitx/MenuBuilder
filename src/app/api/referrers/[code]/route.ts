import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleError } from '@/lib/utils'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const referrer = await prisma.referrer.findUnique({
      where: { code },
      select: { name: true, phone: true },
    })
    if (!referrer) return errorResponse('Referrer not found', 404)
    return successResponse(referrer)
  } catch (error) {
    return handleError(error)
  }
}
