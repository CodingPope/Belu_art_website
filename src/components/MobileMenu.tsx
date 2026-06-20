'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CloseIcon } from './Icons'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  socialLinks?: { platform: string; url: string }[]
}

const navItems = [
  { href: '/', label: 'Home', num: '00' },
  { href: '/shop', label: 'Shop', num: '01' },
  { href: '/gallery', label: 'Gallery', num: '02' },
  { href: '/journal', label: 'Journal', num: '03' },
  { href: '/about', label: 'About', num: '04' },
  { href: '/connect', label: 'Connect', num: '05' },
  { href: '/cart', label: 'Cart', num: '✦' },
]

export function MobileMenu({ open, onClose, socialLinks = [] }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="menu-top">
        <span className="mark">
          <Image src="/logo.png" alt="Belu Malu" width={80} height={80} style={{ height: 50, width: 'auto' }} />
        </span>
        <button
          className="burger"
          onClick={onClose}
          aria-label="Close menu"
          style={{ display: 'block' }}
        >
          <svg style={{ width: 30, height: 30 }}>
            <CloseIcon />
          </svg>
        </button>
      </div>
      <nav className="menu-body" aria-label="Mobile">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <span className="n">{item.num}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="menu-foot">
        {socialLinks.map((link) => (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener">
            {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          </a>
        ))}
      </div>
    </div>
  )
}
