import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST() {
  try {
    const payload = await getPayload({ config: await config })

    const results: string[] = []

    // Check if already seeded
    const existing = await payload.find({ collection: 'artworks', limit: 1 })
    if (existing.docs.length > 0) {
      return NextResponse.json({ message: 'Already seeded', results: ['Database already has data'] })
    }

    // Seed markets
    const marketsData = [
      { name: 'Abstract Denver', status: 'live' as const, dateInfo: 'Stocked now · all locations', sortOrder: 1 },
      { name: "Spring Maker's Market", status: 'upcoming' as const, location: 'Denver, CO', dateInfo: 'Denver, CO · dates TBA', sortOrder: 2 },
      { name: 'Summer Art Walk', status: 'tba' as const, dateInfo: 'Announced soon', sortOrder: 3 },
    ]
    for (const market of marketsData) {
      await payload.create({ collection: 'markets', data: market })
    }
    results.push('Seeded 3 markets')

    // Seed artworks
    const artworksData = [
      { title: 'Tito on Catnip', slug: 'tito-on-catnip', catalogNumber: 1, medium: 'Acrylic on canvas', dimensions: '16 × 20 in', year: 2024, categories: ['originals', 'cats'] as ('originals' | 'cats')[], availability: 'available' as const, priceDisplay: 'Original available · prints from $40', featured: true, sortOrder: 1 },
      { title: 'Tito Mandala', slug: 'tito-mandala', catalogNumber: 2, medium: 'Ink + gouache', dimensions: '18 × 18 in', year: 2024, categories: ['mandalas', 'prints', 'cats'] as ('mandalas' | 'prints' | 'cats')[], availability: 'prints-only' as const, priceDisplay: 'Giclée prints from $35', sortOrder: 2 },
      { title: "Don't Worry Be Hoppy", slug: 'dont-worry-be-hoppy', catalogNumber: 3, medium: 'Giclée', dimensions: '8 × 10 in', year: 2023, categories: ['prints'] as ('prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 3 },
      { title: 'Morning Joe', slug: 'morning-joe', catalogNumber: 4, medium: 'Acrylic on panel', dimensions: '12 × 16 in', year: 2024, categories: ['originals'] as ('originals')[], availability: 'available' as const, priceDisplay: 'Original available · prints from $40', sortOrder: 4 },
      { title: 'Munchie Max', slug: 'munchie-max', catalogNumber: 5, medium: 'Giclée', dimensions: '11 × 14 in', year: 2023, categories: ['prints', 'cats'] as ('prints' | 'cats')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 5 },
      { title: 'Calle Color', slug: 'calle-color', catalogNumber: 6, medium: 'Acrylic + spray study', dimensions: '', year: 2025, categories: ['originals', 'murals'] as ('originals' | 'murals')[], availability: 'inquiry' as const, priceDisplay: 'Commission inquiry only', sortOrder: 6 },
      { title: 'Sol Mandala', slug: 'sol-mandala', catalogNumber: 7, medium: 'Ink', dimensions: '12 × 12 in', year: 2024, categories: ['mandalas', 'prints'] as ('mandalas' | 'prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 7 },
      { title: 'Static Bloom', slug: 'static-bloom', catalogNumber: 8, medium: 'Acrylic study', dimensions: '9 × 12 in', year: 2025, categories: ['originals'] as ('originals')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 8 },
      { title: 'Field Notes', slug: 'field-notes', catalogNumber: 9, medium: 'Risograph', dimensions: '8 × 8 in', year: 2025, categories: ['prints', 'murals'] as ('prints' | 'murals')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $30', sortOrder: 9 },
      { title: 'Siesta', slug: 'siesta', catalogNumber: 10, medium: 'Gouache', dimensions: '10 × 14 in', year: 2024, categories: ['originals', 'cats'] as ('originals' | 'cats')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 10 },
      { title: 'Luna Mandala', slug: 'luna-mandala', catalogNumber: 11, medium: 'Ink + gouache', dimensions: '18 × 18 in', year: 2024, categories: ['mandalas', 'prints'] as ('mandalas' | 'prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 11 },
      { title: 'Andes, in passing', slug: 'andes-in-passing', catalogNumber: 12, medium: 'Acrylic study', dimensions: '', year: 2025, categories: ['originals', 'murals'] as ('originals' | 'murals')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 12 },
    ]
    for (const artwork of artworksData) {
      await payload.create({
        collection: 'artworks',
        data: { ...artwork, _status: 'published' },
      })
    }
    results.push('Seeded 12 artworks')

    // Seed journal posts
    const postsData = [
      { title: 'The South American Adventure', slug: 'south-american-adventure', categories: ['adventure', 'travel'] as ('adventure' | 'travel')[], publishedDate: '2021-06-01', excerpt: 'Seven months, one backpack, and a slow journey back to where I began. The trip that grounded my sense of self in something other than a place.', featured: true, sortOrder: 1 },
      { title: 'A Return to Color', slug: 'return-to-color', categories: ['creativity'] as ('creativity')[], publishedDate: '2024-01-15', excerpt: 'On quieting the inner critic and learning to make things purely for the joy of it.', sortOrder: 2 },
      { title: 'Rooted in Two Worlds', slug: 'rooted-in-two-worlds', categories: ['essays'] as ('essays')[], publishedDate: '2023-06-01', excerpt: 'What it means to belong to two countries, and to find home in the work instead.', sortOrder: 3 },
      { title: 'Things I Learned From Poisoning Myself, Part I', slug: 'poisoning-myself-part-1', categories: ['adventure', 'travel'] as ('adventure' | 'travel')[], publishedDate: '2021-08-01', excerpt: "I breathed deep and tried to stay calm as the medicine's heat spread from the small burns on my arm.", sortOrder: 4 },
      { title: 'Lunch With a Bolivian Cholita', slug: 'bolivian-cholita', categories: ['travel'] as ('travel')[], publishedDate: '2021-07-15', excerpt: 'A quiet taxi-van ride turned into an unexpected lesson on my own assumptions.', sortOrder: 5 },
      { title: 'It All Began With James Bond', slug: 'james-bond', categories: ['essays', 'creativity'] as ('essays' | 'creativity')[], publishedDate: '2021-05-01', excerpt: 'A childhood love of the movies that quietly shaped how I see colour and story.', sortOrder: 6 },
      { title: 'Back to the Roots', slug: 'back-to-the-roots', categories: ['adventure', 'travel'] as ('adventure' | 'travel')[], publishedDate: '2021-04-01', excerpt: 'Returning to Chile to reconnect with my heritage, and to save my wilting Spanish.', sortOrder: 7 },
    ]
    for (const post of postsData) {
      await payload.create({
        collection: 'journal-posts',
        data: { ...post, _status: 'published' },
      })
    }
    results.push('Seeded 7 journal posts')

    // Seed site settings
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Belu Malu',
        tagline: 'Chilean artist, based in the U.S.',
        contactEmail: 'hello@belumalu.com',
        copyrightText: '© 2026 Belu Malu · Art by Belu Maluenda',
        footerText: 'Made and shared for the joy of it. Thank you for supporting the dream.',
        emailSignupHeading: 'Join the journey',
        emailSignupBody: 'New work, stories, and market dates.',
        socialLinks: [
          { platform: 'instagram', url: 'https://www.instagram.com/belumaluarts/', handle: '@belumaluarts' },
          { platform: 'ebay', url: 'https://www.ebay.com/usr/belumaluarts', handle: 'belumaluarts' },
          { platform: 'reddit', url: 'https://www.reddit.com/user/BeluMalu/', handle: 'u/BeluMalu' },
          { platform: 'discord', url: 'https://discord.com/invite/JDhb9sNH5n', handle: 'Join the server' },
          { platform: 'facebook', url: 'https://www.facebook.com/belumaluarts', handle: 'belumaluarts' },
        ],
      },
    })
    results.push('Seeded site settings')

    // Seed about page
    await payload.updateGlobal({
      slug: 'about-page',
      data: {
        intro: "Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn't fully express.",
        pullQuote: 'Who I am is not rooted in where I come from, but in the things I love to do.',
        pullQuoteAttribution: 'Belu Maluenda',
        studioHeading: 'Made by hand, shared with heart',
        studioText: "Most days you'll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it.",
        journeyStops: [
          { place: 'Chile', description: 'Santiago. Where it began.' },
          { place: 'The U.S.', description: 'Where I grew up, with one foot in each country.' },
          { place: 'South America', description: 'Seven months, solo, and a sense of self I could finally feel.' },
          { place: 'The Work', description: 'Making and sharing art, for the joy of it.' },
        ],
      },
    })
    results.push('Seeded about page')

    // Seed home page
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        heroEyebrow: 'Chilean artist, based in the U.S.',
        heroDateLabel: 'Studio journal, 2026',
        heroHeadline: 'Art rooted in\nmovement, memory,\nand joy.',
        heroHighlightWord: 'joy',
        heroSubtext: "I'm Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life.",
        statementQuote: "Born in Santiago and raised in the U.S., I've always had one foot in each world. My art is where they finally meet.",
        statementAttribution: 'Belu Maluenda, artist',
        featuredDescription: 'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.',
        shopHeading: 'A new collection is on the way.',
        shopBody: "Support the dream, take something home from an ever-evolving collection. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access.",
      },
    })
    results.push('Seeded home page')

    // Seed shop page
    await payload.updateGlobal({
      slug: 'shop-page',
      data: {
        heading: 'A new collection is on the way.',
        bodyText: "Hey there, thanks for stopping by my lil' shop. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you're looking for an original, commission, or retired favourite.",
        signature: 'Thank you for the support. love, Belu',
        productCategories: [
          { title: 'Originals', description: 'One-of-a-kind paintings, signed and ready to hang.', priceRange: 'By inquiry' },
          { title: 'Fine Art Prints', description: 'Giclée reproductions on premium archival paper.', priceRange: 'From $35' },
          { title: 'Wearable Art', description: "Screen-printed tees you'll actually want to live in.", priceRange: 'From $32' },
          { title: 'Small Joys', description: 'Stickers, magnets, and little handmade things.', priceRange: 'From $4' },
        ],
      },
    })
    results.push('Seeded shop page')

    return NextResponse.json({ message: 'Seed complete!', results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 },
    )
  }
}
