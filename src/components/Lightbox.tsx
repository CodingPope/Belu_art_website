'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { CloseIcon, StarIcon } from './Icons'

type LightboxData = {
  imageSrc?: string
  placeholderClass?: string
  category: string
  title: string
  medium: string
  availability: string
}

export function Lightbox() {
  const [data, setData] = useState<LightboxData | null>(null)

  const close = useCallback(() => setData(null), [])

  useEffect(() => {
    function handleOpen(e: Event) {
      setData((e as CustomEvent<LightboxData>).detail)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('bm-lightbox', handleOpen)
    document.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('bm-lightbox', handleOpen)
      document.removeEventListener('keydown', handleKey)
    }
  }, [close])

  useEffect(() => {
    document.body.style.overflow = data ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [data])

  if (!data) return null

  return (
    <div
      className="lightbox open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lbTitle"
    >
      <div className="lb-back" onClick={close} />
      <div className="lb-panel">
        <button className="lb-close" onClick={close} aria-label="Close detail view">
          <svg style={{ width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
            <CloseIcon />
          </svg>
        </button>
        <figure className="lb-art">
          {data.imageSrc ? (
            <div style={{ aspectRatio: '4/5', width: '100%', position: 'relative' }}>
              <Image src={data.imageSrc} alt={data.title} fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div className={`art ${data.placeholderClass || ''}`} style={{ aspectRatio: '4/5', width: '100%' }} />
          )}
        </figure>
        <div className="lb-info">
          <span className="cat">{data.category}</span>
          <h3 id="lbTitle">{data.title}</h3>
          <p className="med">{data.medium}</p>
          <p className="avail">{data.availability}</p>
          <div className="brow">
            <a className="btn" href="/shop">
              Shop prints <StarIcon className="star" />
            </a>
            <a className="ghost" href="/connect">
              Inquire
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
