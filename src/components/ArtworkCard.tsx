'use client'

import { Frame } from './Frame'
import { ZoomIcon } from './Icons'

type ArtworkCardProps = {
  imageSrc?: string | null
  placeholderClass?: string
  aspectRatio?: string
  catalogNumber?: number
  title: string
  medium?: string
  dimensions?: string
  year?: number
  categories?: string[]
  availability?: string
  priceDisplay?: string
  categoryLabel?: string
}

export function ArtworkCard({
  imageSrc,
  placeholderClass = '',
  aspectRatio = '4/5',
  catalogNumber,
  title,
  medium,
  dimensions,
  year,
  categories = [],
  availability,
  priceDisplay,
  categoryLabel,
}: ArtworkCardProps) {
  const catNum = catalogNumber ? String(catalogNumber).padStart(2, '0') : ''
  const mediumLine = [medium, dimensions, year].filter(Boolean).join(' · ')
  const catLabel = categoryLabel || `Cat. ${catNum}`

  function openLightbox() {
    window.dispatchEvent(
      new CustomEvent('bm-lightbox', {
        detail: {
          imageSrc,
          placeholderClass,
          category: catLabel,
          title,
          medium: mediumLine,
          availability: priceDisplay || availability || '',
        },
      }),
    )
  }

  return (
    <figure className="cat-item" data-cat={categories.join(' ')} style={{ margin: '0 0 clamp(1.6rem, 2.6vw, 2.4rem)' }}>
      <Frame
        src={imageSrc}
        alt={title}
        aspectRatio={aspectRatio}
        placeholderClass={placeholderClass}
        label={{
          category: catLabel,
          title,
          meta: mediumLine,
        }}
      />
      <button className="view-btn" onClick={openLightbox}>
        <svg style={{ width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, color: 'var(--red)' }}>
          <ZoomIcon />
        </svg>
        View details
      </button>
    </figure>
  )
}
