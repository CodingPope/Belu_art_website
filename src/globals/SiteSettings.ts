import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'hello@belumalu.com',
      admin: { description: 'Shown on the Connect page for people who prefer email.' },
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2026 Belu Malu · Art by Belu Maluenda',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'eBay', value: 'ebay' },
            { label: 'Reddit', value: 'reddit' },
            { label: 'Discord', value: 'discord' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'handle',
          type: 'text',
          admin: {
            description: 'e.g. "@belumaluarts"',
          },
        },
      ],
    },
    {
      name: 'footerText',
      type: 'textarea',
      defaultValue: 'Original paintings, fine art prints, and wearable art, made by hand.',
    },
    {
      name: 'emailSignupHeading',
      type: 'text',
      defaultValue: 'Join the journey',
      admin: { description: 'Footer newsletter heading.' },
    },
    {
      name: 'emailSignupBody',
      type: 'textarea',
      defaultValue: 'New work, print drops, and event dates.',
    },
  ],
}
