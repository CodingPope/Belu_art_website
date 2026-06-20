import type { Metadata } from 'next'
import Link from 'next/link'
import { payloadClient } from '../server'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Support the dream. Originals, fine art prints, wearable art, and small joys by Belu Maluenda.',
}
import { Frame } from '@/components/Frame'
import { EmailSignup } from '@/components/EmailSignup'
import { StarIcon, ArrowIcon } from '@/components/Icons'
import { getImageUrl } from '@/types'
import type { ProductDoc, MediaDoc } from '@/types'

export const revalidate = 60

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
  const categories = (shopData.productCategories as { title: string; description?: string; priceRange?: string }[]) || [
    { title: 'Originals', description: 'One-of-a-kind paintings, signed and ready to hang.', priceRange: 'By inquiry' },
    { title: 'Fine Art Prints', description: 'Giclée reproductions on premium archival paper.', priceRange: 'From $35' },
    { title: 'Wearable Art', description: "Screen-printed tees you'll actually want to live in.", priceRange: 'From $32' },
    { title: 'Small Joys', description: 'Stickers, magnets, and little handmade things.', priceRange: 'From $4' },
  ]

  return (
    <div className="section">
      <div className="wrap">
        <div className="chap" data-r>
          <div className="ttl">
            <span className="kicker k">The shop</span>
            <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>Support the dream</h2>
          </div>
          <Link className="link act" href="/cart">
            View cart
            <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
              <ArrowIcon />
            </svg>
          </Link>
        </div>

        <div className="shop-lead" data-r>
          <div>
            <p className="big">{heading}</p>
            <p className="note">
              {bodyText}
              <span className="sig">{signature}</span>
            </p>
          </div>
          <div>
            <div className="card">
              <div className="kicker">First access</div>
              <h3>Join the list</h3>
              <p>New work, market dates, and first dibs on the next collection. No noise.</p>
              <EmailSignup id="joinShop" source="shop" />
            </div>
          </div>
        </div>

        <div data-r>
          <div className="ph-row" style={{ marginBottom: '1.5rem' }}>
            <span className="kicker">What you&apos;ll find when it opens</span>
          </div>
          <div className="cats4">
            {categories.map((cat, i) => (
              <div className="cat4" key={i}>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <span className="pr">{cat.priceRange}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cards3" style={{ marginTop: 'clamp(2.4rem, 4vw, 3.2rem)' }} data-r>
          <div className="card">
            <div className="kicker">In person</div>
            <h3>Abstract Denver</h3>
            <p>Tees, prints, and stickers are stocked in store, at every Abstract Denver location.</p>
            <Link className="link" href="/connect">
              Stockist details
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
          <div className="card">
            <div className="kicker">Originals &amp; commissions</div>
            <h3>By inquiry</h3>
            <p>Looking for an original or a custom piece? I&apos;d love to talk it through.</p>
            <Link className="link" href="/connect">
              Get in touch
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
          <div className="card">
            <div className="kicker">Past favourites</div>
            <h3>Ask me</h3>
            <p>Had your eye on a retired piece? Message me, it may still be in the flat file.</p>
            <Link className="link" href="/connect">
              Send a note
              <svg className="ar" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }}>
                <ArrowIcon />
              </svg>
            </Link>
          </div>
        </div>

        <div className="preview-wrap" data-r>
          <div className="ph-row">
            <span className="kicker">A look at what&apos;s coming</span>
            <span className="soon">Next collection · preview</span>
          </div>
          <div className="preview-grid">
            {products.length > 0
              ? products.map((product) => (
                  <Link className="alink" href="/shop" key={product.id}>
                    <Frame
                      src={getImageUrl(product.image as MediaDoc, 'gallery')}
                      alt={product.title}
                      aspectRatio="1/1"
                      label={{
                        category: product.category || '',
                        title: product.title,
                        meta: product.productStatus === 'coming-soon' ? 'Coming soon' : product.priceDisplay || '',
                      }}
                    />
                  </Link>
                ))
              : (
                <>
                  <Link className="alink" href="/shop">
                    <Frame alt="Neuroasis" aspectRatio="1/1" placeholderClass="art--neuroasis" label={{ category: 'Fine art print', title: 'Neuroasis', meta: 'Coming soon' }} />
                  </Link>
                  <Link className="alink" href="/shop">
                    <Frame alt="Be Hoppy Tee" aspectRatio="1/1" placeholderClass="art--hoppy" label={{ category: 'Wearable art', title: 'Be Hoppy Tee', meta: 'Coming soon' }} />
                  </Link>
                  <Link className="alink" href="/shop">
                    <Frame alt="Tito Mandala" aspectRatio="1/1" placeholderClass="art--mandala" label={{ category: 'Fine art print', title: 'Tito Mandala', meta: 'Coming soon' }} />
                  </Link>
                  <Link className="alink" href="/shop">
                    <Frame alt="Sticker Pack" aspectRatio="1/1" placeholderClass="art--munchie" label={{ category: 'Small joys', title: 'Sticker Pack', meta: 'Coming soon' }} />
                  </Link>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
