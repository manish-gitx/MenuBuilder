import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils'

type Component = {
  type: string
  value: string
  parameter_name: string
}

type OrderData = {
  pdfUrl: string
  menuName: string
  date: string
  phone: string
  referralCode?: string
}

function buildComponents(templateName: string, data: OrderData): Record<string, Component> {
  switch (templateName) {
    case 'order_pdf':
      return {
        body_customer_phone: { type: 'text', value: data.phone, parameter_name: 'customer_phone' },
        body_pdf_url: { type: 'text', value: data.pdfUrl, parameter_name: 'pdf_url' },
      }
    case 'order_confirmation':
      return {
        body_customer_phone: { type: 'text', value: data.phone, parameter_name: 'customer_phone' },
        body_menu_name: { type: 'text', value: data.menuName, parameter_name: 'menu_name' },
        body_referral_code: { type: 'text', value: data.referralCode || '—', parameter_name: 'referral_code' },
        body_event_date: { type: 'text', value: data.date || '—', parameter_name: 'event_date' },
        body_pdf_url: { type: 'text', value: data.pdfUrl, parameter_name: 'pdf_url' },
      }
    default:
      return {
        body_customer_phone: { type: 'text', value: data.phone, parameter_name: 'customer_phone' },
        body_pdf_url: { type: 'text', value: data.pdfUrl, parameter_name: 'pdf_url' },
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, menuName, date, phone, referralCode } = await request.json()

    const authKey = process.env.MSG91_AUTH_KEY
    const integratedNumber = process.env.MSG91_INTEGRATED_NUMBER
    const recipientsRaw = process.env.WHATSAPP_RECIPIENTS
    const templateName = process.env.MSG91_TEMPLATE || 'order_pdf'
    const namespace = 'cf012bbe_b0f2_46e4_88af_50be2568d4c6'

    if (!authKey || !integratedNumber || !recipientsRaw) {
      console.warn('MSG91 WhatsApp not configured — skipping send')
      return successResponse(null, 'WhatsApp not configured')
    }

    const orderData: OrderData = { pdfUrl, menuName, date, phone, referralCode }
    const recipients = recipientsRaw.split(',').map(r => r.trim()).filter(Boolean)
    const components = buildComponents(templateName, orderData)

    const res = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
      method: 'POST',
      headers: {
        authkey: authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        integrated_number: integratedNumber,
        content_type: 'template',
        payload: {
          messaging_product: 'whatsapp',
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'en',
              policy: 'deterministic',
            },
            namespace,
            to_and_components: [
              {
                to: recipients,
                components,
              },
            ],
          },
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('MSG91 error:', data)
      return errorResponse('Failed to send WhatsApp message', 500)
    }

    return successResponse(data, 'WhatsApp messages sent')
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return errorResponse('Failed to send WhatsApp message', 500)
  }
}
