import type { CollectionConfig } from 'payload'

// Backend-only for now: not linked from public navigation or rendered anywhere.
// Ready for a later homepage "As seen in" block or a /press page.
export const PressMentions: CollectionConfig = {
  slug: 'press-mentions',
  labels: {
    singular: 'Press Mention',
    plural: 'Press',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['outlet', 'title', 'date', 'featured'],
    description: 'Articles, interviews, and features. Not shown on the public site yet.',
  },
  fields: [
    {
      name: 'outlet',
      type: 'text',
      label: 'Outlet / publication',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Headline of the article, episode, or feature.' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'quote',
      type: 'textarea',
      label: 'Quote / summary',
      admin: { description: 'A short pull quote or one-line summary.' },
    },
    {
      name: 'url',
      type: 'text',
      label: 'External link',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo / thumbnail',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
