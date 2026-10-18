import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { addSubscriber } from '@/lib/subscribe'

const inquiryTypes = ['general', 'commission', 'original', 'wholesale', 'event']

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, type, message, artworkId, newsletter } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: await config })
    const optIn = newsletter === true

    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        type: inquiryTypes.includes(type) ? type : 'general',
        message,
        newsletterOptIn: optIn,
        ...(artworkId ? { artwork: artworkId } : {}),
      },
    })

    // The inquiry is already saved, so a subscribe failure shouldn't fail the request
    let subscribed: 'created' | 'exists' | 'failed' | undefined
    if (optIn) {
      try {
        subscribed = await addSubscriber(payload, email, 'contact')
      } catch {
        subscribed = 'failed'
      }
    }

    return NextResponse.json({ success: true, subscribed })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
