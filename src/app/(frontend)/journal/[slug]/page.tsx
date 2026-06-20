import { notFound } from 'next/navigation'
import Link from 'next/link'
import { payloadClient } from '../../server'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl } from '@/types'
import type { JournalPostDoc, MediaDoc } from '@/types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params
  let post: JournalPostDoc | null = null

  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'journal-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    post = (res.docs[0] as unknown as JournalPostDoc) || null
  } catch {
    // DB not connected
  }

  if (!post) notFound()

  const coverSrc = getImageUrl(post.coverImage as MediaDoc, 'full')

  return (
    <div className="section">
      <div className="wrap">
        <div className="ahead" data-r>
          <span className="eyebrow">
            <StarIcon className="star" />
            {post.categories?.[0] || 'Journal'}
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginTop: '1rem' }}>{post.title}</h1>
          {post.publishedDate && (
            <p style={{ fontFamily: 'var(--grot)', fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: '.8rem' }}>
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        {coverSrc && (
          <div style={{ maxWidth: 900, margin: '0 auto clamp(2rem, 4vw, 3rem)', border: '1px solid var(--line)', boxShadow: 'var(--sh-art)' }}>
            <img src={coverSrc} alt={post.title} style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        <div className="essay">
          {post.content ? (
            <RichText data={post.content as Parameters<typeof RichText>[0]['data']} />
          ) : (
            <p className="dropcap">{post.excerpt}</p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <Link className="btn" href="/journal">
            Back to journal
            <StarIcon className="star" />
          </Link>
        </div>
      </div>
    </div>
  )
}
