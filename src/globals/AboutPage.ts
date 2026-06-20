import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  fields: [
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        "Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn't fully express.",
    },
    {
      name: 'chapters',
      type: 'array',
      admin: {
        description: 'The numbered story sections (01 Chile, 02 The U.S., etc.)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      name: 'pullQuote',
      type: 'textarea',
      defaultValue: 'Who I am is not rooted in where I come from, but in the things I love to do.',
    },
    {
      name: 'pullQuoteAttribution',
      type: 'text',
      defaultValue: 'Belu Maluenda',
    },
    {
      name: 'studioPortrait',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'studioHeading',
      type: 'text',
      defaultValue: 'Made by hand, shared with heart',
    },
    {
      name: 'studioText',
      type: 'textarea',
      defaultValue:
        "Most days you'll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it.",
    },
    {
      name: 'journeyStops',
      type: 'array',
      admin: {
        description: 'The journey timeline at the bottom of the page',
      },
      fields: [
        {
          name: 'place',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
}
