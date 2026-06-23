import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const info: Record<string, unknown> = {}

  info.hasDbUrl = !!process.env.DATABASE_URL
  info.dbUrlLength = process.env.DATABASE_URL?.length ?? 0
  info.hasPayloadSecret = !!process.env.PAYLOAD_SECRET
  info.hasServerUrl = !!process.env.NEXT_PUBLIC_SERVER_URL
  info.nodeEnv = process.env.NODE_ENV

  try {
    const config = await import('@payload-config')
    info.configLoaded = true

    const { getPayload } = await import('payload')
    info.payloadImported = true

    const payload = await getPayload({ config: await config.default })
    info.payloadInitialized = true

    const all = await payload.find({
      collection: 'journal-posts',
      limit: 50,
      where: { _status: { equals: 'published' } },
    })
    info.postCount = all.docs.length
    info.slugs = all.docs.map((d: Record<string, unknown>) => d.slug)
  } catch (e) {
    info.error = String(e)
    info.errorName = e instanceof Error ? e.name : 'unknown'
    info.stack = e instanceof Error ? e.stack?.split('\n').slice(0, 5) : undefined
  }

  return NextResponse.json(info)
}
