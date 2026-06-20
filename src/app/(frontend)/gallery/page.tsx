import type { Metadata } from 'next'
import Link from 'next/link'
import { payloadClient } from '../server'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A digital wall of originals, prints, and experiments by Belu Maluenda.',
}
import { ArtworkCard } from '@/components/ArtworkCard'
import { FilterChips } from '@/components/FilterChips'
import { Frame } from '@/components/Frame'
import { StarIcon } from '@/components/Icons'
import { getImageUrl, getImageAlt } from '@/types'
import type { ArtworkDoc, MediaDoc } from '@/types'

const galleryFilters = [
  { label: 'Originals', value: 'originals' },
  { label: 'Prints', value: 'prints' },
  { label: 'Mandalas', value: 'mandalas' },
  { label: 'Cats', value: 'cats' },
  { label: 'Murals / Experiments', value: 'murals' },
]

type FallbackArtwork = {
  catalogNumber: number
  title: string
  categories: string[]
  medium: string
  aspectRatio: string
  placeholderClass: string
  priceDisplay: string
}

const FALLBACK_ARTWORKS: FallbackArtwork[] = [
  {
    catalogNumber: 1,
    title: 'Tito on Catnip',
    categories: ['originals', 'cats'],
    medium: 'Acrylic on canvas · 16 × 20 in · 2024',
    aspectRatio: '4/5',
    placeholderClass: 'art--catnip',
    priceDisplay: 'Original available · prints from $40',
  },
  {
    catalogNumber: 2,
    title: 'Tito Mandala',
    categories: ['mandalas', 'prints', 'cats'],
    medium: 'Ink + gouache · 18 × 18 in · 2024',
    aspectRatio: '1/1',
    placeholderClass: 'art--mandala',
    priceDisplay: 'Giclée prints from $35',
  },
  {
    catalogNumber: 3,
    title: "Don't Worry Be Hoppy",
    categories: ['prints'],
    medium: 'Giclée · 8 × 10 in · 2023',
    aspectRatio: '4/5',
    placeholderClass: 'art--hoppy',
    priceDisplay: 'Prints from $35',
  },
  {
    catalogNumber: 4,
    title: 'Morning Joe',
    categories: ['originals'],
    medium: 'Acrylic on panel · 12 × 16 in · 2024',
    aspectRatio: '3/4',
    placeholderClass: 'art--morningjoe',
    priceDisplay: 'Original available · prints from $40',
  },
  {
    catalogNumber: 5,
    title: 'Munchie Max',
    categories: ['prints', 'cats'],
    medium: 'Giclée · 11 × 14 in · 2023',
    aspectRatio: '4/5',
    placeholderClass: 'art--munchie',
    priceDisplay: 'Prints from $35',
  },
  {
    catalogNumber: 6,
    title: 'Calle Color',
    categories: ['originals', 'murals'],
    medium: 'Acrylic + spray study · 2025',
    aspectRatio: '5/4',
    placeholderClass: 'art--mural',
    priceDisplay: 'Commission inquiry only',
  },
  {
    catalogNumber: 7,
    title: 'Sol Mandala',
    categories: ['mandalas', 'prints'],
    medium: 'Ink · 12 × 12 in · 2024',
    aspectRatio: '1/1',
    placeholderClass: 'art--terracotta',
    priceDisplay: 'Prints from $35',
  },
  {
    catalogNumber: 8,
    title: 'Static Bloom',
    categories: ['originals'],
    medium: 'Acrylic study · 9 × 12 in · 2025',
    aspectRatio: '4/5',
    placeholderClass: 'art--neuroasis',
    priceDisplay: 'Original available',
  },
  {
    catalogNumber: 9,
    title: 'Field Notes',
    categories: ['prints', 'murals'],
    medium: 'Risograph · 8 × 8 in · 2025',
    aspectRatio: '1/1',
    placeholderClass: 'art--hoppy',
    priceDisplay: 'Prints from $30',
  },
  {
    catalogNumber: 10,
    title: 'Siesta',
    categories: ['originals', 'cats'],
    medium: 'Gouache · 10 × 14 in · 2024',
    aspectRatio: '3/4',
    placeholderClass: 'art--catnip',
    priceDisplay: 'Original available',
  },
  {
    catalogNumber: 11,
    title: 'Luna Mandala',
    categories: ['mandalas', 'prints'],
    medium: 'Ink + gouache · 18 × 18 in · 2024',
    aspectRatio: '1/1',
    placeholderClass: 'art--munchie',
    priceDisplay: 'Prints from $35',
  },
  {
    catalogNumber: 12,
    title: 'Andes, in passing',
    categories: ['originals', 'murals'],
    medium: 'Acrylic study · 2025',
    aspectRatio: '4/5',
    placeholderClass: 'art--morningjoe',
    priceDisplay: 'Original available',
  },
]

export const revalidate = 60

export default async function GalleryPage() {
  let artworks: ArtworkDoc[] = []
  let featured: ArtworkDoc | null = null

  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'artworks',
      sort: 'sortOrder',
      limit: 100,
      where: { _status: { equals: 'published' } },
    })
    artworks = res.docs as unknown as ArtworkDoc[]
    featured = artworks.find((a) => a.featured) || artworks[0] || null
  } catch {
    // DB not connected
  }

  const hasDbArtworks = artworks.length > 0

  return (
    <div className="section">
      <div className="wrap">
        <div className="chap" data-r>
          <div className="ttl">
            <span className="kicker k">Selected works</span>
            <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>Gallery</h2>
          </div>
        </div>
        <p className="lead" data-r style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          A digital wall of originals, prints, and experiments. It grows as the collection does, so wander, and come back often.
        </p>

        {/* Featured section — DB featured artwork or hardcoded Neuroasis */}
        {featured ? (
          <div className="gfeat" data-r>
            <Frame
              src={getImageUrl(featured.image as MediaDoc, 'full')}
              alt={getImageAlt(featured.image as MediaDoc)}
              aspectRatio="16/10"
            />
            <div className="txt">
              <span className="eyebrow">
                <StarIcon className="star" />
                Featured original
              </span>
              <h3 style={{ marginTop: '.8rem' }}>{featured.title}</h3>
              <p>
                {[featured.medium, featured.dimensions, featured.year && `${featured.year}`, featured.availability === 'available' && 'Original available'].filter(Boolean).join(' · ')}
              </p>
              <div style={{ marginTop: '1.4rem' }}>
                <Link className="btn" href="/connect">
                  Inquire about this piece <StarIcon className="star" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="gfeat" data-r>
            <Frame
              alt="Neuroasis, a large psychedelic painting (artwork placeholder)"
              aspectRatio="16/10"
              placeholderClass="art--neuroasis"
            />
            <div className="txt">
              <span className="eyebrow">
                <StarIcon className="star" />
                Featured original
              </span>
              <h3 style={{ marginTop: '.8rem' }}>Neuroasis</h3>
              <p>
                A bloom of order pulled out of noise, and the piece that grew into a whole vocabulary of shapes.
              </p>
              <span
                className="label"
                style={{
                  fontFamily: 'var(--grot)',
                  fontSize: '0.64rem',
                  letterSpacing: '0.04em',
                  color: 'var(--stone)',
                }}
              >
                Acrylic on canvas &middot; 24 &times; 30 in &middot; 2024 &middot; Original available
              </span>
              <div style={{ marginTop: '1.4rem' }}>
                <Link className="btn" href="/connect">
                  Inquire about this piece <StarIcon className="star" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <FilterChips filters={galleryFilters} items={null} targetId="catGrid" />

        <div className="cat-grid" id="catGrid">
          {hasDbArtworks
            ? artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  imageSrc={getImageUrl(artwork.image as MediaDoc, 'gallery')}
                  catalogNumber={artwork.catalogNumber}
                  title={artwork.title}
                  medium={artwork.medium}
                  dimensions={artwork.dimensions}
                  year={artwork.year}
                  categories={artwork.categories}
                  availability={artwork.availability}
                  priceDisplay={artwork.priceDisplay}
                />
              ))
            : FALLBACK_ARTWORKS.map((artwork) => (
                <ArtworkCard
                  key={artwork.catalogNumber}
                  placeholderClass={artwork.placeholderClass}
                  aspectRatio={artwork.aspectRatio}
                  catalogNumber={artwork.catalogNumber}
                  title={artwork.title}
                  medium={artwork.medium}
                  categories={artwork.categories}
                  priceDisplay={artwork.priceDisplay}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
