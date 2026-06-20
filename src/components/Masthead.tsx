'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CartIcon, MenuIcon, StarIcon } from './Icons'
import { MobileMenu } from './MobileMenu'

type MastheadProps = {
  socialLinks?: { platform: string; url: string }[]
}

const navItems = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/connect', label: 'Connect' },
]

export function Masthead({ socialLinks = [] }: MastheadProps) {
  const pathname = usePathname()
  const [isSmall, setIsSmall] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    let small = false
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop
      if (!small && y > 60) {
        small = true
        setIsSmall(true)
      } else if (small && y < 10) {
        small = false
        setIsSmall(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`mast ${isSmall ? 'small' : ''}`}>
        <div className="wrap mast-in">
          <Link className="brand" href="/" aria-label="Belu Malu, home">
            <span className="mark">
              <Image
                src="/logo.png"
                alt="Belu Malu"
                width={120}
                height={120}
                priority
                style={{ height: undefined, width: 'auto' }}
              />
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                {...(pathname === item.href ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </Link>
            ))}
            <Link className="mast-cart" href="/cart" aria-label="Cart, 0 items">
              <CartIcon className="icon" />
              Cart (<b>0</b>)
            </Link>
          </nav>
          <button
            className="burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg style={{ width: 30, height: 30 }}>
              <MenuIcon />
            </svg>
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} socialLinks={socialLinks} />
    </>
  )
}
