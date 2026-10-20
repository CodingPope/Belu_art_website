import type { Metadata } from 'next'
import Link from 'next/link'
import { payloadClient } from '../server'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Originals, fine art prints, wearable art, and small joys by Belu Maluenda.',
}
import { Frame } from '@/components/Frame'
import { EmailSignup } from '@/components/EmailSignup'
import { FilterChips } from '@/components/FilterChips'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl, getImageAlt } from '@/types'
import type { ProductDoc, MediaDoc } from '@/types'

export const revalidate = 60

/* Matches the Products collection's category options */
const categoryLabels: Record<string, string> = {
  originals: 'Originals',
  prints: 'Fine Art Prints',
  wearable: 'Wearable Art',
  'small-joys': 'Small Joys',
}

const defaultProducts = [
  { placeholderClass: 'art--neuroasis', category: 'prints', title: 'Neuroasis' },
  { placeholderClass: 'art--hoppy', category: 'wearable', title: 'Be Hoppy Tee' },
  { placeholderClass: 'art--mandala', category: 'prints', title: 'Tito Mandala' },
  { placeholderClass: 'art--munchie', category: 'small-joys', title: 'Sticker Pack' },
]

const otherWays = [
  { kicker: 'Stockist', title: 'Abstract Denver', body: 'Tees, prints, and stickers in store', href: '/events', cta: 'Events & stockists' },
  { kicker: 'Originals & commissions', title: 'By inquiry', body: 'An original or a custom piece', href: '/connect', cta: 'Get in touch' },
  { kicker: 'Past favourites', title: 'Ask me', body: 'It may still be in the flat file', href: '/connect', cta: 'Send a note' },
]

export default async function ShopPage() {
  let shopData: Record<string, unknown> = {}
  let products: ProductDoc[] = []

  try {
    const payload = await payloadClient()
    const [shopGlobal, res] = await Promise.all([
      payload.findGlobal({ slug: 'shop-page' }),
      payload.find({
        collection: 'products',
        sort: 'sortOrder',
        limit: 50,
        where: { _status: { equals: 'published' } },
      }),
    ])
    shopData = shopGlobal as Record<string, unknown>
    products = res.docs as unknown as ProductDoc[]
  } catch {
    // DB not connected
  }

  const heading = (shopData.heading as string) || 'A new collection is on the way.'
  const bodyText = (shopData.bodyText as string) || "Hey there, thanks for stopping by my lil' shop. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you're looking for an original, commission, or retired favourite."
  const signature = (shopData.signature as string) || 'Thank you for the support. love, Belu'

  const items =
    products.length > 0
      ? products.map((product) => {
          const soon = product.productStatus === 'coming-soon'
          return {
            key: product.id,
            src: getImageUrl(product.image as MediaDoc, 'gallery'),
            alt: getImageAlt(product.image as MediaDoc) || product.title,
            placeholderClass: '',
            category: product.category || '',
            title: product.title,
            meta: soon ? 'Coming soon' : product.productStatus === 'sold-out' ? 'Sold out' : product.priceDisplay || '',
            soon,
          }
        })
      : defaultProducts.map((item) => ({ ...item, key: item.title, src: null, alt: item.title, meta: 'Coming soon', soon: true }))

  // Only offer filters for categories that actually have products
  const filters = Object.entries(categoryLabels)
    .filter(([value]) => items.some((item) => item.category === value))
    .map(([value, label]) => ({ value, label }))

  return (
    <>
      {/* PRODUCTS — first thing on the page */}
      <section className="section mod shop-top">
        <div className="wrap">
          <div className="chap" data-r>
            <div className="ttl">
              <span className="kicker k">The shop</span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>Bring the work home</h2>
              <p className="mod-sub">{heading}</p>
            </div>
            <Link className="link act" href="/cart">
              View cart
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>

          {filters.length > 1 && <FilterChips filters={filters} items={null} targetId="shopGrid" />}

          <div className="shop-grid" id="shopGrid" data-r>
            {items.map((item) => (
              <div className={`shop-item${item.soon ? ' is-soon' : ''}`} data-cat={item.category} key={item.key}>
                <Frame
                  src={item.src}
                  alt={item.alt}
                  aspectRatio="1/1"
                  placeholderClass={item.placeholderClass}
                  label={{ category: categoryLabels[item.category] || '', title: item.title, meta: item.meta }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTE + NEWSLETTER */}
      <section className="section mod bg-gray">
        <div className="wrap">
          <div className="mod-news shop-note" data-r>
            <div>
              <span className="eyebrow">
                <StarIcon className="star" />
                A note from Belu
              </span>
              <p>
                {bodyText}
                {signature && <span className="shop-sig">{signature}</span>}
              </p>
            </div>
            <div>
              <span className="kicker">First access</span>
              <EmailSignup id="joinShop" source="shop" />
            </div>
          </div>

          {/* OTHER WAYS TO BUY */}
          <ul className="shop-ways" data-r>
            {otherWays.map((way) => (
              <li key={way.title}>
                <Link href={way.href}>
                  <span className="kicker">{way.kicker}</span>
                  <span className="t">{way.title}</span>
                  <span className="m">{way.body}</span>
                  <span className="link">
                    {way.cta}
                    <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                      <ArrowIcon />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
