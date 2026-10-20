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
              defaultValue: 'Art, prints & events · 2026',
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
              admin: { description: 'Artwork in the hero. Defaults to the first artwork in the gallery.' },
            },
            {
              name: 'heroPortrait',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Photo of Belu shown beside the hero artwork.' },
            },
          ],
        },
        {
          label: 'About Me',
          description: 'The short About Me module on the home page.',
          fields: [
            {
              name: 'statementPortrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portrait',
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
              admin: { description: 'One line under the "Bring the work home" heading.' },
            },
            {
              name: 'shopPreviewProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 3,
              admin: { description: 'Up to 3 products shown on the home page.' },
            },
          ],
        },
      ],
    },
  ],
}
