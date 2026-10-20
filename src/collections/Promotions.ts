import type { CollectionConfig } from 'payload'

export const promoPages = [
  { label: 'All pages', value: 'all' },
  { label: 'Home', value: 'home' },
  { label: 'Shop', value: 'shop' },
  { label: 'Gallery', value: 'gallery' },
  { label: 'Events', value: 'events' },
  { label: 'About', value: 'about' },
  { label: 'Connect', value: 'connect' },
]

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: {
    singular: 'Promotion',
    plural: 'Promotions',
  },
  admin: {
    useAsTitle: 'internalName',
    defaultColumns: ['internalName', 'enabled', 'campaignType', 'startDate', 'endDate'],
    description:
      'Pop-ups and banners for sales, launches, events, and newsletter sign-ups. Only one shows at a time: the highest-priority active promotion for that page.',
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      required: true,
      admin: { description: 'Just for you, e.g. "Spring print sale 2027".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'campaignType',
          type: 'select',
          defaultValue: 'sale',
          options: [
            { label: 'Print sale', value: 'sale' },
            { label: 'Collection launch', value: 'launch' },
            { label: 'Event promotion', value: 'event' },
            { label: 'Newsletter incentive', value: 'newsletter' },
          ],
          admin: {
            description: 'Newsletter promotions show an email sign-up instead of a button.',
          },
        },
        {
          name: 'display',
          type: 'select',
          defaultValue: 'modal',
          options: [
            { label: 'Pop-up (center)', value: 'modal' },
            { label: 'Banner (bottom, less intrusive)', value: 'banner' },
          ],
        },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Shown in pop-ups only.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button label',
          admin: {
            condition: (_, sibling) => sibling?.campaignType !== 'newsletter',
          },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Button link',
          admin: {
            description: 'e.g. "/shop" or a full URL',
            condition: (_, sibling) => sibling?.campaignType !== 'newsletter',
          },
        },
      ],
    },
    {
      name: 'targetPages',
      type: 'select',
      hasMany: true,
      defaultValue: ['all'],
      options: promoPages,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Optional. Leave empty to start immediately.',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Optional. Leave empty to run until disabled.',
      },
    },
    {
      name: 'triggerDelay',
      type: 'number',
      label: 'Delay (seconds)',
      defaultValue: 6,
      min: 0,
      max: 120,
      admin: {
        position: 'sidebar',
        description: 'How long a visitor is on the page before it appears.',
      },
    },
    {
      name: 'dismissFrequency',
      type: 'select',
      label: 'After closing, show again',
      defaultValue: '7',
      options: [
        { label: 'Never', value: 'never' },
        { label: 'Next visit (new browser session)', value: 'session' },
        { label: 'After 1 day', value: '1' },
        { label: 'After 7 days', value: '7' },
        { label: 'After 30 days', value: '30' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'If several promotions are active on a page, the highest number wins.',
      },
    },
  ],
}
