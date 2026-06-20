import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Artworks } from './collections/Artworks'
import { Products } from './collections/Products'
import { JournalPosts } from './collections/JournalPosts'
import { Subscribers } from './collections/Subscribers'
import { Markets } from './collections/Markets'
import { Inquiries } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ConnectPage } from './globals/ConnectPage'
import { ShopPage } from './globals/ShopPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Belu Malu',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['artworks', 'journal-posts', 'products'],
      globals: ['home-page', 'about-page', 'connect-page', 'shop-page'],
      url: ({ data, collectionConfig, globalConfig }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        if (globalConfig?.slug === 'home-page') return base
        if (globalConfig?.slug === 'about-page') return `${base}/about`
        if (globalConfig?.slug === 'connect-page') return `${base}/connect`
        if (globalConfig?.slug === 'shop-page') return `${base}/shop`
        if (collectionConfig?.slug === 'artworks') return `${base}/gallery`
        if (collectionConfig?.slug === 'journal-posts') return `${base}/journal/${(data as Record<string, unknown>)?.slug || ''}`
        if (collectionConfig?.slug === 'products') return `${base}/shop`
        return base
      },
    },
  },
  collections: [Users, Media, Artworks, Products, JournalPosts, Subscribers, Markets, Inquiries],
  globals: [SiteSettings, HomePage, AboutPage, ConnectPage, ShopPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
