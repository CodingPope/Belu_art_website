import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') || 'poisoning-myself-kambo-part-1'

  try {
    const payload = await getPayload({ config: await config })

    const all = await payload.find({
      collection: 'journal-posts',
      limit: 50,
      where: { _status: { equals: 'published' } },
    })

    const bySlug = await payload.find({
      collection: 'journal-posts',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
    })

    const bySlugNoStatus = await payload.find({
      collection: 'journal-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    return NextResponse.json({
      allCount: all.docs.length,
      allSlugs: all.docs.map((d: Record<string, unknown>) => d.slug),
      searchedSlug: slug,
      withStatusCount: bySlug.docs.length,
      withStatusResult: bySlug.docs.map((d: Record<string, unknown>) => ({
        slug: d.slug,
        title: d.title,
        status: d._status,
      })),
      noStatusCount: bySlugNoStatus.docs.length,
      noStatusResult: bySlugNoStatus.docs.map((d: Record<string, unknown>) => ({
        slug: d.slug,
        title: d.title,
        status: d._status,
      })),
    })
  } catch (e) {
    return NextResponse.json(
      { error: String(e), stack: e instanceof Error ? e.stack : undefined },
      { status: 500 },
    )
  }
}
