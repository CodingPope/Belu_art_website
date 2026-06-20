'use client'

import { useState } from 'react'

type EmailSignupProps = {
  id: string
  source: string
  buttonText?: string
}

export function EmailSignup({ id, source, buttonText = 'Join' }: EmailSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        window.dispatchEvent(
          new CustomEvent('bm-toast', { detail: "You're on the list" }),
        )
      } else {
        const data = await res.json()
        if (data.error === 'already_subscribed') {
          setStatus('success')
          window.dispatchEvent(
            new CustomEvent('bm-toast', { detail: "You're already on the list!" }),
          )
        } else {
          setStatus('error')
        }
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <label className="vh" htmlFor={id}>
        Email address
      </label>
      <div className="field">
        <input
          id={id}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button type="button" onClick={handleSubmit} disabled={status === 'loading'}>
          {status === 'loading' ? '...' : buttonText}
        </button>
      </div>
    </>
  )
}
