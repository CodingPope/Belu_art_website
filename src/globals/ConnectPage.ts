import type { GlobalConfig } from 'payload'

export const ConnectPage: GlobalConfig = {
  slug: 'connect-page',
  label: 'Connect Page',
  fields: [
    {
      name: 'leadText',
      type: 'textarea',
      defaultValue:
        "For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I'd love to hear from you. I read every message myself.",
    },
    {
      name: 'inPersonText',
      type: 'textarea',
      defaultValue:
        'In person, find Belu Malu tees, prints, and stickers at every Abstract Denver location.',
    },
  ],
}
