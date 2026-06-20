'use client'

import { useEffect, useRef } from 'react'
import { StarIcon } from './Icons'

export function Thread() {
  const fillRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`
      if (needleRef.current) needleRef.current.style.top = `${p * 100}%`
      if (topRef.current) topRef.current.style.width = `${p * 100}%`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div className="thread" aria-hidden="true">
        <div className="base" />
        <div className="fill" ref={fillRef} />
        <div className="cap">
          <StarIcon className="star" style={{ width: 12, height: 12 }} />
        </div>
        <div className="needle" ref={needleRef}>
          <StarIcon className="star" style={{ width: 11, height: 11 }} />
        </div>
      </div>
      <div className="thread-top" ref={topRef} aria-hidden="true" />
      <div className="rail-label" aria-hidden="true">
        Belu Malu · made for joy
      </div>
    </>
  )
}
