import type { CollectionConfig } from 'payload'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'publishedDate', 'featured'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'The South American Adventure', value: 'adventure' },
        { label: 'Travel Stories', value: 'travel' },
        { label: 'Notes on Creativity', value: 'creativity' },
        { label: 'Personal Essays', value: 'essays' },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
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
