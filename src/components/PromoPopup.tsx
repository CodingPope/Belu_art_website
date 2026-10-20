'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CloseIcon, StarIcon } from './Icons'
import { EmailSignup } from './EmailSignup'
import { useFocusTrap } from '@/lib/useFocusTrap'

export type Promo = {
  id: string
  campaignType: string
  display: 'modal' | 'banner'
  headline: string
  body?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  targetPages: string[]
  startDate?: string | null
  endDate?: string | null
  triggerDelay: number
  dismissFrequency: string
}

const pagePaths: Record<string, string> = {
  home: '/',
  shop: '/shop',
  gallery: '/gallery',
  events: '/events',
  about: '/about',
  connect: '/connect',
}

const DAY = 24 * 60 * 60 * 1000
const storageKey = (id: string) => `bm-promo-${id}`

function matchesPage(promo: Promo, pathname: string) {
  return promo.targetPages.some((page) => {
    if (page === 'all') return true
    const path = pagePaths[page]
    if (!path) return false
    return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
  })
}

function isLive(promo: Promo, now: number) {
  if (promo.startDate && new Date(promo.startDate).getTime() > now) return false
  if (promo.endDate && new Date(promo.endDate).getTime() <= now) return false
  return true
}

// Storage can throw (private mode, blocked site data); treat that as "not dismissed"
function wasDismissed(promo: Promo, now: number) {
  try {
    if (promo.dismissFrequency === 'session') return sessionStorage.getItem(storageKey(promo.id)) !== null
    const value = localStorage.getItem(storageKey(promo.id))
    if (value === null) return false
    if (promo.dismissFrequency === 'never') return true
    return now - Number(value) < Number(promo.dismissFrequency) * DAY
  } catch {
    return false
  }
}

function rememberDismissal(promo: Promo) {
  try {
    if (promo.dismissFrequency === 'session') sessionStorage.setItem(storageKey(promo.id), '1')
    else localStorage.setItem(storageKey(promo.id), String(Date.now()))
  } catch {
    // Without storage it may show again next visit; nothing else to do
  }
}

export function PromoPopup({ promos }: { promos: Promo[] }) {
  const pathname = usePathname()
  const [active, setActive] = useState<Promo | null>(null)
  const shownThisVisit = useRef(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  const isModal = active?.display === 'modal'
  useFocusTrap(dialogRef, isModal)

  // Pick and schedule the highest-priority promo for this page (promos arrive sorted by priority)
  useEffect(() => {
    if (active && !matchesPage(active, pathname)) setActive(null)
    if (shownThisVisit.current || promos.length === 0) return

    const now = Date.now()
    const promo = promos.find((p) => isLive(p, now) && matchesPage(p, pathname) && !wasDismissed(p, now))
    if (!promo) return

    let timer: ReturnType<typeof setTimeout>
    const show = () => {
      // Don't stack on top of the mobile menu or lightbox, which lock body scroll
      if (document.body.style.overflow === 'hidden') {
        timer = setTimeout(show, 3000)
        return
      }
      shownThisVisit.current = true
      setActive(promo)
    }
    timer = setTimeout(show, Math.max(0, promo.triggerDelay) * 1000)
    return () => clearTimeout(timer)
  }, [pathname, promos, active])

  const close = useCallback(() => {
    if (active) rememberDismissal(active)
    setActive(null)
  }, [active])

  useEffect(() => {
    if (!active) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    if (isModal) document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      if (isModal) document.body.style.overflow = ''
    }
  }, [active, isModal, close])

  if (!active) return null

  const headingId = `promo-h-${active.id}`
  const bodyId = `promo-b-${active.id}`
  const isNewsletter = active.campaignType === 'newsletter'

  const content = (
    <>
      <button type="button" className="promo-close" onClick={close} aria-label="Close">
        <svg style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
          <CloseIcon />
        </svg>
      </button>
      {isModal && active.imageUrl && (
        <div className="promo-img">
          <Image src={active.imageUrl} alt={active.imageAlt || ''} fill sizes="420px" style={{ objectFit: 'cover' }} />
        </div>
      )}
      <div className="promo-txt">
        <span className="eyebrow">
          <StarIcon className="star" />
          {{ sale: 'Print sale', launch: 'New collection', event: 'Come say hi', newsletter: 'First access' }[
            active.campaignType
          ] || 'News'}
        </span>
        <h2 id={headingId}>{active.headline}</h2>
        {active.body && <p id={bodyId}>{active.body}</p>}
        {isNewsletter ? (
          <EmailSignup id="joinPromo" source="promo" />
        ) : (
          active.ctaUrl &&
          active.ctaLabel &&
          (active.ctaUrl.startsWith('/') ? (
            <Link className="btn" href={active.ctaUrl} onClick={close}>
              {active.ctaLabel} <StarIcon className="star" />
            </Link>
          ) : (
            <a className="btn" href={active.ctaUrl} target="_blank" rel="noopener" onClick={close}>
              {active.ctaLabel} <StarIcon className="star" />
            </a>
          ))
        )}
      </div>
    </>
  )

  if (!isModal) {
    return (
      <aside className="promo-banner" aria-labelledby={headingId}>
        {content}
      </aside>
    )
  }

  return (
    <div className="promo-modal">
      <div className="promo-back" onClick={close} aria-hidden="true" />
      <div
        className={`promo-panel${active.imageUrl ? ' has-img' : ''}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={active.body ? bodyId : undefined}
      >
        {content}
      </div>
    </div>
  )
}
