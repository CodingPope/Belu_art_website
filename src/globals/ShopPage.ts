import type { GlobalConfig } from 'payload'

export const ShopPage: GlobalConfig = {
  slug: 'shop-page',
  label: 'Shop Page',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'A new collection is on the way.',
    },
    {
      name: 'bodyText',
      type: 'textarea',
      defaultValue:
        "Hey there, thanks for stopping by my lil' shop. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you're looking for an original, commission, or retired favourite.",
    },
    {
      name: 'signature',
      type: 'text',
      defaultValue: 'Thank you for the support. love, Belu',
    },
    {
      name: 'productCategories',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'priceRange',
          type: 'text',
          admin: {
            description: 'e.g. "From $35" or "By inquiry"',
          },
        },
      ],
    },
  ],
}
