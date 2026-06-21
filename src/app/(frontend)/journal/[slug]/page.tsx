import { notFound } from 'next/navigation'
import Link from 'next/link'
import { payloadClient } from '../../server'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { EmailSignup } from '@/components/EmailSignup'
import { getImageUrl } from '@/types'
import type { JournalPostDoc, MediaDoc } from '@/types'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  adventure: 'The South American Adventure',
  travel: 'Travel Stories',
  creativity: 'Notes on Creativity',
  essays: 'Personal Essays',
}

export const revalidate = 60

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'journal-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const post = res.docs[0] as unknown as JournalPostDoc | undefined
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || undefined,
      }
    }
  } catch {
    // DB not connected
  }
  return { title: 'Journal' }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params
  let post: JournalPostDoc | null = null
  let nextPost: JournalPostDoc | null = null
  let prevPost: JournalPostDoc | null = null

  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'journal-posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    post = (res.docs[0] as unknown as JournalPostDoc) || null

    if (post) {
      const allPosts = await payload.find({
        collection: 'journal-posts',
        sort: '-publishedDate',
        limit: 100,
        where: { _status: { equals: 'published' } },
      })
      const posts = allPosts.docs as unknown as JournalPostDoc[]
      const idx = posts.findIndex((p) => p.id === post!.id)
      if (idx > 0) prevPost = posts[idx - 1]
      if (idx < posts.length - 1) nextPost = posts[idx + 1]
    }
  } catch {
    // DB not connected
  }

  if (!post) notFound()

  const coverSrc = getImageUrl(post.coverImage as MediaDoc, 'full')
  const hasContent = post.content && (post.content as { root?: { children?: unknown[] } }).root?.children?.length

  const readingTime = (() => {
    if (!hasContent) return null
    const root = post.content as { root?: { children?: { children?: { text?: string }[] }[] } }
    const text = root.root?.children?.map((node) =>
      node.children?.map((c) => c.text || '').join('') || ''
    ).join(' ') || ''
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 230))
  })()

  return (
    <article className="section jp">
      <div className="wrap">
        {/* ── header ── */}
        <header className="jp-head" data-r>
          <span className="eyebrow">
            <StarIcon className="star" />
            {post.categories?.map((c) => categoryLabels[c] || c).join(' · ') || 'Journal'}
          </span>
          <h1>{post.title}</h1>
          <div className="jp-meta">
            <span>By Belen Maluenda</span>
            {post.publishedDate && (
              <>
                <span className="dot" />
                <span>{new Date(post.publishedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}</span>
              </>
            )}
            {readingTime && (
              <>
                <span className="dot" />
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
        </header>

        {/* ── cover image ── */}
        {coverSrc && (
          <figure className="jp-cover" data-r>
            <div className="frame">
              <img src={coverSrc} alt={post.title} style={{ width: '100%', display: 'block' }} />
            </div>
          </figure>
        )}

        {/* ── body ── */}
        <div className="essay" data-r>
          {hasContent ? (
            <RichText data={post.content as Parameters<typeof RichText>[0]['data']} />
          ) : (
            <p className="dropcap">{post.excerpt}</p>
          )}
        </div>

        {/* ── end mark ── */}
        <div className="jp-end" data-r>
          <StarIcon className="star" />
        </div>

        {/* ── next / prev navigation ── */}
        {(prevPost || nextPost) && (
          <nav className="jp-nav" data-r>
            <div className="jp-nav-head">
              <span className="ln" />
              <span className="eyebrow">
                <StarIcon className="star" />
                Keep reading
              </span>
              <span className="ln" />
            </div>
            <div className="jp-nav-grid">
              {prevPost && (
                <Link href={`/journal/${prevPost.slug}`} className="jp-nav-link">
                  <span className="jp-nav-dir">
                    <ArrowIcon className="ar flip" /> Previous
                  </span>
                  <span className="jp-nav-title">{prevPost.title}</span>
                </Link>
              )}
              {nextPost && (
                <Link href={`/journal/${nextPost.slug}`} className="jp-nav-link next">
                  <span className="jp-nav-dir">
                    Next <ArrowIcon className="ar" />
                  </span>
                  <span className="jp-nav-title">{nextPost.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* ── subscribe band ── */}
        <div className="sub-band" data-r>
          <StarIcon className="star" />
          <h3>Enjoyed this?</h3>
          <p>New stories, new work, and market dates — sent now and then. No noise, just the good stuff.</p>
          <EmailSignup id="joinPost" source="journal-post" buttonText="Subscribe" />
        </div>

        {/* ── back to journal ── */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          <Link className="ghost" href="/journal">
            All journal entries
          </Link>
        </div>
      </div>
    </article>
  )
}
