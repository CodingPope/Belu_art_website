export type MediaDoc = {
  id: string
  url?: string | null
  alt: string
  sizes?: {
    thumbnail?: { url?: string | null }
    gallery?: { url?: string | null }
    full?: { url?: string | null }
  }
}

export type ArtworkDoc = {
  id: string
  title: string
  slug: string
  catalogNumber?: number
  image: MediaDoc | string
  medium?: string
  dimensions?: string
  year?: number
  categories?: string[]
  availability?: string
  priceDisplay?: string
  description?: unknown
  featured?: boolean
  sortOrder?: number
}

export type ProductDoc = {
  id: string
  title: string
  slug: string
  image?: MediaDoc | string | null
  category?: string
  price?: number
  priceDisplay?: string
  status?: string
  description?: unknown
  relatedArtwork?: ArtworkDoc | string | null
  sortOrder?: number
}

export type JournalPostDoc = {
  id: string
  title: string
  slug: string
  coverImage?: MediaDoc | string | null
  categories?: string[]
  publishedDate?: string
  excerpt?: string
  content?: unknown
  featured?: boolean
  sortOrder?: number
}

export type MarketDoc = {
  id: string
  name: string
  location?: string
  status?: string
  dateInfo?: string
  sortOrder?: number
}

export type SocialLink = {
  platform: string
  url: string
  handle?: string
}

export function getImageUrl(media: MediaDoc | string | null | undefined, size?: 'thumbnail' | 'gallery' | 'full'): string | null {
  if (!media) return null
  if (typeof media === 'string') return null
  if (size && media.sizes?.[size]?.url) return media.sizes[size]!.url!
  return media.url || null
}

export function getImageAlt(media: MediaDoc | string | null | undefined): string {
  if (!media || typeof media === 'string') return ''
  return media.alt || ''
}
