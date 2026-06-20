import type { Metadata } from 'next'
import { payloadClient } from '../server'
import { StoryCard } from '@/components/StoryCard'

export const metadata: Metadata = {
  title: 'Journal',
  description: "Notes from an artist's life. Travel, creativity, heritage, and stories from the road and the studio.",
}
import { FilterChips } from '@/components/FilterChips'
import { EmailSignup } from '@/components/EmailSignup'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl } from '@/types'
import type { JournalPostDoc, MediaDoc } from '@/types'

const journalFilters = [
  { label: 'The South American Adventure', value: 'adventure' },
  { label: 'Travel Stories', value: 'travel' },
  { label: 'Notes on Creativity', value: 'creativity' },
  { label: 'Personal Essays', value: 'essays' },
]

type FallbackPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  categories: string[]
  categoryLabel: string
  year: string
  date?: string
  placeholderClass: string
  featured?: boolean
}

const fallbackFeatured: FallbackPost = {
  id: 'fb-featured',
  slug: 'the-south-american-adventure',
  title: 'The South American Adventure',
  excerpt:
    'Seven months, one backpack, and a slow journey back to where I began. The trip that grounded my sense of self in something other than a place.',
  categories: ['adventure', 'travel'],
  categoryLabel: 'The South American Adventure',
  year: '2021',
  date: 'June 2021',
  placeholderClass: 'art--terracotta',
  featured: true,
}

const fallbackGrid: FallbackPost[] = [
  {
    id: 'fb-1',
    slug: 'a-return-to-color',
    title: 'A Return to Color',
    excerpt:
      'On quieting the inner critic and learning to make things purely for the joy of it.',
    categories: ['creativity'],
    categoryLabel: 'Notes on Creativity',
    year: '2024',
    placeholderClass: 'art--munchie',
  },
  {
    id: 'fb-2',
    slug: 'rooted-in-two-worlds',
    title: 'Rooted in Two Worlds',
    excerpt:
      'What it means to belong to two countries, and to find home in the work instead.',
    categories: ['essays'],
    categoryLabel: 'Personal Essays',
    year: '2023',
    placeholderClass: 'art--catnip',
  },
  {
    id: 'fb-3',
    slug: 'things-i-learned-from-poisoning-myself-part-i',
    title: 'Things I Learned From Poisoning Myself, Part I',
    excerpt:
      "I breathed deep and tried to stay calm as the medicine's heat spread from the small burns on my arm.",
    categories: ['adventure', 'travel'],
    categoryLabel: 'The South American Adventure',
    year: '2021',
    placeholderClass: 'art--memento',
  },
  {
    id: 'fb-4',
    slug: 'lunch-with-a-bolivian-cholita',
    title: 'Lunch With a Bolivian Cholita',
    excerpt:
      'A quiet taxi-van ride turned into an unexpected lesson on my own assumptions.',
    categories: ['travel'],
    categoryLabel: 'Travel Stories',
    year: '2021',
    placeholderClass: 'art--terracotta',
  },
  {
    id: 'fb-5',
    slug: 'it-all-began-with-james-bond',
    title: 'It All Began With James Bond',
    excerpt:
      'A childhood love of the movies that quietly shaped how I see colour and story.',
    categories: ['essays', 'creativity'],
    categoryLabel: 'Personal Essays',
    year: '2021',
    placeholderClass: 'art--morningjoe',
  },
  {
    id: 'fb-6',
    slug: 'back-to-the-roots',
    title: 'Back to the Roots',
    excerpt:
      'Returning to Chile to reconnect with my heritage, and to save my wilting Spanish.',
    categories: ['adventure', 'travel'],
    categoryLabel: 'The South American Adventure',
    year: '2021',
    placeholderClass: 'art--hoppy',
  },
]

export const revalidate = 60

export default async function JournalPage() {
  let posts: JournalPostDoc[] = []
  let featured: JournalPostDoc | null = null

  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'journal-posts',
      sort: '-publishedDate',
      limit: 100,
      where: { _status: { equals: 'published' } },
    })
    posts = res.docs as unknown as JournalPostDoc[]
    featured = posts.find((p) => p.featured) || posts[0] || null
  } catch {
    // DB not connected
  }

  const hasPosts = posts.length > 0
  const nonFeatured = posts.filter((p) => p.id !== featured?.id)

  return (
    <div className="section">
      <div className="wrap">
        <div className="chap" data-r>
          <div className="ttl">
            <span className="kicker k">Stories &amp; field notes</span>
            <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>Journal</h2>
          </div>
        </div>
        <p className="lead" data-r style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          Notes from an artist&apos;s life. Travel, creativity, heritage, and the occasional thought worth chewing on, written from the road and the studio.
        </p>

        {/* Featured post */}
        {hasPosts && featured ? (
          <article className="jfeat" data-r>
            {featured.coverImage ? (
              <div className="img" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid var(--line)', boxShadow: 'var(--sh-art)' }}>
                <img
                  src={getImageUrl(featured.coverImage as MediaDoc, 'gallery') || ''}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="img art art--terracotta" role="img" aria-label={featured.title} />
            )}
            <div>
              <div className="jmeta">
                <StarIcon className="star" style={{ width: 11, height: 11 } as React.CSSProperties} />
                {featured.categories?.[0] || 'Journal'}
                <span className="dot" />
                <span className="date">
                  {featured.publishedDate
                    ? new Date(featured.publishedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : ''}
                </span>
              </div>
              <h2>{featured.title}</h2>
              <p className="ex">{featured.excerpt}</p>
              <a className="link" href={`/journal/${featured.slug}`}>
                Read the story
                <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                  <ArrowIcon />
                </svg>
              </a>
            </div>
          </article>
        ) : (
          <article className="jfeat" data-r>
            <div
              className={`img art ${fallbackFeatured.placeholderClass}`}
              role="img"
              aria-label={`${fallbackFeatured.title} (placeholder)`}
            />
            <div>
              <div className="jmeta">
                <StarIcon className="star" style={{ width: 11, height: 11 } as React.CSSProperties} />
                {fallbackFeatured.categoryLabel}
                <span className="dot" />
                <span className="date">{fallbackFeatured.date}</span>
              </div>
              <h2>{fallbackFeatured.title}</h2>
              <p className="ex">{fallbackFeatured.excerpt}</p>
              <a className="link" href={`/journal/${fallbackFeatured.slug}`}>
                Read the story
                <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                  <ArrowIcon />
                </svg>
              </a>
            </div>
          </article>
        )}

        <FilterChips filters={journalFilters} items={null} targetId="jGrid" />

        {/* Grid posts */}
        <div className="jgrid" id="jGrid">
          {hasPosts ? (
            nonFeatured.map((post) => (
              <StoryCard
                key={post.id}
                href={`/journal/${post.slug}`}
                imageSrc={getImageUrl(post.coverImage as MediaDoc, 'gallery')}
                category={post.categories?.[0] || 'Journal'}
                year={post.publishedDate ? new Date(post.publishedDate).getFullYear().toString() : undefined}
                title={post.title}
                excerpt={post.excerpt || ''}
                categories={post.categories}
              />
            ))
          ) : (
            fallbackGrid.map((post) => (
              <StoryCard
                key={post.id}
                href={`/journal/${post.slug}`}
                placeholderClass={post.placeholderClass}
                category={post.categoryLabel}
                year={post.year}
                title={post.title}
                excerpt={post.excerpt}
                categories={post.categories}
              />
            ))
          )}
        </div>

        <div className="sub-band" data-r>
          <StarIcon className="star" />
          <h3>Join the journey</h3>
          <p>New work, new stories, and market dates, sent now and then. No noise, just the good stuff.</p>
          <EmailSignup id="joinJournal" source="journal" buttonText="Subscribe" />
        </div>
      </div>
    </div>
  )
}
