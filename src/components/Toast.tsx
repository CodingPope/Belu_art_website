'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from './Icons'

export function Toast() {
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    function handleToast(e: Event) {
      const detail = (e as CustomEvent).detail
      setMessage(detail)
      setShow(true)
      setTimeout(() => setShow(false), 2600)
    }
    window.addEventListener('bm-toast', handleToast)
    return () => window.removeEventListener('bm-toast', handleToast)
  }, [])

  return (
    <div className={`toast ${show ? 'show' : ''}`} role="status" aria-live="polite">
      <StarIcon className="star" />
      <span>{message}</span>
    </div>
  )
}
