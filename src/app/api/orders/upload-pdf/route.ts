import { NextRequest } from 'next/server'
import { uploadPdfToS3 } from '@/lib/s3'
import { successResponse, handleError } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { pdf, filename } = await request.json()

    // pdf is an array of bytes from the client
    const buffer = Buffer.from(pdf)
    const url = await uploadPdfToS3(buffer.buffer as ArrayBuffer, filename)

    return successResponse({ url })
  } catch (error) {
    return handleError(error)
  }
}
