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
