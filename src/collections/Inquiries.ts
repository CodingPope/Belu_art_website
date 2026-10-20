import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Commission', value: 'commission' },
        { label: 'Original Purchase', value: 'original' },
        { label: 'Wholesale / Stockist', value: 'wholesale' },
        { label: 'Event / Collaboration', value: 'event' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'artwork',
      type: 'relationship',
      relationTo: 'artworks',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'newsletterOptIn',
      type: 'checkbox',
      label: 'Opted in to newsletter',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
