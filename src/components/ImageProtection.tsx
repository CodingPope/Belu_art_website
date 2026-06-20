'use client'

import { useEffect } from 'react'

export function ImageProtection() {
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('.frame, .art, .lb-art')) {
        e.preventDefault()
      }
    }

    function handleDragStart(e: DragEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return null
}
