import 'server-only'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@payload-config'

export async function payloadClient() {
  return getPayload({ config: await config })
}

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await payloadClient()
      const settings = await payload.findGlobal({ slug: 'site-settings' })
      return settings ?? null
    } catch (_e) {
      return null
    }
  },
  ['site-settings'],
  { revalidate: 60 },
)

// Enabled promotions; date windows are checked client-side so a cached
// list can't show a campaign past its end time.
export const getPromotions = unstable_cache(
  async () => {
    try {
      const payload = await payloadClient()
      const res = await payload.find({
        collection: 'promotions',
        where: { enabled: { equals: true } },
        sort: '-priority',
        depth: 1,
        limit: 20,
      })
      return res.docs
    } catch (_e) {
      return []
    }
  },
  ['promotions'],
  { revalidate: 60 },
)
