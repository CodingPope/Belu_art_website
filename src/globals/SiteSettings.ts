import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Belu Malu',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Chilean artist, based in the U.S.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'hello@belumalu.com',
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
      defaultValue: 'Made and shared for the joy of it. Thank you for supporting the dream.',
    },
    {
      name: 'emailSignupHeading',
      type: 'text',
      defaultValue: 'Join the journey',
    },
    {
      name: 'emailSignupBody',
      type: 'textarea',
      defaultValue: 'New work, stories, and market dates.',
    },
  ],
}
