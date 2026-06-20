'use client'

import { useState } from 'react'
import { StarIcon, ArrowIcon } from '@/components/Icons'

const socialDefaults = [
  { platform: 'Instagram', handle: '@belumaluarts', url: 'https://www.instagram.com/belumaluarts/' },
  { platform: 'eBay', handle: 'belumaluarts', url: 'https://www.ebay.com/usr/belumaluarts' },
  { platform: 'Reddit', handle: 'u/BeluMalu', url: 'https://www.reddit.com/user/BeluMalu/' },
  { platform: 'Discord', handle: 'Join the server', url: 'https://discord.com/invite/JDhb9sNH5n' },
  { platform: 'Facebook', handle: 'belumaluarts', url: 'https://www.facebook.com/belumaluarts' },
]

export default function ConnectPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'general', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', type: 'general', message: '' })
        window.dispatchEvent(new CustomEvent('bm-toast', { detail: 'Message sent! I\'ll be in touch.' }))
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="section">
      <div className="wrap">
        <div className="chap" data-r>
          <div className="ttl">
            <span className="kicker k">Say hello</span>
            <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>Connect</h2>
          </div>
        </div>
        <div className="cgrid">
          <div data-r>
            <p className="lead">
              For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I&apos;d love to hear from you. I read every message myself.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{
                  fontFamily: 'var(--grot)', fontSize: '.84rem', padding: '.85em 1em',
                  border: '1px solid var(--ink)', borderRadius: 2, background: 'var(--paper)',
                  color: 'var(--ink)', cursor: 'pointer',
                }}
              >
                <option value="general">General inquiry</option>
                <option value="commission">Commission</option>
                <option value="original">Original purchase</option>
                <option value="wholesale">Wholesale / Stockist</option>
              </select>
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                style={{
                  fontFamily: 'var(--grot)', fontSize: '.84rem', padding: '.85em 1em',
                  border: '1px solid var(--ink)', borderRadius: 2, background: 'var(--paper)',
                  color: 'var(--ink)', resize: 'vertical',
                }}
              />
              <button className="btn" type="submit" disabled={status === 'loading'} style={{ alignSelf: 'flex-start' }}>
                {status === 'loading' ? 'Sending...' : 'Send message'} <StarIcon className="star" />
              </button>
              {status === 'success' && (
                <p style={{ fontFamily: 'var(--grot)', fontSize: '.8rem', color: 'var(--pine)' }}>
                  Message sent! I&apos;ll get back to you soon.
                </p>
              )}
            </form>

            <p style={{ fontFamily: 'var(--read)', color: 'var(--ink-2)', marginTop: '2rem' }}>
              In person, find Belu Malu tees, prints, and stickers at every <strong>Abstract Denver</strong> location.
            </p>
          </div>
          <div data-r>
            <div className="kicker" style={{ marginBottom: '1.1rem' }}>Find me online</div>
            <nav className="slist" aria-label="Social links">
              {socialDefaults.map((link) => (
                <a key={link.platform} href={link.url} target="_blank" rel="noopener">
                  {link.platform} <span className="h">{link.handle}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
