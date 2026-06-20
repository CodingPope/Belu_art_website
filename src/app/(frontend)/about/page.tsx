import type { Metadata } from 'next'
import Link from 'next/link'
import { payloadClient } from '../server'

export const metadata: Metadata = {
  title: 'About',
  description: 'Born in Santiago, raised in the U.S. The story of Belu Maluenda — Chilean artist, based in the U.S.',
}
import { Frame } from '@/components/Frame'
import { StarIcon } from '@/components/Icons'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Chapter = {
  title: string
  content?: unknown
  defaultParagraphs?: string[]
}

const defaultChaptersBefore: Chapter[] = [
  {
    title: 'Chile',
    defaultParagraphs: [
      "My story starts in Santiago. It’s the place my family comes from, the sound of the language I grew up half-speaking, and the colour I keep reaching for in the work. For years it was a country I knew mostly through memory and distance.",
    ],
  },
  {
    title: 'The U.S.',
    defaultParagraphs: [
      "Growing up in the States, I learned to live between two worlds. There was comfort in it, but also a quiet ache, the sense that some part of me was waiting on the other side of the equator to be claimed.",
    ],
  },
  {
    title: 'South America',
    defaultParagraphs: [
      "After finishing my studies, I returned to South America to travel, reconnect with my Chilean roots, and to save my wilting Spanish. I embarked on a seven-month solo backpacking trip that quietly rearranged me.",
      "My travels brought some wildly unexpected internal spring-cleaning. Some big-hearted fellow travellers, several perspective-shifting experiences, and a few sacred medicines helped me undergo a period of intensive physical and emotional detoxing.",
    ],
  },
]

const defaultChapterAfter: Chapter = {
  title: 'The Work',
  defaultParagraphs: [
    "Throughout the process I began to feel healthier, more focused, more vibrantly alive, and more like myself. I unblocked and reawakened passions and drives that had been dormant since childhood. Since then, I’ve been in hot pursuit of my dream of spending my days making and sharing my art.",
    "Every day I get a little better at silencing my inner critic, and creating purely for the joy of it. I strive to keep a healthy relationship with my body, a mindful perspective, and a playful approach to creativity. Along the way, I hope to share a few of the things I make, with the hope that they bring a little light and joy into other people’s lives too.",
  ],
}

function ChapterBlock({
  chapter,
  index,
}: {
  chapter: Chapter
  index: number
}) {
  return (
    <>
      <div className="achap" data-r>
        <span className="num">{String(index + 1).padStart(2, '0')}</span>
        <h2>{chapter.title}</h2>
        <span className="ln" />
      </div>
      {chapter.content ? (
        <div data-r>
          <RichText data={chapter.content as Parameters<typeof RichText>[0]['data']} />
        </div>
      ) : (
        chapter.defaultParagraphs?.map((text, i) => (
          <p key={i} data-r>{text}</p>
        ))
      )}
    </>
  )
}

export const revalidate = 60

export default async function AboutPage() {
  let aboutData: Record<string, unknown> = {}

  try {
    const payload = await payloadClient()
    aboutData = (await payload.findGlobal({ slug: 'about-page' })) as Record<string, unknown>
  } catch {
    // DB not connected
  }

  const intro = (aboutData.intro as string) || "Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn’t fully express."

  const dbChapters = aboutData.chapters as { title: string; content?: unknown }[] | undefined

  // Split DB chapters into before-pullquote (01-03) and after-pullquote (04)
  const chaptersBefore: Chapter[] = dbChapters
    ? dbChapters.slice(0, 3).map((ch, i) => ({
        ...ch,
        defaultParagraphs: defaultChaptersBefore[i]?.defaultParagraphs,
      }))
    : defaultChaptersBefore

  const chapterAfter: Chapter = dbChapters && dbChapters[3]
    ? { ...dbChapters[3], defaultParagraphs: defaultChapterAfter.defaultParagraphs }
    : defaultChapterAfter

  const pullQuote = (aboutData.pullQuote as string) || 'Who I am is not rooted in where I come from, but in the things I love to do.'
  const pullQuoteAttribution = (aboutData.pullQuoteAttribution as string) || 'Belu Maluenda'
  const studioHeading = (aboutData.studioHeading as string) || 'Made by hand, shared with heart'
  const studioText = (aboutData.studioText as string) || "Most days you’ll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it."
  const journeyStops = (aboutData.journeyStops as { place: string; description?: string }[]) || [
    { place: 'Chile', description: 'Santiago. Where it began.' },
    { place: 'The U.S.', description: 'Where I grew up, with one foot in each country.' },
    { place: 'South America', description: 'Seven months, solo, and a sense of self I could finally feel.' },
    { place: 'The Work', description: 'Making and sharing art, for the joy of it.' },
  ]

  return (
    <div className="section">
      <div className="wrap">
        {/* 1. Header */}
        <div className="ahead" data-r>
          <span className="eyebrow">
            <StarIcon className="star" />
            Belu Maluenda · Artist
          </span>
          <h1>About</h1>
        </div>

        {/* 2-5. Intro + Chapters 01-03 */}
        <div className="essay">
          <p className="dropcap" data-r>{intro}</p>

          {chaptersBefore.map((chapter, i) => (
            <ChapterBlock key={i} chapter={chapter} index={i} />
          ))}
        </div>

        {/* 6. Pull quote */}
        <div className="pq" data-r>
          <StarIcon className="star" />
          <p>{pullQuote}</p>
          <cite>{pullQuoteAttribution}</cite>
        </div>

        {/* 7. Chapter 04 - The Work (AFTER the pull quote) */}
        <div className="essay">
          <ChapterBlock chapter={chapterAfter} index={3} />
        </div>

        {/* 8. Studio section */}
        <div className="pband" data-r>
          <div className="pic">
            <Frame
              alt="Belu in the studio"
              aspectRatio="4/5"
              placeholderClass="art--studio"
              label={{
                category: 'In the studio',
                title: 'Belu, at the easel',
                meta: 'Photograph · your image here',
              }}
            />
          </div>
          <div className="txt">
            <span className="eyebrow">
              <StarIcon className="star" />
              The studio
            </span>
            <h3 style={{ marginTop: '.8rem' }}>{studioHeading}</h3>
            <p>{studioText}</p>
          </div>
        </div>

        {/* 9. Journey stops timeline */}
        <div className="route" data-r>
          <div className="center" style={{ marginBottom: '2rem' }}>
            <span className="eyebrow">
              <StarIcon className="star" />
              The journey
            </span>
          </div>
          <div>
            {journeyStops.map((stop, i) => (
              <div className="stop" key={i}>
                <div className="pl">{stop.place}</div>
                <div className="ds">{stop.description}</div>
              </div>
            ))}
          </div>
          {/* 10. CTAs */}
          <div className="center" style={{ marginTop: '2.6rem', display: 'flex', gap: '.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn" href="/gallery">
              See the work <StarIcon className="star" />
            </Link>
            <Link className="ghost" href="/connect">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
