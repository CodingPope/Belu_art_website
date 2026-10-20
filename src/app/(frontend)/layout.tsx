import React from 'react'
import type { Metadata } from 'next'
import { Archivo, Fraunces, Newsreader } from 'next/font/google'
import { Grain } from '@/components/Grain'
import { Thread } from '@/components/Thread'
import { Masthead } from '@/components/Masthead'
import { Footer } from '@/components/Footer'
import { Toast } from '@/components/Toast'
import { Lightbox } from '@/components/Lightbox'
import { ScrollReveal } from '@/components/ScrollReveal'
import { PageTransition } from '@/components/PageTransition'
import { ImageProtection } from '@/components/ImageProtection'
import { PromoPopup, type Promo } from '@/components/PromoPopup'
import { getSiteSettings, getPromotions } from './server'
import type { MediaDoc } from '@/types'
import { getImageUrl, getImageAlt } from '@/types'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Belu Malu — Chilean artist',
    template: '%s — Belu Malu',
  },
  description:
    'Art rooted in movement, memory, and joy. Playful, meaningful artwork by Chilean artist Belu Maluenda, based in the U.S.',
  openGraph: {
    title: 'Belu Malu — Art by Belu Maluenda',
    description:
      'Art rooted in movement, memory, and joy. Playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Belu Maluenda — Chilean artist' }],
    type: 'website',
    siteName: 'Belu Malu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belu Malu — Art by Belu Maluenda',
    description: 'Art rooted in movement, memory, and joy.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [siteSettings, promoDocs] = await Promise.all([getSiteSettings(), getPromotions()])

  // Only pass the fields the client needs
  const promos: Promo[] = (promoDocs as unknown as Record<string, unknown>[]).map((p) => ({
    id: String(p.id),
    campaignType: (p.campaignType as string) || 'sale',
    display: p.display === 'banner' ? 'banner' : 'modal',
    headline: p.headline as string,
    body: p.body as string | null,
    imageUrl: getImageUrl(p.image as MediaDoc, 'gallery'),
    imageAlt: getImageAlt(p.image as MediaDoc),
    ctaLabel: p.ctaLabel as string | null,
    ctaUrl: p.ctaUrl as string | null,
    targetPages: (p.targetPages as string[] | null)?.length ? (p.targetPages as string[]) : ['all'],
    startDate: p.startDate as string | null,
    endDate: p.endDate as string | null,
    triggerDelay: typeof p.triggerDelay === 'number' ? p.triggerDelay : 6,
    dismissFrequency: (p.dismissFrequency as string) || '7',
  }))

  const socialLinks =
    (siteSettings as Record<string, unknown>)?.socialLinks as
      | { platform: string; url: string; handle?: string }[]
      | undefined

  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <body className="loaded">
        <Grain />
        <Thread />
        <Masthead socialLinks={socialLinks || []} />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer
          footerText={(siteSettings as Record<string, unknown>)?.footerText as string}
          copyrightText={(siteSettings as Record<string, unknown>)?.copyrightText as string}
          socialLinks={socialLinks || []}
          emailSignupHeading={(siteSettings as Record<string, unknown>)?.emailSignupHeading as string}
          emailSignupBody={(siteSettings as Record<string, unknown>)?.emailSignupBody as string}
        />
        <Toast />
        <Lightbox />
        <PromoPopup promos={promos} />
        <ScrollReveal />
        <ImageProtection />
      </body>
    </html>
  )
}
