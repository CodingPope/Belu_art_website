import Link from 'next/link'
import Image from 'next/image'
import { EmailSignup } from './EmailSignup'

type FooterProps = {
  footerText?: string
  copyrightText?: string
  socialLinks?: { platform: string; url: string; handle?: string }[]
  emailSignupHeading?: string
  emailSignupBody?: string
}

export function Footer({
  footerText = 'Made and shared for the joy of it. Thank you for supporting the dream.',
  copyrightText = '© 2026 Belu Malu · Art by Belu Maluenda',
  socialLinks = [],
  emailSignupHeading = 'Join the journey',
  emailSignupBody = 'New work, stories, and market dates.',
}: FooterProps) {
  return (
    <footer className="foot">
      <svg
        className="foot-andes"
        viewBox="0 0 1200 13"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 12L20 1L40 12L60 1L80 12L100 1L120 12L140 1L160 12L180 1L200 12L220 1L240 12L260 1L280 12L300 1L320 12L340 1L360 12L380 1L400 12L420 1L440 12L460 1L480 12L500 1L520 12L540 1L560 12L580 1L600 12L620 1L640 12L660 1L680 12L700 1L720 12L740 1L760 12L780 1L800 12L820 1L840 12L860 1L880 12L900 1L920 12L940 1L960 12L980 1L1000 12L1020 1L1040 12L1060 1L1080 12L1100 1L1120 12L1140 1L1160 12L1180 1L1200 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
      <div className="wrap foot-in">
        <div className="foot-brand">
          <span className="mark">
            <Image src="/logo.png" alt="Belu Malu" width={110} height={110} style={{ height: 110, width: 'auto' }} />
          </span>
          <p>{footerText}</p>
        </div>
        <div className="foot-col">
          <h4>Explore</h4>
          <Link href="/shop">Shop</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          <Link href="/connect">Connect</Link>
        </div>
        <div className="foot-col">
          <h4>Support</h4>
          <Link href="/connect">Commissions</Link>
          <Link href="/connect">Originals</Link>
          <Link href="/connect">Stockists &amp; wholesale</Link>
          <Link href="/connect">Past favourites</Link>
        </div>
        <div className="foot-col">
          <h4>{emailSignupHeading}</h4>
          <p>{emailSignupBody}</p>
          <EmailSignup id="joinFoot" source="footer" />
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>{copyrightText}</span>
        <nav className="foot-social" aria-label="Social">
          {socialLinks.map((link) => (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener">
              {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
