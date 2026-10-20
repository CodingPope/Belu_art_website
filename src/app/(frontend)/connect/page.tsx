import type { Metadata } from 'next'
import Image from 'next/image'
import { payloadClient, getSiteSettings } from '../server'
import { ContactForm } from '@/components/ContactForm'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import type { SocialLink } from '@/types'

export const metadata: Metadata = {
  title: 'Connect',
  description:
    'Quick links to the shop, events, and socials, plus commissions, originals, and stockist inquiries. Belu reads every message herself.',
}

export const revalidate = 60

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  ebay: 'eBay',
  reddit: 'Reddit',
  discord: 'Discord',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const defaultSocials: SocialLink[] = [
  { platform: 'instagram', handle: '@belumaluarts', url: 'https://www.instagram.com/belumaluarts/' },
  { platform: 'ebay', handle: 'belumaluarts', url: 'https://www.ebay.com/usr/belumaluarts' },
  { platform: 'reddit', handle: 'u/BeluMalu', url: 'https://www.reddit.com/user/BeluMalu/' },
  { platform: 'discord', handle: 'Join the server', url: 'https://discord.com/invite/JDhb9sNH5n' },
  { platform: 'facebook', handle: 'belumaluarts', url: 'https://www.facebook.com/belumaluarts' },
]

function DirLink({
  href,
  kicker,
  title,
  wide = false,
}: {
  href: string
  kicker?: string
  title: string
  wide?: boolean
}) {
  const className = `lt-link${wide ? ' lt-wide' : ''}`
  const inner = (
    <>
      <span className="lt-txt">
        {kicker && <span className="lt-k">{kicker}</span>}
        <span className="lt-t">{title}</span>
      </span>
      <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }} aria-hidden="true">
        <ArrowIcon />
      </svg>
    </>
  )
  if (href.startsWith('mailto:')) {
    return (
      <a className={className} href={href}>
        {inner}
      </a>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      {inner}
    </a>
  )
}

export default async function ConnectPage() {
  let connectData: Record<string, unknown> = {}
  try {
    const payload = await payloadClient()
    connectData = (await payload.findGlobal({ slug: 'connect-page' })) as Record<string, unknown>
  } catch {
    // DB not connected — render with defaults
  }
  const siteSettings = (await getSiteSettings()) as Record<string, unknown> | null

  const leadText =
    (connectData.leadText as string) ||
    "For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I'd love to hear from you. I read every message myself."
  const inPersonText = (connectData.inPersonText as string) || ''
  const consentText =
    (connectData.newsletterConsentText as string) ||
    "Yes, add me to Belu's email list for new work, print drops, and event dates. Unsubscribe anytime."


  const cmsSocials = (siteSettings?.socialLinks as SocialLink[] | undefined) || []
  const socials = cmsSocials.length > 0 ? cmsSocials : defaultSocials
  const contactEmail = (siteSettings?.contactEmail as string) || 'hello@belumalu.com'
  const primaryHandle = socials.find((s) => s.platform === 'instagram')?.handle || '@belumaluarts'

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
          <section className="ltree" aria-labelledby="lt-head" data-r>
            <div className="lt-head">
              <span className="lt-logo">
                <Image src="/logo.png" alt="" width={64} height={64} style={{ width: 'auto', height: 56 }} />
              </span>
              <div>
                <h3 id="lt-head">Belu Malu</h3>
                <span className="kicker">{primaryHandle}</span>
              </div>
            </div>
            <div className="kicker lt-sub">
              <StarIcon className="star" /> Find me online
            </div>
            <nav className="lt-social" aria-label="Social links">
              {socials.map((link) => (
                <DirLink
                  key={link.platform + link.url}
                  href={link.url}
                  kicker={platformLabels[link.platform] || link.platform}
                  title={link.handle || platformLabels[link.platform] || link.platform}
                />
              ))}
              <DirLink href={`mailto:${contactEmail}`} kicker="Prefer email?" title={contactEmail} wide />
            </nav>
            {inPersonText && <p className="lt-inperson">{inPersonText}</p>}
          </section>

          <section aria-label="Contact form" data-r>
            <p className="lead">{leadText}</p>
            <ContactForm consentText={consentText} />
          </section>
        </div>
      </div>
    </div>
  )
}
