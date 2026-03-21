import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, menuName, vegGuests, nonVegGuests, date, phone } = await request.json()

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_WHATSAPP_FROM
    const recipientsRaw = process.env.WHATSAPP_RECIPIENTS

    if (!accountSid || !authToken || !from || !recipientsRaw) {
      console.warn('WhatsApp not configured — skipping send')
      return successResponse(null, 'WhatsApp not configured')
    }

    const recipients = recipientsRaw.split(',').map(r => r.trim()).filter(Boolean)
    const client = twilio(accountSid, authToken)

    const body = [
      `📋 *New Order Request*`,
      `Menu: ${menuName}`,
      `🌿 Veg Guests: ${vegGuests}`,
      `🍗 Non-Veg Guests: ${nonVegGuests}`,
      date ? `📅 Date: ${date}` : null,
      `📞 Phone: ${phone}`,
    ]
      .filter(Boolean)
      .join('\n')

    await Promise.all(
      recipients.map(to =>
        client.messages.create({
          from,
          to,
          body,
          mediaUrl: [pdfUrl],
        })
      )
    )

    return successResponse(null, 'WhatsApp messages sent')
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return errorResponse('Failed to send WhatsApp message', 500)
  }
}
