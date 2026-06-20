import type { CollectionConfig } from 'payload'

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'catalogNumber', 'categories', 'availability'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'catalogNumber',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'medium',
      type: 'text',
      admin: {
        description: 'e.g. "Acrylic on canvas"',
      },
    },
    {
      name: 'dimensions',
      type: 'text',
      admin: {
        description: 'e.g. "16 × 20 in"',
      },
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Originals', value: 'originals' },
        { label: 'Prints', value: 'prints' },
        { label: 'Mandalas', value: 'mandalas' },
        { label: 'Cats', value: 'cats' },
        { label: 'Murals / Experiments', value: 'murals' },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Prints Only', value: 'prints-only' },
        { label: 'Commission / Inquiry', value: 'inquiry' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priceDisplay',
      type: 'text',
      admin: {
        description: 'e.g. "Original available · prints from $40"',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
