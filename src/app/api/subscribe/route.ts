import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { addSubscriber } from '@/lib/subscribe'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: await config })

    if ((await addSubscriber(payload, email, source)) === 'exists') {
      return NextResponse.json({ error: 'already_subscribed' }, { status: 409 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
