import type { Metadata } from 'next'
import Link from 'next/link'
import { payloadClient } from '../server'
import { EventCard } from '@/components/EventCard'
import { EmailSignup } from '@/components/EmailSignup'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import type { MarketDoc } from '@/types'
import { groupEvents, fallbackEvents, formatEventDate } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Markets, pop-ups, and shows where you can meet Belu and see the work in person.',
}

export const revalidate = 60

export default async function EventsPage() {
  let events: MarketDoc[] = []

  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: 'markets',
      sort: 'sortOrder',
      depth: 1,
      limit: 100,
    })
    events = res.docs as unknown as MarketDoc[]
  } catch {
    // DB not connected — render with defaults
  }

  const { upcoming, stockists, past } = groupEvents(events.length > 0 ? events : fallbackEvents)

  return (
    <div className="section">
      <div className="wrap">
        <div className="chap" data-r>
          <div className="ttl">
            <span className="kicker k">Events</span>
            <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>Come say hi</h2>
            <p className="mod-sub">
              Markets, pop-ups, and shows where you can see the work in person. New dates land here and on
              Instagram first.
            </p>
          </div>
        </div>

        <section className="ev-block" aria-labelledby="ev-upcoming" data-r>
          <span className="kicker" id="ev-upcoming">Upcoming</span>
          {upcoming.length > 0 ? (
            <div className="ev-grid">
              {upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="mod-news" style={{ paddingInline: 'clamp(1.2rem, 3vw, 2rem)' }}>
              <p className="ev-empty">No dates on the calendar right now. Join the list and you&apos;ll hear first.</p>
              <EmailSignup id="joinEvents" source="events" />
            </div>
          )}
        </section>

        {stockists.length > 0 && (
          <section className="ev-block" aria-labelledby="ev-stockists" data-r>
            <span className="kicker" id="ev-stockists">Find the work year-round</span>
            {stockists.map((shop) => (
              <div className={`mrow ${shop.status === 'live' ? 'live' : ''}`} key={shop.id}>
                <StarIcon className="star" />
                <span className="w">
                  {shop.url ? (
                    <a href={shop.url} target="_blank" rel="noopener">
                      {shop.name}
                    </a>
                  ) : (
                    shop.name
                  )}
                </span>
                <span className="meta">{[shop.location, formatEventDate(shop)].filter(Boolean).join(' · ')}</span>
              </div>
            ))}
          </section>
        )}

        {past.length > 0 && (
          <section className="ev-block" aria-label="Past events" data-r>
            <details className="ev-archive">
              <summary>Past events ({past.length})</summary>
              <div className="ev-grid">
                {past.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} past />
                ))}
              </div>
            </details>
          </section>
        )}

        <div className="ev-block" data-r>
          <Link className="link" href="/connect">
            Want me at your market or event? Get in touch
            <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
              <ArrowIcon />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
