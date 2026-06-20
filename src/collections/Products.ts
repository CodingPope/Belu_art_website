import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'priceDisplay'],
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Originals', value: 'originals' },
        { label: 'Fine Art Prints', value: 'prints' },
        { label: 'Wearable Art', value: 'wearable' },
        { label: 'Small Joys', value: 'small-joys' },
      ],
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'priceDisplay',
      type: 'text',
      admin: {
        description: 'e.g. "From $35"',
      },
    },
    {
      name: 'productStatus',
      type: 'select',
      defaultValue: 'coming-soon',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Coming Soon', value: 'coming-soon' },
        { label: 'Sold Out', value: 'sold-out' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'relatedArtwork',
      type: 'relationship',
      relationTo: 'artworks',
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
