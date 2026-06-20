import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroEyebrow',
              type: 'text',
              defaultValue: 'Chilean artist, based in the U.S.',
            },
            {
              name: 'heroDateLabel',
              type: 'text',
              defaultValue: 'Studio journal, 2026',
            },
            {
              name: 'heroHeadline',
              type: 'textarea',
              defaultValue: 'Art rooted in\nmovement, memory,\nand joy.',
              admin: {
                description: 'Each line becomes a separate animated line. The last word can be styled with emphasis.',
              },
            },
            {
              name: 'heroHighlightWord',
              type: 'text',
              defaultValue: 'joy',
              admin: {
                description: 'This word in the headline will be styled in red italic.',
              },
            },
            {
              name: 'heroSubtext',
              type: 'textarea',
              defaultValue:
                "I'm Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life.",
            },
            {
              name: 'heroFeaturedArtwork',
              type: 'relationship',
              relationTo: 'artworks',
            },
            {
              name: 'heroPortrait',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Featured Work',
          fields: [
            {
              name: 'featuredArtwork',
              type: 'relationship',
              relationTo: 'artworks',
            },
            {
              name: 'featuredDescription',
              type: 'textarea',
              defaultValue:
                'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.',
            },
          ],
        },
        {
          label: 'Artist Statement',
          fields: [
            {
              name: 'statementPortrait',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'statementQuote',
              type: 'textarea',
              defaultValue:
                "Born in Santiago and raised in the U.S., I've always had one foot in each world. My art is where they finally meet.",
            },
            {
              name: 'statementAttribution',
              type: 'text',
              defaultValue: 'Belu Maluenda, artist',
            },
          ],
        },
        {
          label: 'Shop Preview',
          fields: [
            {
              name: 'shopHeading',
              type: 'text',
              defaultValue: 'A new collection is on the way.',
            },
            {
              name: 'shopBody',
              type: 'textarea',
              defaultValue:
                "Support the dream, take something home from an ever-evolving collection. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access.",
            },
            {
              name: 'shopPreviewProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 4,
            },
          ],
        },
        {
          label: 'Journal Preview',
          fields: [
            {
              name: 'journalPreviewPosts',
              type: 'relationship',
              relationTo: 'journal-posts',
              hasMany: true,
              maxRows: 3,
            },
          ],
        },
      ],
    },
  ],
}
