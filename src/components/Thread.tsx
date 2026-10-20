'use client'

import { useEffect, useRef } from 'react'
import { StarIcon } from './Icons'

// Pages that scroll less than this don't get a progress indicator on mobile
const MIN_SCROLLABLE = 120

export function Thread() {
  const fillRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    function update() {
      frame = 0
      const y = window.scrollY || root.scrollTop
      const h = root.scrollHeight - window.innerHeight
      const p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`
      if (needleRef.current) needleRef.current.style.top = `${p * 100}%`
      // Read by the mobile progress motif in the masthead
      root.style.setProperty('--scroll', p.toFixed(4))
      root.dataset.scrollable = h > MIN_SCROLLABLE ? 'true' : 'false'
      root.dataset.scrollEnd = p > 0.985 ? 'true' : 'false'
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Page height changes as images load or routes change
    const ro = new ResizeObserver(onScroll)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      ro.disconnect()
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
        <div className="cap cap-end">
          <StarIcon className="star" style={{ width: 12, height: 12 }} />
        </div>
        <div className="needle" ref={needleRef}>
          <StarIcon className="star" style={{ width: 11, height: 11 }} />
        </div>
      </div>
      <div className="rail-label" aria-hidden="true">
        Belu Malu · made for joy
      </div>
    </>
  )
}
