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
  slug: 'poisoning-myself-kambo-part-1',
  title: 'Things I Learned From Poisoning Myself: Part 1',
  excerpt:
    'I did my best to breathe deeply and remain calm as I felt the heat of the toxin make its way from the burns in my arm throughout my body.',
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
    slug: 'poisoning-myself-kambo-part-2',
    title: 'Things I Learned From Poisoning Myself: Part II',
    excerpt:
      'After my second experience with the Amazonian frog medicine, Kambo, I settled into what would turn out to be a month-long stay in Pisac.',
    categories: ['adventure', 'travel'],
    categoryLabel: 'The South American Adventure',
    year: '2021',
    placeholderClass: 'art--munchie',
  },
  {
    id: 'fb-2',
    slug: 'poisoning-myself-kambo-part-3',
    title: 'Things I Learned From Poisoning Myself: Part III',
    excerpt:
      'The small burns on my inner left arm and right wrist had taken on a more even color and texture.',
    categories: ['adventure', 'travel'],
    categoryLabel: 'The South American Adventure',
    year: '2021',
    placeholderClass: 'art--catnip',
  },
  {
    id: 'fb-3',
    slug: 'my-love-affair-with-cinema-part-1',
    title: 'It All Began With James Bond: My Love Affair With Cinema – Pt 1',
    excerpt:
      "I can remember the day in which I fell in love with movies. Little five-year-old me wandered into my parents' room.",
    categories: ['essays', 'travel'],
    categoryLabel: 'Personal Essays',
    year: '2021',
    placeholderClass: 'art--memento',
  },
  {
    id: 'fb-4',
    slug: 'my-love-affair-with-cinema-part-2',
    title: 'My Love Affair With Cinema – Pt 2',
    excerpt:
      'Growing up, my childhood James Bond mania snowballed into a full-blown obsession with cinema.',
    categories: ['essays'],
    categoryLabel: 'Personal Essays',
    year: '2021',
    placeholderClass: 'art--terracotta',
  },
  {
    id: 'fb-5',
    slug: 'how-youre-already-a-cyborg',
    title: "How You're Already A Cyborg",
    excerpt:
      'As the civilized world has come to a grinding halt, most of us have found ourselves yanked out of our daily routines.',
    categories: ['essays'],
    categoryLabel: 'Personal Essays',
    year: '2021',
    placeholderClass: 'art--morningjoe',
  },
  {
    id: 'fb-6',
    slug: 'lunch-with-a-bolivian-cholita',
    title: 'Lunch With A Bolivian Cholita',
    excerpt:
      'I gazed out of the taxi van window at the passing landscape: ancient Incan terraces descended like enormous staircases into the gleaming waters of Lake Titicaca.',
    categories: ['adventure', 'travel'],
    categoryLabel: 'The South American Adventure',
    year: '2021',
    placeholderClass: 'art--hoppy',
  },
  {
    id: 'fb-7',
    slug: 'cutting-through-media-bias',
    title: "Are You Sure You're Not Being Manipulated?: Cutting Through Media Bias",
    excerpt:
      "I think many would agree that navigating the media landscape these days has been downright exhausting.",
    categories: ['essays'],
    categoryLabel: 'Personal Essays',
    year: '2021',
    placeholderClass: 'art--terracotta',
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
