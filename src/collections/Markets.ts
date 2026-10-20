import type { CollectionConfig } from 'payload'

// Shown as "Events" in the admin and on the site. The slug stays `markets`
// so existing records and DB tables are preserved.
export const Markets: CollectionConfig = {
  slug: 'markets',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventType', 'startDate', 'status'],
    description:
      'Markets, pop-ups, festivals, and shows. Use the "Stockist" type for permanent shops that carry your work.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'eventType',
      type: 'select',
      defaultValue: 'market',
      options: [
        { label: 'Market', value: 'market' },
        { label: 'Pop-up', value: 'pop-up' },
        { label: 'Festival', value: 'festival' },
        { label: 'Exhibition / Show', value: 'exhibition' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Stockist (year-round)', value: 'stockist' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: 'Leave empty if dates are not announced yet.',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: 'Only for multi-day events.',
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'e.g. "Denver, CO" or "RiNo Art District, Denver"',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Event link',
      admin: {
        description: 'Optional link to tickets, the event page, or the stockist.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Happening now / Stocked now', value: 'live' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'TBA', value: 'tba' },
        { label: 'Past', value: 'past' },
      ],
      admin: {
        description: 'Events whose end date has passed are archived automatically.',
      },
    },
    {
      name: 'dateInfo',
      type: 'text',
      label: 'Date label (optional)',
      admin: {
        description: 'Overrides the formatted date, e.g. "Every Saturday in June" or "Dates TBA".',
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
