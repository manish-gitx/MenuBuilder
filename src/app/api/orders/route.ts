import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleError } from '@/lib/utils'
import { z } from 'zod'

const createOrderSchema = z.object({
  menuId: z.string().uuid(),
  menuName: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  vegGuests: z.number().int().min(0).default(0),
  nonVegGuests: z.number().int().min(0).default(0),
  date: z.string().optional(),
  menuSnapshot: z.array(z.any()),
  referralCode: z.string().optional(),
  pdfUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createOrderSchema.parse(body)

    // Verify referral code exists if provided
    if (data.referralCode) {
      const referrer = await prisma.referrer.findUnique({
        where: { code: data.referralCode },
      })
      if (!referrer) {
        return errorResponse('Invalid referral code', 400)
      }
    }

    const order = await prisma.order.create({
      data: {
        menuId: data.menuId,
        menuName: data.menuName,
        phone: data.phone,
        vegGuests: data.vegGuests,
        nonVegGuests: data.nonVegGuests,
        date: data.date,
        menuSnapshot: data.menuSnapshot,
        referralCode: data.referralCode ?? null,
        pdfUrl: data.pdfUrl ?? null,
      },
    })

    return successResponse({ id: order.id }, 'Order saved successfully')
  } catch (error) {
    return handleError(error)
  }
}
