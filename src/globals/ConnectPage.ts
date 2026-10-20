import type { GlobalConfig } from 'payload'

export const ConnectPage: GlobalConfig = {
  slug: 'connect-page',
  label: 'Connect Page',
  admin: {
    description: 'Social links themselves are managed in Site Settings → Social Links.',
  },
  fields: [
    {
      name: 'leadText',
      type: 'textarea',
      defaultValue:
        "For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I'd love to hear from you. I read every message myself.",
    },
    {
      name: 'newsletterConsentText',
      type: 'textarea',
      defaultValue:
        "Yes, add me to Belu's email list for new work, print drops, and event dates. Unsubscribe anytime.",
      admin: {
        description: 'Label for the optional newsletter checkbox on the contact form.',
      },
    },
    {
      name: 'inPersonText',
      type: 'textarea',
      defaultValue:
        'In person, find Belu Malu tees, prints, and stickers at every Abstract Denver location.',
    },
  ],
}
