import Link from 'next/link'
import { payloadClient } from './server'
import { Frame } from '@/components/Frame'
import { StoryCard } from '@/components/StoryCard'
import { EmailSignup } from '@/components/EmailSignup'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl, getImageAlt } from '@/types'
import type { ArtworkDoc, ProductDoc, JournalPostDoc, MarketDoc } from '@/types'

/* ── hardcoded defaults (from belu-malu-v3.html #home) ── */

const defaultJournalPosts = [
  {
    slug: 'the-south-american-adventure',
    placeholderClass: 'art--terracotta',
    category: 'Travel Stories',
    title: 'The South American Adventure',
    excerpt:
      'Seven months, one backpack, and a slow journey back to where I began.',
  },
  {
    slug: 'a-return-to-color',
    placeholderClass: 'art--munchie',
    category: 'Notes on Creativity',
    title: 'A Return to Color',
    excerpt:
      'On quieting the inner critic and learning to make things purely for the joy of it.',
  },
  {
    slug: 'rooted-in-two-worlds',
    placeholderClass: 'art--catnip',
    category: 'Personal Essays',
    title: 'Rooted in Two Worlds',
    excerpt:
      'What it means to belong to two countries, and to find home in the work instead.',
  },
]

const defaultShopProducts = [
  {
    placeholderClass: 'art--neuroasis',
    category: 'Fine art print',
    title: 'Neuroasis',
    meta: 'Coming soon',
  },
  {
    placeholderClass: 'art--hoppy',
    category: 'Wearable art',
    title: 'Be Hoppy Tee',
    meta: 'Coming soon',
  },
  {
    placeholderClass: 'art--munchie',
    category: 'Small joys',
    title: 'Sticker Pack',
    meta: 'Coming soon',
  },
]

export const revalidate = 60

/* ── page ── */

export default async function HomePage() {
  let homeData: Record<string, unknown> = {}
  let artworks: ArtworkDoc[] = []
  let markets: MarketDoc[] = []

  try {
    const payload = await payloadClient()
    const [homeGlobal, artworksRes, marketsRes] = await Promise.all([
      payload.findGlobal({ slug: 'home-page' }),
      payload.find({
        collection: 'artworks',
        sort: 'sortOrder',
        limit: 20,
        where: { _status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'markets',
        sort: 'sortOrder',
        limit: 10,
      }),
    ])
    homeData = homeGlobal as Record<string, unknown>
    artworks = artworksRes.docs as unknown as ArtworkDoc[]
    markets = marketsRes.docs as unknown as MarketDoc[]
  } catch {
    // DB not connected — render with defaults
  }

  /* ── text fields with fallbacks ── */
  const heroHeadline = (homeData.heroHeadline as string) || 'Art rooted in\nmovement, memory,\nand joy.'
  const heroHighlight = (homeData.heroHighlightWord as string) || 'joy'
  const heroSubtext = (homeData.heroSubtext as string) || "I'm Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life."
  const heroEyebrow = (homeData.heroEyebrow as string) || 'Chilean artist, based in the U.S.'
  const heroDateLabel = (homeData.heroDateLabel as string) || 'Studio journal, 2026'

  const featuredArtwork = homeData.featuredArtwork as ArtworkDoc | null
  const featuredDesc = (homeData.featuredDescription as string) || 'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.'

  const statementQuote = (homeData.statementQuote as string) || "Born in Santiago and raised in the U.S., I've always had one foot in each world. My art is where they finally meet."
  const statementAttribution = (homeData.statementAttribution as string) || 'Belu Maluenda, artist'

  const shopHeading = (homeData.shopHeading as string) || 'A new collection is on the way.'
  const shopBody = (homeData.shopBody as string) || "Support the dream, take something home from an ever-evolving collection. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access."

  const journalPosts = (homeData.journalPreviewPosts as JournalPostDoc[]) || []
  const shopProducts = (homeData.shopPreviewProducts as ProductDoc[]) || []

  const heroLines = heroHeadline.split('\n')

  /* ── decide: use CMS data or hardcoded defaults ── */
  const hasJournalPosts = journalPosts.length > 0
  const hasShopProducts = shopProducts.length > 0

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="wrap">
          <div className="hero-top">
            <span className="eyebrow">
              <StarIcon className="star" />
              {heroEyebrow}
            </span>
            <span className="idx" style={{ fontFamily: 'var(--grot)', fontSize: '.7rem', fontWeight: 600, letterSpacing: '.18em', color: 'var(--stone)' }}>
              {heroDateLabel}
            </span>
          </div>
          <div className="hero-grid">
            <div>
              <h1 className="display">
                {heroLines.map((line, i) => (
                  <span className="ln" key={i}>
                    <i>
                      {line.includes(heroHighlight) ? (
                        <>
                          {line.split(heroHighlight)[0]}
                          <span className="joy">{heroHighlight}</span>
                          {line.split(heroHighlight)[1]}
                        </>
                      ) : (
                        line
                      )}
                    </i>
                  </span>
                ))}
              </h1>
              <div className="hero-intro">
                <p className="lead">{heroSubtext}</p>
                <div className="hero-cta">
                  <Link className="btn" href="/shop">
                    Shop artwork <StarIcon className="star" />
                  </Link>
                  <Link className="ghost" href="/gallery">
                    Explore gallery
                    <svg style={{ width: 22, height: 9, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                      <ArrowIcon />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hero-art">
              {artworks[0] ? (
                <Frame
                  src={getImageUrl(artworks[0].image as import('@/types').MediaDoc, 'gallery')}
                  alt={getImageAlt(artworks[0].image as import('@/types').MediaDoc)}
                  aspectRatio="4/5"
                  className="af"
                  label={{
                    category: 'Featured',
                    title: artworks[0].title,
                    meta: artworks[0].medium || '',
                  }}
                />
              ) : (
                <Frame
                  alt="Featured artwork"
                  aspectRatio="4/5"
                  className="af"
                  placeholderClass="art--neuroasis"
                  label={{ category: 'Featured', title: 'Neuroasis', meta: 'Acrylic on canvas' }}
                />
              )}
              <Frame
                alt="Belu in her studio"
                aspectRatio="4/5"
                className="pf"
                placeholderClass="art--studio"
                label={{ category: 'The artist', title: 'Belu', meta: 'Santiago to the U.S.' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED ARTWORK */}
      <section className="section bg-gray">
        <div className="wrap feat" data-r>
          <Link className="alink" href="/gallery">
            {featuredArtwork ? (
              <Frame
                src={getImageUrl(featuredArtwork.image as import('@/types').MediaDoc, 'full')}
                alt={getImageAlt(featuredArtwork.image as import('@/types').MediaDoc)}
                aspectRatio="16/11"
              />
            ) : (
              <Frame alt="Featured work" aspectRatio="16/11" placeholderClass="art--mandala" />
            )}
          </Link>
          <div className="txt" data-r>
            <span className="eyebrow">
              <StarIcon className="star" />
              Featured work
            </span>
            <h2>{featuredArtwork?.title || 'Tito Mandala'}</h2>
            <p>{featuredDesc}</p>
            {featuredArtwork ? (
              <span className="meta" style={{ fontFamily: 'var(--grot)', fontSize: '.66rem', letterSpacing: '.05em', color: 'var(--stone)', display: 'block', marginBottom: '1.4rem' }}>
                {[featuredArtwork.medium, featuredArtwork.dimensions, featuredArtwork.year].filter(Boolean).join(' · ')}
              </span>
            ) : (
              <span className="meta" style={{ fontFamily: 'var(--grot)', fontSize: '.66rem', letterSpacing: '.05em', color: 'var(--stone)', display: 'block', marginBottom: '1.4rem' }}>
                Ink and gouache · 18 × 18 in · 2024
              </span>
            )}
            <Link className="link" href="/gallery">
              View in gallery
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ARTIST STATEMENT */}
      <section className="section">
        <div className="wrap statement">
          <div className="pic" data-r>
            <Frame
              alt="Portrait of Belu"
              aspectRatio="4/5"
              placeholderClass="art--studio"
              label={{
                category: 'In the studio',
                title: 'Belu, at the easel',
                meta: 'Photograph · your image here',
              }}
            />
          </div>
          <div data-r>
            <blockquote>
              <StarIcon className="star" />
              <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', lineHeight: 1.3, fontVariationSettings: "'SOFT' 60, 'opsz' 144", fontWeight: 340, margin: 0 }}>
                {statementQuote}
              </p>
            </blockquote>
            <div className="who" style={{ fontFamily: 'var(--grot)', fontSize: '.7rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', margin: '1.6rem 0' }}>
              {statementAttribution}
            </div>
            <Link className="btn" href="/about">
              Read her story <StarIcon className="star" />
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="section bg-gray">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">The shop</span>
              <h2>Support the dream</h2>
            </div>
            <Link className="link act" href="/shop">
              Visit the shop
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
          <div className="shopp">
            <div data-r>
              <p className="big">{shopHeading}</p>
              <p className="note">{shopBody}</p>
            </div>
            <div data-r>
              <div className="card">
                <div className="kicker">First access</div>
                <h3>Join the list</h3>
                <p>New work, market dates, and first dibs on the next collection. No noise.</p>
                <EmailSignup id="joinHome" source="home" />
              </div>
            </div>
          </div>
          <div className="preview-wrap" data-r>
            <div className="ph-row">
              <span className="kicker">A look at what&apos;s coming</span>
              <span className="soon">Next collection · preview</span>
            </div>
            <div className="preview-grid">
              {hasShopProducts
                ? shopProducts.map((product) => (
                    <Link className="alink" href="/shop" key={product.id}>
                      <Frame
                        src={getImageUrl(product.image as import('@/types').MediaDoc, 'gallery')}
                        alt={product.title}
                        aspectRatio="1/1"
                        label={{
                          category: product.category || '',
                          title: product.title,
                          meta: product.status === 'coming-soon' ? 'Coming soon' : product.priceDisplay || '',
                        }}
                      />
                    </Link>
                  ))
                : defaultShopProducts.map((item) => (
                    <Link className="alink" href="/shop" key={item.title}>
                      <Frame
                        alt={item.title}
                        aspectRatio="1/1"
                        placeholderClass={item.placeholderClass}
                        label={{
                          category: item.category,
                          title: item.title,
                          meta: item.meta,
                        }}
                      />
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL PREVIEW */}
      <section className="section">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">Stories &amp; field notes</span>
              <h2>From the journal</h2>
            </div>
            <Link className="link act" href="/journal">
              Read the journal
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
          <div className="fn-grid">
            {hasJournalPosts
              ? journalPosts.slice(0, 3).map((post) => (
                  <StoryCard
                    key={post.id}
                    href={`/journal/${post.slug}`}
                    imageSrc={getImageUrl(post.coverImage as import('@/types').MediaDoc, 'gallery')}
                    category={post.categories?.[0] || 'Journal'}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    categories={post.categories}
                  />
                ))
              : defaultJournalPosts.map((post) => (
                  <StoryCard
                    key={post.slug}
                    href="/journal"
                    placeholderClass={post.placeholderClass}
                    category={post.category}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section className="section bg-gray">
        <div className="wrap markets">
          <div data-r>
            <span className="eyebrow">
              <StarIcon className="star" />
              In person
            </span>
            <h2 style={{ marginTop: '.9rem', fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>
              Find my work in the wild
            </h2>
            <p className="lead" style={{ marginTop: '1rem' }}>
              Stockists, markets, and festivals are announced here and on Instagram first.
            </p>
          </div>
          <div data-r>
            {markets.length > 0
              ? markets.map((market) => (
                  <div className={`mrow ${market.status === 'live' ? 'live' : ''}`} key={market.id}>
                    <StarIcon className="star" />
                    <span className="w">{market.name}</span>
                    <span className="meta">{market.dateInfo}</span>
                  </div>
                ))
              : (
                <>
                  <div className="mrow live">
                    <StarIcon className="star" />
                    <span className="w">Abstract Denver</span>
                    <span className="meta">Stocked now · all locations</span>
                  </div>
                  <div className="mrow">
                    <StarIcon className="star" />
                    <span className="w">Spring Maker&apos;s Market</span>
                    <span className="meta">Denver, CO · dates TBA</span>
                  </div>
                  <div className="mrow">
                    <StarIcon className="star" />
                    <span className="w">Summer Art Walk</span>
                    <span className="meta">Announced soon</span>
                  </div>
                </>
              )}
          </div>
        </div>
      </section>
    </>
  )
}
