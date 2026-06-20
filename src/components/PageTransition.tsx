'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitioning, setTransitioning] = useState(false)
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPath.current) {
      setTransitioning(true)
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setTransitioning(false)
        window.scrollTo(0, 0)
        prevPath.current = pathname
      }, 300)
      return () => clearTimeout(timeout)
    } else {
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <div
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(8px)' : 'none',
        transition: 'opacity 0.3s cubic-bezier(.22,.68,.12,1), transform 0.3s cubic-bezier(.22,.68,.12,1)',
      }}
    >
      {displayChildren}
    </div>
  )
}
