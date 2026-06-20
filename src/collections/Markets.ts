import type { CollectionConfig } from 'payload'

export const Markets: CollectionConfig = {
  slug: 'markets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'dateInfo'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Live / Stocked Now', value: 'live' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'TBA', value: 'tba' },
      ],
    },
    {
      name: 'dateInfo',
      type: 'text',
      admin: {
        description: 'e.g. "Stocked now · all locations" or "Denver, CO · dates TBA"',
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
