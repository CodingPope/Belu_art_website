'use client'

import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let io: IntersectionObserver | null = null
    let mo: MutationObserver | null = null

    const timer = setTimeout(() => {
      if (reduce) {
        document.querySelectorAll('[data-r]').forEach((el) => el.classList.add('in'))
        return
      }

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )

      document.querySelectorAll('[data-r]').forEach((el) => io!.observe(el))

      mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.hasAttribute('data-r')) io?.observe(node)
              node.querySelectorAll('[data-r]').forEach((el) => io?.observe(el))
            }
          })
        })
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }, 100)

    return () => {
      clearTimeout(timer)
      io?.disconnect()
      mo?.disconnect()
    }
  }, [])

  return null
}
