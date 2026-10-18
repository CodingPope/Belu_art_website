import Image from 'next/image'
import { StarIcon, ArrowIcon } from './Icons'
import { getImageUrl, getImageAlt } from '@/types'
import type { MarketDoc } from '@/types'
import { eventTypeLabels, formatEventDate } from '@/lib/events'

const placeholders = ['art--terracotta', 'art--munchie', 'art--catnip', 'art--morningjoe', 'art--mural']

type EventCardProps = {
  event: MarketDoc
  index?: number
  past?: boolean
}

export function EventCard({ event, index = 0, past = false }: EventCardProps) {
  const src = getImageUrl(event.image, 'gallery')
  const typeLabel = eventTypeLabels[event.eventType || ''] || 'Event'
  const isLive = event.status === 'live' && !past

  const body = (
    <>
      <div className="ev-img">
        {src ? (
          <Image
            src={src}
            alt={getImageAlt(event.image) || event.name}
            fill
            sizes="(max-width: 640px) 80vw, 300px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={`art ${placeholders[index % placeholders.length]}`} aria-hidden="true" />
        )}
        <span className="ev-date">{formatEventDate(event)}</span>
      </div>
      <div className="ev-body">
        <span className="ev-type">
          <StarIcon className="star" />
          {isLive ? 'Happening now' : typeLabel}
        </span>
        <h3>{event.name}</h3>
        {event.location && <span className="ev-loc">{event.location}</span>}
        {event.url && (
          <span className="ev-more">
            Details
            <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
              <ArrowIcon />
            </svg>
          </span>
        )}
      </div>
    </>
  )

  const className = `ev-card${isLive ? ' live' : ''}${past ? ' past' : ''}`

  return event.url ? (
    <a className={className} href={event.url} target="_blank" rel="noopener">
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}
