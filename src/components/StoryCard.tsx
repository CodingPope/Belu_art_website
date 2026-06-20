import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ArrowIcon } from './Icons'

type StoryCardProps = {
  href: string
  imageSrc?: string | null
  placeholderClass?: string
  category: string
  year?: string
  title: string
  excerpt: string
  categories?: string[]
}

export function StoryCard({
  href,
  imageSrc,
  placeholderClass = '',
  category,
  year,
  title,
  excerpt,
  categories = [],
}: StoryCardProps) {
  return (
    <Link className="story" href={href} data-cat={categories.join(' ')}>
      {imageSrc ? (
        <div className="img" style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover' }} />
        </div>
      ) : (
        <div className={`img art ${placeholderClass}`} role="img" aria-label={title} />
      )}
      <span className="cat">
        <StarIcon className="star" style={{ width: 10, height: 10 } as React.CSSProperties} />
        {category}
        {year && <span style={{ color: 'var(--stone)' }}> · {year}</span>}
      </span>
      <h3>{title}</h3>
      <p className="ex">{excerpt}</p>
      <span className="rm">
        Read more{' '}
        <ArrowIcon
          className="ar"
        />
      </span>
    </Link>
  )
}
