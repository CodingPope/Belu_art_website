import Image from 'next/image'

type FrameProps = {
  src?: string | null
  alt?: string
  aspectRatio?: string
  label?: {
    category?: string
    title?: string
    meta?: string
  }
  className?: string
  placeholderClass?: string
}

export function Frame({
  src,
  alt = '',
  aspectRatio = '4/5',
  label,
  className = '',
  placeholderClass = '',
}: FrameProps) {
  return (
    <div className={`frame ${className}`}>
      {src ? (
        <div style={{ aspectRatio, position: 'relative', width: '100%', overflow: 'hidden' }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div
          className={`art ${placeholderClass}`}
          style={{ aspectRatio }}
          role="img"
          aria-label={alt}
        />
      )}
      {label && (
        <div className="label">
          {label.category && <span className="cat">{label.category}</span>}
          {label.title && <span className="t">{label.title}</span>}
          {label.meta && <span className="m">{label.meta}</span>}
        </div>
      )}
    </div>
  )
}
