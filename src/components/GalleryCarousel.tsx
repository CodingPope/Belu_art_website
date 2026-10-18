'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon, StarIcon } from './Icons'

export type CarouselItem = {
  key: string
  src: string | null
  alt: string
  title: string
  meta: string
  status: string
  placeholderClass: string
}

type GalleryCarouselProps = {
  items: CarouselItem[]
  label: string
}

/*
 * Horizontal, swipeable artwork row built on native overflow scrolling + scroll-snap,
 * so it still works (as a plain scrollable row) without JS. Scrolling input:
 * touch swipe, trackpad horizontal swipe, and Shift+wheel are all native; a plain
 * vertical mouse wheel is deliberately left alone so it keeps scrolling the page.
 * JS adds prev/next buttons, arrow-key stepping, and a position counter.
 */
export function GalleryCarousel({ items, label }: GalleryCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const slides = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[]

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const left = track.scrollLeft
    const all = slides()
    const origin = all[0]?.offsetLeft ?? 0
    const end = left + track.clientWidth >= track.scrollWidth - 4
    setAtStart(left < 4)
    setAtEnd(end)
    // Counter tracks the first visible artwork, or the last one once the row is fully scrolled
    const first = all.findIndex((el) => el.offsetLeft - origin + el.offsetWidth / 2 >= left)
    setIndex(end ? items.length - 1 : Math.max(0, first))
  }, [items.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  function goTo(i: number) {
    const track = trackRef.current
    const all = slides()
    const target = all[Math.max(0, Math.min(items.length, i))]
    if (!track || !target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: target.offsetLeft - all[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length }
    if (!(e.key in keys)) return
    e.preventDefault()
    goTo(keys[e.key])
  }

  function openLightbox(item: CarouselItem) {
    window.dispatchEvent(
      new CustomEvent('bm-lightbox', {
        detail: {
          imageSrc: item.src,
          placeholderClass: item.placeholderClass,
          category: 'From the studio wall',
          title: item.title,
          medium: item.meta,
          availability: item.status,
        },
      }),
    )
  }

  return (
    <div className="gcar" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        className="gcar-track"
        ref={trackRef}
        tabIndex={0}
        aria-label="Artworks. Use the left and right arrow keys to browse."
        onKeyDown={onKeyDown}
      >
        {items.map((item) => (
          <li className="gcar-slide" key={item.key}>
            <div className="gcar-art">
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, 340px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className={`art ${item.placeholderClass}`} role="img" aria-label={item.alt} />
              )}
              <div className="gcar-over">
                {item.status && <span className="gcar-status">{item.status}</span>}
                <h3>{item.title}</h3>
                {item.meta && <span className="gcar-meta">{item.meta}</span>}
                <button type="button" className="gcar-cta" onClick={() => openLightbox(item)}>
                  View details
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </li>
        ))}
        <li className="gcar-slide gcar-more">
          <Link href="/gallery">
            <StarIcon className="star" />
            <span>See all the work</span>
            <ArrowIcon />
          </Link>
        </li>
      </ul>

      <div className="gcar-ctrl">
        <span className="gcar-count" aria-hidden="true">
          {String(Math.min(index + 1, items.length)).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <div className="gcar-btns">
          <button type="button" onClick={() => goTo(index - 1)} disabled={atStart} aria-label="Previous artwork">
            <ArrowIcon style={{ transform: 'scaleX(-1)' }} />
          </button>
          <button type="button" onClick={() => goTo(index + 1)} disabled={atEnd} aria-label="Next artwork">
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
