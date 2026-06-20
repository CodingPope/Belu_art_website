import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Shop', value: 'shop' },
        { label: 'Journal', value: 'journal' },
        { label: 'Footer', value: 'footer' },
        { label: 'Cart', value: 'cart' },
      ],
    },
  ],
}
