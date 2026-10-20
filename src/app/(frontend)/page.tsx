import Link from 'next/link'
import { payloadClient } from './server'
import { Frame } from '@/components/Frame'
import { EventCard } from '@/components/EventCard'
import { GalleryCarousel, type CarouselItem } from '@/components/GalleryCarousel'
import { EmailSignup } from '@/components/EmailSignup'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl, getImageAlt } from '@/types'
import type { ArtworkDoc, ProductDoc, MarketDoc, MediaDoc } from '@/types'
import { groupEvents, fallbackEvents } from '@/lib/events'

/* ── hardcoded defaults (from belu-malu-v3.html #home) ── */

const availabilityLabels: Record<string, string> = {
  available: 'Original available',
  sold: 'Original sold',
  'prints-only': 'Prints available',
  inquiry: 'By inquiry',
}

const defaultGalleryItems = [
  { placeholderClass: 'art--catnip', title: 'Tito on Catnip', meta: 'Acrylic on canvas · 2024', status: 'Original available' },
  { placeholderClass: 'art--mandala', title: 'Tito Mandala', meta: 'Ink + gouache · 2024', status: 'Prints from $35' },
  { placeholderClass: 'art--hoppy', title: "Don't Worry Be Hoppy", meta: 'Giclée · 2023', status: 'Prints from $35' },
  { placeholderClass: 'art--neuroasis', title: 'Neuroasis', meta: 'Acrylic on canvas · 2024', status: 'Original available' },
  { placeholderClass: 'art--memento', title: 'Memento', meta: 'Mixed media', status: 'By inquiry' },
  { placeholderClass: 'art--morningjoe', title: 'Morning Joe', meta: 'Acrylic on panel · 2024', status: 'Original available' },
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
  let events: MarketDoc[] = []

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
        depth: 1,
        limit: 30,
      }),
    ])
    homeData = homeGlobal as Record<string, unknown>
    artworks = artworksRes.docs as unknown as ArtworkDoc[]
    events = marketsRes.docs as unknown as MarketDoc[]
  } catch {
    // DB not connected — render with defaults
  }

  /* ── text fields with fallbacks ── */
  const heroHeadline = (homeData.heroHeadline as string) || 'Art rooted in\nmovement, memory,\nand joy.'
  const heroHighlight = (homeData.heroHighlightWord as string) || 'joy'
  const heroSubtext = (homeData.heroSubtext as string) || "I'm Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life."
  const heroEyebrow = (homeData.heroEyebrow as string) || 'Chilean artist, based in the U.S.'
  const heroDateLabel = (homeData.heroDateLabel as string) || 'Art, prints & events · 2026'

  // Hero artwork falls back to the first gallery artwork when none is picked in the CMS
  const heroArtwork = (homeData.heroFeaturedArtwork as ArtworkDoc | null) || artworks[0] || null
  const heroPortrait = homeData.heroPortrait as MediaDoc | null

  const statementPortrait = homeData.statementPortrait as MediaDoc | null
  const statementAttribution = (homeData.statementAttribution as string) || 'Belu Maluenda, artist'
  const statementQuote = (homeData.statementQuote as string) || "Born in Santiago and raised in the U.S., I've always had one foot in each world. My art is where they finally meet."

  const shopHeading = (homeData.shopHeading as string) || 'A new collection is on the way.'
  const shopProducts = (homeData.shopPreviewProducts as ProductDoc[]) || []
  const shopItems =
    shopProducts.length > 0
      ? shopProducts.slice(0, 3).map((product) => {
          const soon = product.productStatus === 'coming-soon'
          return {
            key: product.id,
            src: getImageUrl(product.image as MediaDoc, 'gallery'),
            placeholderClass: '',
            category: product.category || '',
            title: product.title,
            meta: soon ? 'Coming soon' : product.priceDisplay || '',
            soon,
          }
        })
      : defaultShopProducts.map((item) => ({ ...item, key: item.title, src: null, soon: true }))

  const heroLines = heroHeadline.split('\n')

  const galleryItems: CarouselItem[] =
    artworks.length > 0
      ? artworks.slice(0, 8).map((art) => ({
          key: art.id,
          src: getImageUrl(art.image as MediaDoc, 'gallery'),
          alt: getImageAlt(art.image as MediaDoc) || art.title,
          title: art.title,
          meta: [art.medium, art.year].filter(Boolean).join(' · '),
          status: art.priceDisplay || availabilityLabels[art.availability || ''] || '',
          placeholderClass: '',
        }))
      : defaultGalleryItems.map((item) => ({ ...item, key: item.title, src: null, alt: item.title }))

  // Upcoming events first; fall back to stockists so the row is never empty
  const grouped = groupEvents(events.length > 0 ? events : fallbackEvents)
  const homeEvents = [...grouped.upcoming, ...grouped.stockists].slice(0, 6)

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
              {heroArtwork ? (
                <Frame
                  src={getImageUrl(heroArtwork.image as MediaDoc, 'gallery')}
                  alt={getImageAlt(heroArtwork.image as MediaDoc) || heroArtwork.title}
                  aspectRatio="4/5"
                  className="af"
                  label={{
                    category: 'Featured',
                    title: heroArtwork.title,
                    meta: heroArtwork.medium || '',
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
                src={getImageUrl(heroPortrait, 'gallery')}
                alt={getImageAlt(heroPortrait) || 'Belu in her studio'}
                aspectRatio="4/5"
                className="pf"
                placeholderClass="art--studio"
                label={{ category: 'The artist', title: 'Belu', meta: 'Santiago to the U.S.' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY — horizontal strip */}
      <section className="section mod">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">The work</span>
              <h2>From the studio wall</h2>
            </div>
            <Link className="link act" href="/gallery">
              See the gallery
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
        </div>
        <div className="hrow-wrap" data-r>
          <GalleryCarousel items={galleryItems} label="Artwork from the gallery" />
        </div>
      </section>

      {/* SHOP */}
      <section className="section mod bg-gray">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">The shop</span>
              <h2>Bring the work home</h2>
              <p className="mod-sub">{shopHeading}</p>
            </div>
            <Link className="link act" href="/shop">
              Visit the shop
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
        </div>
        <div className="hrow-wrap" data-r>
          <div className="hrow" role="region" aria-label="Shop preview" tabIndex={0}>
            {shopItems.map((item) => (
              <Link className={`alink hrow-item${item.soon ? ' is-soon' : ''}`} href="/shop" key={item.key}>
                <Frame
                  src={item.src}
                  alt={item.title}
                  aspectRatio="1/1"
                  placeholderClass={item.placeholderClass}
                  label={{ category: item.category, title: item.title, meta: item.meta }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS — horizontal card row */}
      <section className="section mod">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">Events</span>
              <h2>Come say hi</h2>
            </div>
            <Link className="link act" href="/events">
              All events
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
        </div>
        <div className="hrow-wrap" data-r>
          <div className="hrow" role="region" aria-label="Upcoming events" tabIndex={0}>
            {homeEvents.map((event, i) => (
              <div className="hrow-item ev" key={event.id}>
                <EventCard event={event} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section mod bg-gray">
        <div className="wrap mod-about">
          <div className="pic" data-r>
            <Frame
              src={getImageUrl(statementPortrait, 'gallery')}
              alt={getImageAlt(statementPortrait) || 'Portrait of Belu'}
              aspectRatio="4/5"
              placeholderClass="art--studio"
            />
          </div>
          <div data-r>
            <span className="kicker">About me</span>
            <p className="mod-quote">{statementQuote}</p>
            {statementAttribution && <span className="mod-who">{statementAttribution}</span>}
            <Link className="btn" href="/about">
              Read my story <StarIcon className="star" />
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section mod">
        <div className="wrap mod-news" data-r>
          <div>
            <span className="eyebrow">
              <StarIcon className="star" />
              First access
            </span>
            <h2>Join the list</h2>
            <p>New work, print drops, and event dates. No noise.</p>
          </div>
          <EmailSignup id="joinHome" source="home" />
        </div>
      </section>
    </>
  )
}
