import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, type, message, artworkId } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: await config })

    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        type: type || 'general',
        message,
        ...(artworkId ? { artwork: artworkId } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
